const Database = require('../database');
const db = new Database('customers');

const getAllCustomers = (req, res) => {
    db.readAllData((err, data) => {
        if (err) {
            res.status(500).json({ error: "Erro ao buscar usuários" });
            return;
        }
        res.status(201).json(data);
    });
};

const getCustomer = (req, res) => {
    const customerId = parseInt(req.params.id);

    db.get(`customer_${customerId}`, (err, value) => {
        if (err) {
            if (err.notFound) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }
            return res.status(500).json({ error: 'Erro ao buscar cliente' });
        }
        const customer = JSON.parse(value);
        res.status(200).json(customer);
    });
};

const createCustomer = (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });
    }

    if (typeof name !== "string" || name.length < 3 || name.length > 30){
        return res.status(400).json({ error: "O nome deve conter entre 3 e 30 caracteres" });
    }

    if (typeof email !== "string" || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)){
        return res.status(400).json({ error: "Insira um endereço de e-mail válido" });
    }

    db.readAllData((err, customers) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar clientes" });
        }

        const maxCustomersId = customers.length;

        const nextCustomerId = maxCustomersId + 1;

        const newCustomer = { id: nextCustomerId, name, email };

        db.put(`customer_${nextCustomerId}`, JSON.stringify(newCustomer), (err) => {
            if(err) {
                res.status(500).json({ error: 'Erro ao criar cliente' });
                return;
            }
            res.status(201).json(newCustomer);
        });
    });
};

const updateCustomer = (req, res) => {
    const customerId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    if (!Number.isInteger(customerId)) {
        return res.status(404).json({ error: "Cliente não encontrado" });
    }

    if (!name || !email) {
        return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });
    }

    if (typeof name !== "string" || name.length < 3 || name.length > 30){
        return res.status(400).json({ error: "O nome deve conter entre 3 e 30 caracteres" });
    }

    if (typeof email !== "string" || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)){
        return res.status(400).json({ error: "Insira um endereço de e-mail válido" });
    }

    db.get(`customer_${customerId}`, (err, value) => {
        if(err){
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        const updateCustomer = { name, email };
        db.put(`customer_${customerId}`, JSON.stringify(updateCustomer), (err) => {
            if(err) {
                res.status(500).json({ error: 'Erro ao atualizar usuário' });
                return;
            }
            res.json({ message: `Usuário ${customerId} atualizado` });
        });
    });
};

const deleteCustomer = (req, res) => {
    const customerId = parseInt(req.params.id);

    db.del(`customer_${customerId}`, (err) => {
        if(err){
            res.status(500).json({ error: 'Erro ao excluir usuário' });
            return;
        }
        res.status(200).json({ message: `Usuário ${customerId} deletado.`});
    });
};

module.exports = {
    getAllCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
};