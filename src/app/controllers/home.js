const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
    index(req, res) {
        let { filter } = req.query;

        Recipe.findBy(filter, function(recipes) {
            return res.render("./home/index", { recipes, filter });
        });
    },
    about(req, res) {
        return res.render("./home/about");
    },
    recipes(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 3;

        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                
            if (recipes[0]) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                };

                return res.render("./home/recipes", { recipes, pagination, filter });
            } else {
                return res.render("./home/recipes", { recipes, filter });
            }

            }
        };

        Recipe.paginate(params);
    }, 
    recipePage(req, res) {
        Recipe.find(req.params.id, function(item) {
           if(!item) return res.send("Recipe not found!");
           
           return res.render("./home/recipePage", { item });
        });
    },
    chefs(req, res) {
        Chef.all(function(chefs) {
           return res.render("./home/chefs", { chefs }); 
        });
    }
}

// exports.index = function (req, res) {
//     return res.render("./home/index", { recipes: data.recipes });
// }

// exports.about = function (req, res) {
//     return res.render("./home/about");
// }

// exports.recipes = function (req, res) {
//     return res.render("./home/recipes", { recipes: data.recipes });
// }

// exports.recipePage = function (req, res) {
//     const {id} = req.params;
//     const foundRecipe = data.recipes.find(function (recipe) {
//         return recipe.id == id;
//     });
//     if(!foundRecipe){
//         return res.send("Sorry! Not found");
//     }

//     return res.render("./home/recipePage", { item: foundRecipe });
// }