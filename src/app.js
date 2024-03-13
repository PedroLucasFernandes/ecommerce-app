const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const routesIndex = require('./routes/');

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

app.use(cookieParser());

app.use((req, res, next) => {
    res.status(200).setHeader('X-Frame-Options', 'DENY');
    next();
});

app.use('/api', routesIndex);


const loginPage = require('./view/login');
app.get('/', loginPage);

const menuPage = require('./view/menu');
const { loginUsers } = require('./controller/loginController');
app.get('/menu', (req, res, next) => {
    const sessionToken = req.cookies.session_id;
    const isAuthenticated = loginUsers.some(user => user.sessionToken === sessionToken);

    if (isAuthenticated) {
        next();
    } else {
        res.redirect('/');
    }
}, menuPage);

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});