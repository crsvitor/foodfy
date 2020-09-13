const express = require('express');
const routes = express.Router();

const { onlyUsers } = require('../app/middlewares/session');

const ClientWebsite = require('./client');
const SessionWebsite = require('./session');
const AdminWebsite = require('./admin');

routes.use('/', ClientWebsite);
routes.use('/admin', SessionWebsite);
routes.use('/admin', onlyUsers, AdminWebsite);

module.exports = routes;