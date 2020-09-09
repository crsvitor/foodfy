const express = require('express');
const routes = express.Router();

const AdminUsers = require('./AdminRoutes/users');
const AdminChefs = require('./AdminRoutes/chefs');
const AdminRecipes = require('./AdminRoutes/recipes');

routes.use('/', AdminUsers);
routes.use('/chefs', AdminChefs);
routes.use('/recipes', AdminRecipes);

module.exports = routes;