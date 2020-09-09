const express = require('express');
const routes = express.Router();

const multer = require('../app/middlewares/multer');

const SessionController = require('../app/controllers/admin/SessionController');

routes.get('/login', SessionController.loginToForm);
routes.post('/login', SessionController.login);

routes.get('/forgot-password', SessionController.forgotPasswordToForm);
routes.post('/forgot-password', SessionController.forgotPassword);

routes.get('/reset-password', SessionController.resetPasswordToForm);
routes.post('/reset-password', SessionController.resetPassword);



// // Rotas de perfil de um usuário logado
// routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/profile', ProfileController.put)// Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/users', UserController.list) //Mostrar a lista de usuários cadastrados
// routes.post('/users', UserController.post) //Cadastrar um usuário
// routes.put('/users', UserController.put) // Editar um usuário
// routes.delete('/users', UserController.delete) // Deletar um usuário

module.exports = routes;