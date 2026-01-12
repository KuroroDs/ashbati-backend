// ==================== CONFIGURATION ====================
console.log("🚀 Ashbati API - Starting Server...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// ==================== DATABASE CONNECTION ====================
let db = null;
try {
  const { sequelize } = require('./config/database');
  db = sequelize;
  console.log("✅ Database module loaded");
} catch (error) {
  console.log("⚠️  Database not available:", error.message);
}

// ==================== EXPRESS APP ====================
const app = express();

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
if (require('fs').existsSync('uploads')) {
  app.use('/uploads', express.static('uploads'));
}

// ==================== ROUTES ====================

// 1. ROOT ROUTE - MUST RETURN JSON
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌿 Ashbati API - Backend Service',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    documentation: 'https://github.com/KuroroDs/ashbati-backend',
    endpoints: {
      health: '/health',
      api: '/api',
      api_test: '/api/test',
      api_products: '/api/products'
    }
  });
});

// 2. HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: db ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    timestamp: new Date().toISOString()
  });
});

// 3. API ROUTES
const apiRouter = require('express').Router();

// Test endpoint
apiRouter.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Products endpoint (example)
apiRouter.get('/products', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Products endpoint',
    count: 0
  });
});

// Mount API router
app.use('/api', apiRouter);

// 4. 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection if available
    if (db) {
      await db.authenticate();
      console.log('✅ Database connection established');
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log(`✅ Server running on PORT: ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`🌐 Railway: https://ashbati-backend.railway.app`);
      console.log(`⏰ Started: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50));
    });

  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    
    // Start without database if connection fails
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️  Server started WITHOUT database on PORT: ${PORT}`);
    });
  }
};

// Start the server
startServer();