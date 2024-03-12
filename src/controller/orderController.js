const { customers } = require('./customerController');
const { products } = require('./productController');

let orders = [
    { id: 1, customerId: 1, items: [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }]},
    { id: 2, customerId: 1, items: [{ id: 1, quantity: 7 }, { id: 2, quantity: 12 }]},
    { id: 3, customerId: 2, items: [{ id: 1, quantity: 5 }, { id: 2, quantity: 8 }]}
];

const getAllOrders = (req, res) => {
    res.status(200).json(orders);
};

const getOrder = (req, res) => {
    const orderID = parseInt(req.params.id);
    const orderIndex = orders.findIndex((order) => order.id === orderID);
    
    if(orderIndex === -1){
        return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(200).json(orders[orderIndex]);
};

const createOrder = (req, res) => {
    const { customerId, items } = req.body;
    
    const customer = customers.find(customer => customer.id === customerId);
    if (!customer || !customerId) {
        return res.status(404).json({ error: "Cliente não encontrado." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Itens do pedido são obrigatórios" });
    }

    const orderId = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;

    for (const item of items) {
        const product = products.find(product => product.id === item.id);
        if (!product) {
            return res.status(404).json({ error: `Produto com ID ${item.id} não encontrado.` });
        }
    }

    const newOrder = { id: orderId, customerId, items };

    orders.push(newOrder);
    res.status(201).json(newOrder);
};

const updateOrder = (req, res) => {
    const orderId = parseInt(req.params.id);
    const { customerId, items } = req.body;

    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const customer = customers.find(customer => customer.id === customerId);
    if (!customer || !customerId) {
        return res.status(404).json({ error: "Cliente não encontrado." });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Itens do pedido são obrigatórios." });
    }

    for (const item of items) {
        const product = products.find(product => product.id === item.id);
        if (!product) {
            return res.status(404).json({ error: `Produto com ID ${item.id} não encontrado.` });
        }
    }

    orders[orderIndex].items = items;

    res.status(200).json({ message: `Pedido ${orderId} atualizado.` });
};

const deleteOrder = (req, res) => {
    const orderID = parseInt(req.params.id);

    orders = orders.filter((order) => order.id !== orderID);

    res.status(200).json({ message: `Pedido ${orderID} deletado.`});
};

const searchOrdersByProduct = (req, res) => {
    const productId = parseInt(req.query.product_id);
    const filteredOrders = orders.filter(order => order.items.some(item => item.id === productId));

    if (filteredOrders.length == 0){
        res.status(400).json({ error: "Parâmetros de pesquisa inválidos." });
        return
    }

    res.status(200).json(filteredOrders);
};

const searchOrdersByCustomer = (req, res) => {
    const customerId = parseInt(req.query.customer_id);
    const filteredOrders = orders.filter(order => order.customerId === customerId);

    if (filteredOrders.length == 0){
        res.status(400).json({ error: "Parâmetros de pesquisa inválidos." });
        return
    }

    res.status(200).json(filteredOrders);
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