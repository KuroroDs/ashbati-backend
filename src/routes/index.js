const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');

// أي رابط يبدأ بـ /products صيفطو لـ productRoutes
router.use('/products', productRoutes);

module.exports = router;