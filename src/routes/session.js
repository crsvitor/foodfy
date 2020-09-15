const express = require('express');
const routes = express.Router();


const Validator = require('../app/validators/session');
const SessionController = require('../app/controllers/admin/SessionController');


routes.get('/login', SessionController.loginToForm);
routes.post('/login', Validator.login, SessionController.login);

routes.post('/logout', SessionController.logout);


routes.get('/forgot-password', SessionController.forgotPasswordToForm);
routes.post('/forgot-password', Validator.forgotPassword, SessionController.forgotPassword);

routes.get('/reset-password', SessionController.resetPasswordToForm);
routes.post('/reset-password', Validator.resetPassword, SessionController.resetPassword);


module.exports = routes;