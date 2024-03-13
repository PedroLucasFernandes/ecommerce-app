const express = require('express');

const router = express.Router();
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const customerRoutes = require('./customerRoutes');
const loginRoutes = require('./loginRoutes');
const { loginUsers } = require('../controller/loginController');

const authenticateAPIMiddleware = (req, res, next) => {
    const sessionToken = req.cookies.session_id;
    const isAuthenticated = loginUsers.some(user => user.sessionToken === sessionToken);
    if (isAuthenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Acesso não autorizado' });
    }
};

router.use('/product', authenticateAPIMiddleware, productRoutes);
router.use('/order', authenticateAPIMiddleware, orderRoutes);
router.use('/customer', authenticateAPIMiddleware, customerRoutes);
router.use('/login', loginRoutes);

module.exports = router;