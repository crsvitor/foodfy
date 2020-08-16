const express = require('express');
const multer = require('./app/middlewares/multer');
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

routes.post("/admin/recipes", multer.array("photos", 5), admin.post);
routes.put("/admin/recipes", multer.array("photos", 5), admin.put);
routes.delete("/admin/recipes", admin.delete);


routes.get("/admin/chefs", admin.indexChefs);
routes.get("/admin/chefs/create", admin.createChef);
routes.get("/admin/chefs/:id", admin.showChef);
routes.get("/admin/chefs/:id/edit", admin.editChef);

routes.post("/admin/chefs", multer.array("photos", 1), admin.postChef);
routes.put("/admin/chefs", multer.array("photos", 1), admin.putChef);
routes.delete("/admin/chefs", admin.deleteChef);



module.exports = routes;