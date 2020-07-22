const Home = require('../models/Home-db');

module.exports = {
    index(req, res) {
    //     let { filter, page, limit } = req.query;

    //     page = page || 1;
    //     limit = limit || 2;
    //     let offset = limit * ( page - 1 );

    //     const params = {
    //         filter,
    //         page,
    //         limit, 
    //         offset,
    //         callback(recipes) {

    //             const pagination = {
    //                 total: Math.ceil(recipes[0].total / limit),
    //                 page
    //             };

    //             return res.render("./home/index", { recipes, pagination, filter });
    //         }
    //     };

    //     Home.paginate(params);
        Home.all(function(recipes) {
           return res.render("./home/index", { recipes });
        });
    },
    about(req, res) {
        return res.render("./home/about");
    },
    recipes(req, res) {
        // Home.paginate(function (recipes) {
        //     return res.render("../views/home/recipes", { recipes });            
        // });
        Home.all(function(recipes) {
            return res.render("./home/recipes", { recipes });
        });
    }, 
    recipePage(req, res) {
        Home.find(req.params.id, function(recipe) {
            if(!recipe) return res.send("Recipe not found");
            
            return res.render("./home/recipePage", { item: recipe });
        });
    },
    chefs(req, res) {
        return res.render("./home/chefs"); 
        Home.all(function(req, res) {
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