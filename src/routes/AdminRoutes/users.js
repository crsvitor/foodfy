const express = require('express');
const routes = express.Router();

const multer = require('../../app/middlewares/multer');

const Validator = require('../../app/validators/user');

const ProfileController = require('../../app/controllers/admin/ProfileController');
const UserController = require('../../app/controllers/admin/UserController');


// // Rotas de perfil de um usuário logado
routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', ProfileController.put)// Editar o usuário logado

// // Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/users/create', UserController.create);
routes.post('/users/create', Validator.post, UserController.post) //Cadastrar um usuário
routes.put('/users', UserController.put) // Editar um usuário
routes.delete('/users', UserController.delete) // Deletar um usuário

module.exports = routes;