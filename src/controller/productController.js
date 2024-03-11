let products = [
    {id: 1, name: "Phone", value: 2000.00},
    {id: 2, name: "Notebook", value: 4000.00}
];

let nextProductID = products.length + 1;

const getAllProducts = (req, res) => {
    res.status(200).json(products);
};

const getProduct = (req, res) => {
    const productID = parseInt(req.params.id);
    const productIndex = products.findIndex((product) => product.id === productID);
    console.log(productID);
    console.log(productIndex);
    
    if(productIndex === -1){
        return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(200).json(products[productIndex]);
};

const createProduct = (req, res) => {
    const { name, value } = req.body;

    if(!name || !value){
        return res.status(400).json({ error: "O nome e valor são obrigatórios" });
    }

    if (typeof value !== 'number' || !/^\d+(\.\d{1,2})?$/.test(value.toString())) {
        return res.status(400).json({ error: "O valor deve ser numérico com até duas casas decimais" });
    }

    const newProduct = { id: nextProductID++, name, value };
    products.push(newProduct);
    res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
    const productID = parseInt(req.params.id);
    const { name, value } = req.body;

    const productIndex = products.findIndex((product) => product.id === productID);

    if(productIndex === -1){
        return res.status(404).json({ error: "Produto não encontrado" });
    }

    if(!name || !value){
        return res.status(400).json({ error: "O nome e valor são obrigatórios" });
    }

    if (typeof value !== 'number' || !/^\d+(\.\d{1,2})?$/.test(value.toString())) {
        return res.status(400).json({ error: "O valor deve ser numérico com até duas casas decimais" });
    }

    products[productIndex] = { ...products[productIndex], name, value };
    res.status(200).json({ message: `Produto ${productID} atualizado.`});
};

const deleteProduct = (req, res) => {
    const productID = parseInt(req.params.id);

    products = products.filter((product) => product.id === productID);

    res.status(200).json({ message: `Produto ${productID} deletado.`});
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};