const express = require('express');
const routes = express.Router();

const ClientWebsite = require('./client');
const SessionWebsite = require('./session');
const AdminWebsite = require('./admin');

routes.use('/', ClientWebsite);
routes.use('/', SessionWebsite);
routes.use('/admin/', AdminWebsite);

module.exports = routes;