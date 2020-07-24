const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    redirect(req, res) {
        return res.redirect("/admin/recipes");
    },
    index(req, res) {
        Recipe.all(function(recipes) {
            return res.render("./admin/index", { recipes });
        });
    },
    create(req, res) {
        Recipe.chefSelectOptions(function(options) {
           return res.render("./admin/create", { chefOptions: options }) 
        });
    },
    post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        Recipe.create(req.body, function(recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`);
        });
    },
    show(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if(!recipe) return res.send("Recipe not found!");

            return res.render("./admin/show", { recipe });
        });
    },
    edit(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if(!recipe) return res.send("Recipe not found!");

            Recipe.chefSelectOptions(function(options) {
                return res.render("./admin/edit", { recipe, chefOptions: options });
            });
        });
    },
    put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "information") {
                return res.send("Please, fill all fields!");
            }
        }

        Recipe.update(req.body, function() {
            return res.redirect(`/admin/recipes/${req.body.id}`);
        });
    },
    delete(req, res) {
        Recipe.delete(req.body.id, function() {
            return res.redirect("/admin/recipes"); 
        });
    },


    indexChefs(req, res) {
        Chef.all(function(chefs) {
            return res.render("./admin/chefs", { chefs });            
        });
    },
    createChef(req, res) {
        return res.render("./admin/createChef");
    },
    postChef(req, res) {
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all the fields!");
            }
        }

        Chef.create(req.body, function(chef) {
           return res.redirect(`/admin/chefs/${chef.id}`); 
        });
    },
    showChef(req, res) {
        Chef.find(req.params.id, function(chef) {
            if (!chef) {
                return res.send("Sorry, chef not found!");
            }

            Chef.findRecipes(req.params.id, function(recipes) {
                return res.render("admin/showChef", { chef, recipes });
            });
        });
    },
    editChef(req, res) {
        Chef.find(req.params.id, function(chef) {
            if(!chef) {
                return res.send("Sorry, chef not found!");
            }

            return res.render("./admin/editChef", { chef });
        });
    },
    putChef(req, res) {
        const keys = Object.keys(req.body);

        for (const key of keys) {
            if(req.body[key] == "") {
                return res.send("Please, fill all the fields");
            }
        }

        Chef.update(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`);
        });
    },
    deleteChef(req, res) {
        Chef.find(req.body.id, function(chef) {
           if (chef.total_recipes == 0) {
               Chef.delete(req.body.id, function() {
                  return res.redirect("/admin/chefs"); 
               });
           } else {
               return res.send("Chefs who have recipes on our website cannot be deleted");
           }
        });
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