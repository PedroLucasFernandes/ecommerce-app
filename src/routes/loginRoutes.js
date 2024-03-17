const express = require('express');
const routerLogin = express.Router();
const loginController = require('../controller/loginController');
const permissionVerify = require('./permissionVerify');

routerLogin.get('/', permissionVerify, loginController.getLogin);
routerLogin.post('/', loginController.autenticate);
routerLogin.post('/add', loginController.createLoginUsers);
routerLogin.get('/all', loginController.getAllLogins);
routerLogin.get('/:username', loginController.getLogin);
routerLogin.put('/:username', loginController.updateUser);
routerLogin.delete('/:username', loginController.deleteUser);

module.exports = routerLogin;