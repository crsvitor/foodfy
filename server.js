const express = require('express');
const nunjucks = require('nunjucks');
const recipes = require("./data");
const server = express();

server.use(express.static('public'));

server.set("view engine", "njk");

nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true,
});

server.get("/", function (req, res) {
    return res.render("index", { recipes });
});

server.get("/about", function (req, res) {
    return res.render("about");
});

server.get("/recipes", function (req, res) {
    
    return res.render("recipes", { recipes });
});

//se o recipe.id for igual ao rq.params.id a const recipe recebe ao objeto,
//no qual dentro do recipes, isso é verdadeiro
server.get("/recipes/:id", function (req, res) {
    const id = req.params.id;
    const recipe = recipes.find(function (recipe) {
        return recipe.title == id;
    });
    if(!recipe){
        return res.send("Sorry! Not found");
    }

    return res.render("recipePage", { item: recipe });
});

server.listen(500, function () {
    console.log("Server is running")
});