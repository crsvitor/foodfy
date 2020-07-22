const express = require('express');
const home = require("./app/controllers/home");
const admin = require("./app/controllers/admin");

const routes = express.Router();

routes.get("/", home.index);
routes.get("/about", home.about);
routes.get("/recipes", home.recipes);
routes.get("/recipes/:id", home.recipePage);
routes.get("/chefs", home.chefs);



routes.get("/admin", admin.redirect);
routes.get("/admin/recipes", admin.index);
routes.get("/admin/recipes/create", admin.create);
routes.get("/admin/recipes/:id", admin.show);
routes.get("/admin/recipes/:id/edit", admin.edit);

routes.post("/admin/recipes", admin.post);
routes.put("/admin/recipes", admin.put);
routes.delete("/admin/recipes", admin.delete);


routes.get("/admin/chefs", admin.indexChefs);
routes.get("/admin/chefs/create", admin.createChef);
routes.get("/admin/chefs/:id", admin.showChef);
routes.get("/admin/chefs/:id/edit", admin.editChef);

routes.post("/admin/chefs", admin.postChef);
routes.put("/admin/chefs", admin.putChef);
routes.delete("/admin/chefs", admin.deleteChef);



module.exports = routes;