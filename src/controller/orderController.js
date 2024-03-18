const Database = require('../database');
const db = new Database('orders');

const getAllOrders = (req, res) => {
    db.readAllData((err, data) => {
        if (err) {
            res.status(500).json({ error: "Erro ao buscar pedidos" });
            return;
        }
        res.status(200).json(data);
    });
};

const getOrder = (req, res) => {
    const orderId = parseInt(req.params.id);

    db.get(`order_${orderId}`, (err, value) => {
        if(err){
            res.status(404).json({ error: 'Pedido não encontrado' });
            return;
        }
        const order = JSON.parse(value);
        res.status(200).json(order);
    });
};

const createOrder = (req, res) => {
    const { customerId, items } = req.body;

    db.readAllData((err, orders) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar produtos" });
        }

        const maxOrderId = orders.length;

        const nextOrderId = maxOrderId + 1;
        const newOrder = { id: nextOrderId, customerId, items };

        db.put(`order_${nextOrderId}`, JSON.stringify(newOrder), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao criar pedido' });
            }
            
            res.status(201).json(newOrder);
        });
    });
};

const updateOrder = (req, res) => {
    const orderId = parseInt(req.params.id);
    const { customerId, items } = req.body;

    db.get(`order_${orderId}`, (err, orderValue) => {
        if(err){
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const order = JSON.parse(orderValue);
        order.customerId = customerId;
        order.items = items;

        db.put(`order_${orderId}`, JSON.stringify(order), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao atualizar pedido' });
            }
            res.status(200).json({ message: `Pedido ${orderId} atualizado.` });
        });
    });
};

const deleteOrder = (req, res) => {
    const orderId = parseInt(req.params.id);

    db.del(`order_${orderId}`, (err) => {
        if(err){
            return res.status(500).json({ error: 'Erro ao excluir pedido' });
        }
        res.status(200).json({ message: `Pedido ${orderId} deletado.`});
    });
};

const searchOrdersByProduct = (req, res) => {
    const productId = parseInt(req.query.product_id);

    db.readAllData((err, orders) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar pedidos" });
        }

        const filteredOrders = orders.filter(order => order.items.some(item => item.id === productId));

        if (filteredOrders.length == 0){
            res.status(400).json({ error: "Parâmetros de pesquisa inválidos." });
            return;
        }

        res.status(200).json(filteredOrders);
    });
};

const searchOrdersByCustomer = (req, res) => {
    const customerId = parseInt(req.query.customer_id);

    db.readAllData((err, orders) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar pedidos" });
        }

        const filteredOrders = orders.filter(order => order.customerId === customerId);

        if (filteredOrders.length == 0){
            res.status(400).json({ error: "Parâmetros de pesquisa inválidos." });
            return;
        }

        res.status(200).json(filteredOrders);
    });
};

module.exports = {
    getAllOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    searchOrdersByProduct,
    searchOrdersByCustomer
};