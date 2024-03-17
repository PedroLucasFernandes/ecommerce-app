const express = require('express');
const routerCustomer = express.Router();
const customerController = require('../controller/customerController');

routerCustomer.get('/', customerController.getAllCustomers);
//routerCustomer.get('/:id', customerController.getCustomer);
routerCustomer.post('/', customerController.createCustomer);
routerCustomer.put('/:id', customerController.updateCustomer);
routerCustomer.delete('/:id', customerController.deleteCustomer);

module.exports = routerCustomer;