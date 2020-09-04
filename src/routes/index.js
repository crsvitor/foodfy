const express = require('express');
const routes = express.Router();

const ClientWebsite = require('./client');
const AdminWebsite = require('./admin');

routes.use('/', ClientWebsite);
routes.use('/admin/', AdminWebsite);

module.exports = routes;