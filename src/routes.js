const express = require('express');
const homeRoutes = require("./app/controllers/home");
const adminRecipes = require("./app/controllers/admin");

const routes = express.Router();

routes.get("/", homeRoutes.index);
routes.get("/about", homeRoutes.about);
routes.get("/recipes", homeRoutes.recipes);
routes.get("/recipes/:id", homeRoutes.recipePage);


routes.get("/admin/recipes", adminRecipes.index);
routes.get("/admin/recipes/create", adminRecipes.create);
routes.get("/admin/recipes/:id", adminRecipes.show);
routes.get("/admin/recipes/:id/edit", adminRecipes.edit);

routes.post("/admin/recipes", adminRecipes.post);
routes.put("/admin/recipes", adminRecipes.put);
routes.delete("/admin/recipes", adminRecipes.delete);

module.exports = routes;