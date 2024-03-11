const express = require('express');
const routerOrder = express.Router();
const orderController = require('../controller/orderController');

routerOrder.get('/', orderController.getAllOrders);

routerOrder.get('/search', (req, res) => {
    const { customer_id, product_id } = req.query;

    if (customer_id) {
        orderController.searchOrdersByCustomer(req, res);
    } else if (product_id) {
        orderController.searchOrdersByProduct(req, res);
    } else {
    }
});

routerOrder.get('/:id', orderController.getOrder);
routerOrder.post('/', orderController.createOrder);
routerOrder.put('/:id', orderController.updateOrder);
routerOrder.delete('/:id', orderController.deleteOrder);

module.exports = routerOrder;