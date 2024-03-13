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
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Store API</h1>
            <button id="getAllProducts">Obter Todos os Produtos</button>
            <button id="getAllOrders">Obter Todos os Pedidos</button>
            <button id="getAllCostumers">Obter Todos os Clientes</button>
            <div id="output"></div>
        </div>
        
        <script>
            async function fetchData(url) {
                try {
                    const response = await fetch(url);
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

            document.getElementById('getAllCostumers').addEventListener('click', async () => {
                const customersData = await fetchData('http://localhost:3000/api/customer');
                displayResults(customersData);
            });
        </script>
    </body>
    </html>
`;

function menuPage(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.send(menuContent);
}

module.exports = menuPage;