const express = require('express');
const productsRouter = require('./productos');
const cartRouter = require('./carrito');

const router = express.Router();

router.use('/productos', productsRouter)
router.use('/carrito', cartRouter)

module.exports = router; 