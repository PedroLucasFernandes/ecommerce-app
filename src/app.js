const express = require("express");
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const productIndex = require('./routes/');

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin === 'http://localhost:3000') {
            callback(null, true);
        } else {
            callback(new Error('Acesso bloqueado por política CORS'));
        }
    }
}));

app.use(express.json());

app.use((req, res, next) => {
    res.status(200).setHeader('X-Frame-Options', 'DENY');
    next();
});

app.use('/api', productIndex);

const htmlPath = path.join(__dirname, './index.html');

app.get('/', (req, res) => {
    res.status(200).sendFile(htmlPath);
});

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});