const Admin = require('../models/Admin-db');

module.exports = {
    redirect(req, res) {
        return res.redirect("/admin/recipes");
    },
    index(req, res) {
        return res.render("./admin/index");
    },
    create(req, res) {
        return res.render("./admin/create");
    },
    post(req, res) {
        return res.redirect(`/admin/recipes/`);
    },
    show(req, res) {
        return res.render("./admin/show");
    },
    edit(req, res) {
        return res.render(`./admin/edit`);
    },
    put(req, res) {
        return res.redirect(`/admin/recipes/${id}`);
    },
    delete(req, res) {
        return res.redirect("/admin/recipes");
    },


    indexChefs(req, res) {
        return res.render("./admin/chefs");
    },
    createChef(req, res) {
        return res.render("./admin/create");
    },
    showChef(req, res) {
        return res.render("./admin/show");
    },
    editChef(req, res) {
        return res.render(`./admin/edit`);
    },
    postChef(req, res) {
        return res.redirect(`/admin/recipes/`);
    },
    putChef(req, res) {
        return res.redirect(`/admin/recipes/${id}`);
    },
    deleteChef(req, res) {
        return res.redirect("/admin/recipes");
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