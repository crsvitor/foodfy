const express = require('express');
const routes = express.Router();

const ClientWebsite = require('./client');
const AdminChefs = require('./admin-chefs');
const AdminRecipes = require('./admin-recipes');

routes.use('/', ClientWebsite);
routes.use('/admin/chefs/', AdminChefs);
routes.use('/admin/recipes/', AdminRecipes);

module.exports = routes;