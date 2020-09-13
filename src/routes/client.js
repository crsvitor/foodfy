const express = require('express');
const routes = express.Router();

const ClientController = require("../app/controllers/client-website/ClientController");

routes.get("/", ClientController.index);
routes.get("/about", ClientController.about);
routes.get("/recipes", ClientController.recipes);
routes.get("/recipes/:id", ClientController.recipePage);
routes.get("/chefs", ClientController.chefs);

module.exports = routes;