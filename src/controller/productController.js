const Database = require('../database');
const db = new Database('products');

const getAllProducts = (req, res) => {
    db.readAllData((err, data) => {
        if (err) {
            res.status(500).json({ error: "Erro ao buscar produtos" });
            return;
        }
        res.json(data);
    });
};

const getProduct = (req, res) => {
    const productId = parseInt(req.params.id);

    db.get(`product_${productId}`, (err, value) => {
        if(err){
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        const product = JSON.parse(value);
        res.status(201).json(product);
    });
};

const createProduct = (req, res) => {
    const { name, value } = req.body;

    if(!name || !value){
        return res.status(400).json({ error: "O nome e valor são obrigatórios" });
    }

    const numericValue = parseFloat(value);
    if (typeof numericValue !== 'number' && !/^\d+(\.\d{2})?$/.test(numericValue.toString())) {
        return res.status(400).json({ error: "O valor deve ser numérico com duas casas decimais" });
    }

    db.readAllData((err, products) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar produtos" });
        }

        const maxProductId = products.length;

        const nextProductId = maxProductId + 1;

        const newProduct = { id: nextProductId, name, value: numericValue };

        db.put(`product_${nextProductId}`, JSON.stringify(newProduct), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao criar produto' });
            }
            
            res.status(201).json(newProduct);
        });
    });
};

const updateProduct = (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, value } = req.body;

    if(!name || !value){
        return res.status(400).json({ error: "O nome e valor são obrigatórios" });
    }

    const numericValue = parseFloat(value);
    if (typeof numericValue !== 'number' && !/^\d+(\.\d{2})?$/.test(numericValue.toString())) {
        return res.status(400).json({ error: "O valor deve ser numérico com duas casas decimais" });
    }

    db.get(`product_${productId}`, (err, numericValue) => {
        if(err){
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }

        const updateProduct = { name, value };
        db.put(`product_${productId}`, JSON.stringify(updateProduct), (err) => {
            if(err) {
                res.status(500).json({ error: 'Erro ao atualizar usuário' });
                return;
            }
            res.json({ message: `Produto ${productId} atualizado` });
        });
    });
};

const deleteProduct = (req, res) => {
    const productId = parseInt(req.params.id);

    db.get(`product_${productId}`, (err, value) => {
        if(err){
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }

        db.del(`product_${productId}`, (err) => {
            if(err){
                res.status(500).json({ error: 'Erro ao excluir produto' });
                return;
            }
            res.status(200).json({ message: `Produto ${productId} deletado.`});
        });
    });
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};