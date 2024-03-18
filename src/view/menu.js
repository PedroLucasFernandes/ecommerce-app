const menuContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Store API</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f0f0;
        }
        h1 {
            margin-bottom: 20px;
            color: #333;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        button {
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #0056b3;
        }
        #output {
            margin-top: 20px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 80%;
            background-color: #fff;
        }
        input[type="number"], input[type="text"], input[type="email"] {
            margin-top: 5px;
            margin-bottom: 5px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 40%;
            box-sizing: border-box;
        }
        label {
            margin-bottom: 5px;
            color: #333;
            width: 120px;
            text-align: right;
            margin-right: 20px;
        }
        .input-group {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 10px;
        }
        .input-group button {
            width: 40%;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Store API</h1>
        <button id="getAllProducts">Ver Todos os Produtos</button>
        <button id="getAllOrders">Ver Todos os Pedidos</button>
        <button id="getAllCustomers">Ver Todos os Clientes</button>
        
        <hr>
        
        <div class="input-group">
            <label for="productId">ID do Produto:</label>
            <input type="number" id="productId">
            <button id="getProductById">Consultar Produto</button>
            <button id="deleteProduct">Deletar Produto</button>
        </div>
        <div class="input-group">
            <label for="customerId">ID do Cliente:</label>
            <input type="number" id="customerId">
            <button id="getCustomerById">Consultar Cliente</button>
            <button id="deleteCustomer">Deletar Cliente</button>
        </div>
        <div class="input-group">
            <label for="orderId">ID do Pedido:</label>
            <input type="number" id="orderId">
            <button id="getOrderById">Consultar Pedido</button>
            <button id="deleteOrder">Deletar Pedido</button>
        </div>
        
        <hr>

        <h2>Criar Novo Produto</h2>
        <div class="input-group">
            <label for="newProductName">Nome:</label>
            <input type="text" id="newProductName">
        </div>
        <div class="input-group">
            <label for="newProductValue">Valor:</label>
            <input type="number" id="newProductValue">
        </div>
        <button id="createNewProduct">Criar Produto</button>
        
        <hr>

        <h2>Atualizar Produto</h2>
        <div class="input-group">
            <label for="updateProductId">ID do Produto:</label>
            <input type="number" id="updateProductId">
        </div>
        <div class="input-group">
            <label for="updateProductName">Nome:</label>
            <input type="text" id="updateProductName">
        </div>
        <div class="input-group">
            <label for="updateProductValue">Valor:</label>
            <input type="number" id="updateProductValue">
        </div>
        <button id="updateProduct">Atualizar Produto</button>
        
        <hr>

        <h2>Criar Novo Cliente</h2>
        <div class="input-group">
            <label for="newCustomerName">Nome:</label>
            <input type="text" id="newCustomerName">
        </div>
        <div class="input-group">
            <label for="newCustomerEmail">Email:</label>
            <input type="email" id="newCustomerEmail">
        </div>
        <button id="createNewCustomer">Criar Cliente</button>
        
        <hr>

        <h2>Atualizar Cliente</h2>
        <div class="input-group">
            <label for="updateCustomerId">ID do Cliente:</label>
            <input type="number" id="updateCustomerId">
        </div>
        <div class="input-group">
            <label for="updateCustomerName">Nome:</label>
            <input type="text" id="updateCustomerName">
        </div>
        <div class="input-group">
            <label for="updateCustomerEmail">Email:</label>
            <input type="email" id="updateCustomerEmail">
        </div>
        <button id="updateCustomer">Atualizar Cliente</button>
        
        <hr>

        <h2>Criar Novo Pedido</h2>
        <div class="input-group">
            <label for="newOrderCustomerId">ID do Cliente:</label>
            <input type="number" id="newOrderCustomerId">
        </div>
        <div class="input-group">
            <label for="newOrderItems">Itens:Quantidades (separados por vírgula):</label>
            <input type="text" id="newOrderItems" placeholder="Ex: 1:3, 2:10, ...">
        </div>
        <button id="createNewOrder">Criar Pedido</button>
        
        <hr>

        <h2>Atualizar Pedido</h2>
        <div class="input-group">
            <label for="updateOrderId">ID do Pedido:</label>
            <input type="number" id="updateOrderId">
        </div>
        <div class="input-group">
            <label for="updateOrderCustomerId">ID do Cliente:</label>
            <input type="number" id="updateOrderCustomerId">
        </div>
        <div class="input-group">
            <label for="updateOrderItems">Itens:Quantidades (separados por vírgula):</label>
            <input type="text" id="updateOrderItems" placeholder="Ex: 1:3, 2:10, ...">
        </div>
        <button id="updateOrder">Atualizar Pedido</button>
        <div id="outputUpdate"></div>
        <div id="output"></div>
    </div>
    
    <script>
        async function fetchData(url, options) {
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Erro ao obter dados:', error);
                return { error: 'Erro ao obter dados.' };
            }
        }

        function displayResults(data) {
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = JSON.stringify(data, null, 2);
        }

        document.getElementById('getAllProducts').addEventListener('click', async () => {
            const productsData = await fetchData('http://localhost:3000/api/product');
            displayResults(productsData);
        });

        document.getElementById('getAllOrders').addEventListener('click', async () => {
            const ordersData = await fetchData('http://localhost:3000/api/order');
            displayResults(ordersData);
        });

        document.getElementById('getAllCustomers').addEventListener('click', async () => {
            const customersData = await fetchData('http://localhost:3000/api/customer');
            displayResults(customersData);
        });

        document.getElementById('getProductById').addEventListener('click', async () => {
            const productId = document.getElementById('productId').value;
            const productData = await fetchData(\`http://localhost:3000/api/product/\${productId}\`);
            document.getElementById('productId').value = "";
            displayResults(productData);
        });

        document.getElementById('getOrderById').addEventListener('click', async () => {
            const orderId = document.getElementById('orderId').value;
            const orderData = await fetchData(\`http://localhost:3000/api/order/\${orderId}\`);
            document.getElementById('orderId').value = "";
            displayResults(orderData);
        });

        document.getElementById('getCustomerById').addEventListener('click', async () => {
            const customerId = document.getElementById('customerId').value;
            const customerData = await fetchData(\`http://localhost:3000/api/customer/\${customerId}\`);
            document.getElementById('customerId').value = "";
            displayResults(customerData);
        });

        document.getElementById('createNewProduct').addEventListener('click', async () => {
            const newProductName = document.getElementById('newProductName').value;
            const newProductValue = document.getElementById('newProductValue').value;

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newProductName, value: newProductValue })
            };

            const response = await fetchData('http://localhost:3000/api/product', options);
            displayResults(response);
        });

        document.getElementById('createNewCustomer').addEventListener('click', async () => {
            const newCustomerName = document.getElementById('newCustomerName').value;
            const newCustomerEmail = document.getElementById('newCustomerEmail').value;

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newCustomerName, email: newCustomerEmail })
            };

            const response = await fetchData('http://localhost:3000/api/customer', options);
            displayResults(response);
        });

        document.getElementById('createNewOrder').addEventListener('click', async () => {
            const newOrderCustomerId = document.getElementById('newOrderCustomerId').value;
            const newOrderItems = document.getElementById('newOrderItems').value.split(',');

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ customerId: newOrderCustomerId, items: newOrderItems })
            };

            const response = await fetchData('http://localhost:3000/api/order', options);
            displayResults(response);
        });

        document.getElementById('deleteProduct').addEventListener('click', async () => {
            const productId = document.getElementById('productId').value;
            const options = {
                method: 'DELETE'
            };
            document.getElementById('productId').value = "";
            const response = await fetchData(\`http://localhost:3000/api/product/\${productId}\`, options);
            displayResults(response);
        });

        document.getElementById('deleteCustomer').addEventListener('click', async () => {
            const customerId = document.getElementById('customerId').value;
            const options = {
                method: 'DELETE'
            };
            document.getElementById('customerId').value = "";
            const response = await fetchData(\`http://localhost:3000/api/customer/\${customerId}\`, options);
            displayResults(response);
        });

        document.getElementById('deleteOrder').addEventListener('click', async () => {
            const orderId = document.getElementById('orderId').value;
            const options = {
                method: 'DELETE'
            };
            document.getElementById('orderId').value = "";
            const response = await fetchData(\`http://localhost:3000/api/order/\${orderId}\`, options);
            displayResults(response);
        });

        document.getElementById('updateProduct').addEventListener('click', async () => {
            const updateProductId = document.getElementById('updateProductId').value;
            const updateProductName = document.getElementById('updateProductName').value;
            const updateProductValue = document.getElementById('updateProductValue').value;
        
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: updateProductName, value: updateProductValue })
            };
        
            const response = await fetchData(\`http://localhost:3000/api/product/\${updateProductId}\`, options);
            displayUpdateResult(response);
        });

        document.getElementById('updateCustomer').addEventListener('click', async () => {
            const updateCustomerId = document.getElementById('updateCustomerId').value;
            const updateCustomerName = document.getElementById('updateCustomerName').value;
            const updateCustomerEmail = document.getElementById('updateCustomerEmail').value;
        
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: updateCustomerName, email: updateCustomerEmail })
            };
        
            const response = await fetchData(\`http://localhost:3000/api/customer/\${updateCustomerId}\`, options);
            displayUpdateResult(response);
        });
        
        document.getElementById('updateOrder').addEventListener('click', async () => {
            const updateOrderId = document.getElementById('updateOrderId').value;
            const updateOrderCustomerId = document.getElementById('updateOrderCustomerId').value;
            const updateOrderItems = document.getElementById('updateOrderItems').value.split(',');
        
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ customerId: updateOrderCustomerId, items: updateOrderItems })
            };
        
            const response = await fetchData(\`http://localhost:3000/api/order/\${updateOrderId}\`, options);
            displayUpdateResult(response);
        });
        
        function displayUpdateResult(data) {
            const outputDiv = document.getElementById('outputUpdate');
            outputDiv.innerHTML = JSON.stringify(data, null, 2);
        }
    </script>
</body>
</html>
`;

function menuPage(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.send(menuContent);
}

module.exports = menuPage;