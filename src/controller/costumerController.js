let customers = [
    { id: 1,  name: "Pedro Fernandes", email: "pedro@alphaedtech.org.br"},
    { id: 2,  name: "Kenji Taniguchi", email: "kenji@alphaedtech.org.br"}
];

const getAllCustomers = (req, res) => {
    res.status(200).json(customers);
};

const getCustomer = (req, res) => {
    const customerID = parseInt(req.params.id);
    const customerIndex = customers.findIndex((customer) => customer.id === customerID);

    if (!Number.isInteger(order.id) || customerIndex === -1) {
        return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.status(200).json(customers[customerIndex]);
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

    const customerId = customers.length > 0 ? customers[customers.length - 1].id + 1 : 1;
    const newcustomer = { id: customerId, name: name, email: email };

    customers.push(newcustomer);

    res.status(201).json(newcustomer);
};

const updateCustomer = (req, res) => {
    const customerId = parseInt(req.params.id);
    const { name, email } = req.body;

    const customerIndex = customers.findIndex(customer => customer.id === customerId);

    if (!Number.isInteger(order.id) || customerIndex === -1) {
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

    customers[customerIndex].name = name;
    customers[customerIndex].email = email;

    res.status(200).json({ message: `Cliente ${customerId} atualizado.` });
};

const deleteCustomer = (req, res) => {
    const customerId = parseInt(req.params.id);

    const customerIndex = customers.findIndex(customer => customer.id === customerId);

    if (!Number.isInteger(order.id) || customerIndex === -1) {
        return res.status(404).json({ error: "Cliente não encontrado" });
    }

    customers.splice(customerIndex, 1);

    res.status(200).json({ message: `Cliente ${customerId} deletado.` });
};

module.exports = {
    getAllCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
};