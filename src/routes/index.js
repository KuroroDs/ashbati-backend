const express = require('express');
const router = express.Router();

// 📍 Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API Ashbati تعمل بنجاح',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      auth: '/api/auth',
      inventory: '/api/inventory'
    }
  });
});

// 📍 Products routes (مثال)
router.get('/products', async (req, res) => {
  try {
    // هنا غادي تجيب البيانات من الداتابيز
    res.json({
      success: true,
      products: [],
      message: 'Products list',
      count: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 📍 Auth routes (مثال)
router.post('/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint',
    token: 'sample-jwt-token'
  });
});

// 📍 Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime()
  });
});

module.exports = router;