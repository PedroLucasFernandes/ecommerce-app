const express = require('express');
const routerLogin = express.Router();
const loginController = require('../controller/loginController');

routerLogin.get('/', loginController.getLogin);
routerLogin.post('/', loginController.autenticate);

module.exports = routerLogin;