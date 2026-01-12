const express = require('express');
const router = express.Router();

// ==================== AUTH ROUTES ====================
router.post('/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint',
    token: 'sample-jwt-token',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@ashbati.com'
    }
  });
});

router.post('/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful',
    user: {
      id: 2,
      name: req.body.name || 'New User'
    }
  });
});

// ==================== PRODUCT ROUTES ====================
router.get('/products', (req, res) => {
  res.json({
    success: true,
    products: [
      {
        id: 1,
        name: 'عسل السيدي',
        price: 120,
        category: 'عسل',
        description: 'عسل طبيعي 100%'
      },
      {
        id: 2,
        name: 'زيت الأركان',
        price: 200,
        category: 'زيوت',
        description: 'زيت أركان نقي'
      }
    ],
    count: 2
  });
});

router.get('/products/:id', (req, res) => {
  res.json({
    success: true,
    product: {
      id: parseInt(req.params.id),
      name: 'Product ' + req.params.id,
      price: 100,
      category: 'عام'
    }
  });
});

// ==================== ORDER ROUTES ====================
router.post('/orders', (req, res) => {
  res.json({
    success: true,
    message: 'Order created',
    orderId: Date.now(),
    total: req.body.total || 0
  });
});

// ==================== EXPORT ====================
module.exports = router;