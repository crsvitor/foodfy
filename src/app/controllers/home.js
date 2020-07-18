const Home = require('../models/Home-db');
const a  = require('')

module.exports = {
    index(req, res) {
        Home.all(function (recipes) {
            return res.render("./home/index", {recipes});            
        });
    },
    about(req, res) {
        return res.render("./home/about");
    },
    recipes(req, res) {
        Home.all(function (recipes) {
            return res.render("../views/home/recipes", {recipes});            
        });
    }, 
    recipePage(req, res) {
        return res.render("./home/recipePage");
    }
}


exports.index = function (req, res) {
    return res.render("./home/index", { recipes: data.recipes });
}

exports.about = function (req, res) {
    return res.render("./home/about");
}

exports.recipes = function (req, res) {
    return res.render("./home/recipes", { recipes: data.recipes });
}

exports.recipePage = function (req, res) {
    const {id} = req.params;
    const foundRecipe = data.recipes.find(function (recipe) {
        return recipe.id == id;
    });
    if(!foundRecipe){
        return res.send("Sorry! Not found");
    }

    return res.render("./home/recipePage", { item: foundRecipe });
}