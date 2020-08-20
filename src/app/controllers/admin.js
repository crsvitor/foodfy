const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
    redirect(req, res) {
        return res.redirect("/admin/recipes");
    },
    async index(req, res) {
        try {
            let results = await Recipe.all();
            const recipes = results.rows;

            if(!recipes) {
                return res.send("Recipes not found");
            }

            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                );                
            
                return files[0];
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            });

            const allSet = await Promise.all(recipesPromise);


            return res.render("./admin/index", { recipes: allSet });
        } catch {

        }
    },
    async create(req, res) {
        let results = await Recipe.chefSelectOptions();
        const options = results.rows;

        return res.render("./admin/create", { chefOptions: options }) 
    },
    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        if (req.files.length == 0) {
            return res.send('Please, send at least one image');
        }

        let results = await Recipe.create(req.body);
        const recipe_id = results.rows[0].id;

        const filesPromise = req.files.map(file => File.create({...file, recipe_id}));
        await Promise.all(filesPromise);

        return res.redirect(`/admin/recipes/${recipe_id}`);
    },
    async show(req, res) {
        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];

        if (!recipe) return res.send("Recipe not found!");

        results = await Recipe.files(recipe.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        return res.render("admin/show", { recipe, files });
    },
    async edit(req, res) {
        let results = await Recipe.find(req.params.id);
        const recipe = results.rows[0];

        if(!recipe) return res.send("Recipe not found!");

        results = await Recipe.chefSelectOptions();
        const chefs = results.rows;

        results = await Recipe.files(recipe.id);
        let files = results.rows;
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));
        
        return res.render("./admin/edit", { recipe, chefOptions: chefs, files });
    },
    async put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information" && key != "removed_files") {
                return res.send("Please, fill all fields!");
            }
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromise = removedFiles.map(id => File.delete(id));

            await Promise.all(removedFilesPromise);
        }

        if(req.files.length != 0) {
            const oldFiles = await Recipe.files(req.body.id);
            const totalFiles = oldFiles.rows.length + req.files.length;

            if (totalFiles <= 5) {
                const newFilesPromise = req.files.map(file => 
                    File.create({...file, recipe_id: req.body.id}));
                
                await Promise.all(newFilesPromise);
            }
        }

        await Recipe.update(req.body);

        return res.redirect(`/admin/recipes/${req.body.id}`);
    },
    async delete(req, res) {
        await Recipe.delete(req.body.id);

        return res.redirect("/admin/recipes");
    },

    // Chefs

    async indexChefs(req, res) {
        // let all = await Chef.all();
        // const chefs = all.rows;

        try {
            let results = await Chef.all();
            const chefs = results.rows;

            if(!chefs) {
                return res.send("Chefs not found");
            }

            async function getImage(chefId) {
                let results = await Chef.files(chefId);
                const files = results.rows.map(file => 
                    `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                );

                return files[0];
            }

            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.id)
                return chef
            });

            const allChefs = await Promise.all(chefsPromise);

            return res.render("./admin/chefs", { chefs: allChefs });
        
        } catch {
            console.error(err);
        }

        return res.render("./admin/chefs", { chefs });            
    },
    createChef(req, res) {
        return res.render("./admin/createChef");
    },
    async postChef(req, res) {
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all the fields!");
            }
        }

        if (req.files.length == 0) {
            return res.send("Please, select at least one image");
        }

        const filePromise = req.files.map(file => File.createChefFile({...file}));
        let results = await filePromise[0];
        const fileId = results.rows[0].id;

        results = await Chef.create(req.body, fileId);
        const chefId = results.rows[0].id;

        return res.redirect(`/admin/chefs/${chefId}`); 
    },
    async showChef(req, res) {
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        if (!chef) return res.send("Chef not found!");

        results = await Chef.files(chef.id);
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));


        let recipes = await Recipe.findByChef(chef.id);
        
        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId);
            const files = results.rows.map(file =>
                `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            );
            
            return files[0];
        }

        const recipesPromises = recipes.rows.map(async recipe => {
            recipe.img = await getImage(recipe.id)
            return recipe
        });

        const allFiles = await Promise.all(recipesPromises);  

        return res.render("admin/showChef", { chef, recipes: allFiles, files });
    },
    async editChef(req, res) {
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];

        if(!chef) {
            return res.send("Sorry, chef not found!");
        }

        results = await Chef.files(chef.id);
        let files = results.rows;

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));      

        return res.render("./admin/editChef", { chef, file: files[0].src });
    },
    async putChef(req, res) {
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if(req.body[key] == "" && key != "removed_files") {
                return res.send("Please, fill all the fields");
            }
        }

        let results = await Chef.files(req.body.id);
        let fileId = results.rows[0].id;

        if (req.files.length != 0) {
            const filesPromises = req.files.map(file => File.createChefFile({ ...file }));
            results = await filesPromises[0];
            fileId = results.rows[0].id;
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);

            const removedFilesPromises = removedFiles.map(id => File.delete(id));

            await Promise.all(removedFilesPromises);
        }

        await Chef.update(req.body, fileId);

        return res.redirect(`/admin/chefs/${req.body.id}`);
    },
    async deleteChef(req, res) {
        let results = await Chef.find(req.body.id);

        if (results.rows[0].total_recipes == 0) {
            await Chef.delete(req.body.id);
            return res.redirect("/admin/chefs")         
        } else {
            return res.send("Chefs who have recipes on our website cannot be deleted");
        }
    }
}

// const { recipes } = require('./home');

// exports.index = function (req, res) {
//     return res.render("./admin/index", { recipes: data.recipes });
// }

// exports.create = function (req, res) {
//     return res.render("./admin/create");
// }

// exports.show = function (req, res) {
//     const {id} = req.params;

//     const foundRecipe = data.recipes.find(function (recipe) {
//         return recipe.id == id;
//     });

//     if(!foundRecipe) return res.send("Sorry we didn't find anything");


//     return res.render("./admin/show", { recipe: foundRecipe });
// }

// exports.edit = function (req, res) {
//     const {id} = req.params;

//     const foundRecipe = data.recipes.find(function (recipe) {
//         return recipe.id == id;
//     });

//     if(!foundRecipe) return res.send("Sorry we didn't find anything");

//     return res.render(`./admin/edit`, { recipe: foundRecipe });
// }

// exports.post = function (req, res) {
//     const keys = Object.keys(req.body);

//     for (const key of keys) {
//         if(req.body[key] == ""){
//             return res.send("Please fill all the gaps");
//         }
//     }

//     let id = 1;
//     const lastRecipe = data.recipes[data.recipes.length - 1];

//     if(lastRecipe) {
//         id = lastRecipe.id + 1;
//     }

//     data.recipes.push({
//         id,
//         image,
//         title,
//         author,
//         ingredients,
//         prepariation,
//         information
//     });

//     fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
//         if(err){
//             return res.send("Sorry error saving");
//         }
//         return res.redirect(`/admin/recipes/${id}`);
//     });
// }

// exports.put = function (req, res) {
//     const {id} = req.body;
//     let index = 0;

//     const foundRecipe = data.recipes.find(function (recipe, foundIndex) {
//        if(recipe.id == id) {
//         index = foundIndex;
//         return true;
//        }
//     });

//     if(!foundRecipe) {
//         return res.send("Not found");
//     }

//     const recipe = {
//         ...foundRecipe,
//         ...req.body,
//         id: Number(id),
//     } 

//     data.recipes[index] = recipe;

//     fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
//         if(err) {
//             return res.send("We couldn't update your recipe, sorry!");
//         }
//         return res.redirect(`/admin/recipes/${id}`);
//     })
// }

// exports.delete = function (req, res) {
//     const {id} = req.body;
//     console.log(id);
    

//     const filteredRecipes = data.recipes.filter(function (recipe) {
//         return recipe.id != id;
//     });
//     console.log(filteredRecipes);
    

//     data.recipes = filteredRecipes;

//     fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) {
//         if(err) {
//             return res.send("We couldn't delete, sorry!")
//         }
//         return res.redirect("/admin/recipes");
//     })
// }