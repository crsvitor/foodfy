const express = require('express');
const routes = express.Router();

const AdminSession = require('./AdminRoutes/session');
const AdminChefs = require('./AdminRoutes/chefs');
const AdminRecipes = require('./AdminRoutes/recipes');

routes.use('/', AdminSession);
routes.use('/chefs', AdminChefs);
routes.use('/recipes', AdminRecipes);

module.exports = routes;