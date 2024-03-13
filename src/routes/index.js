const express = require('express');

const router = express.Router();
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const customerRoutes = require('./customerRoutes');
const loginRoutes = require('./loginRoutes');

router.use('/product', productRoutes);
router.use('/order', orderRoutes);
router.use('/customer', customerRoutes);
router.use('/login', loginRoutes);

module.exports = router;