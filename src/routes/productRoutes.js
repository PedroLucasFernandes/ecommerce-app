const express = require('express');
const routerProduct = express.Router();
const productController = require('../controller/productController');

routerProduct.get('/', productController.getAllProducts);
routerProduct.get('/:id', productController.getProduct);
routerProduct.post('/', productController.createProduct);
routerProduct.put('/:id', productController.updateProduct);
routerProduct.delete('/:id', productController.deleteProduct);

module.exports = routerProduct;