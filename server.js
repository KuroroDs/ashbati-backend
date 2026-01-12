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

// Remove interfering headers for Railway
app.use((req, res, next) => {
  // Remove any Railway-specific headers that might interfere
  res.removeHeader('X-Powered-By');
  next();
});

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

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
      api_products: '/api/products',
      api_status: '/api-status'
    }
  });
});

// 2. API STATUS ENDPOINT (Alternative root for testing)
app.get('/api-status', (req, res) => {
  res.json({
    success: true,
    message: 'API is working via /api-status endpoint',
    timestamp: new Date().toISOString(),
    server: 'Ashbati Backend',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 3. HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: db ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    timestamp: new Date().toISOString(),
    server_time: new Date().toLocaleString()
  });
});

// 4. API ROUTES
const apiRouter = require('express').Router();

// Test endpoint
apiRouter.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    request_info: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      user_agent: req.get('User-Agent')
    }
  });
});

// Products endpoint (example)
apiRouter.get('/products', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Products endpoint - Ready for implementation',
    count: 0,
    timestamp: new Date().toISOString()
  });
});

// API root
apiRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ashbati API v1',
    version: '1.0.0',
    endpoints: {
      test: '/test',
      products: '/products'
    }
  });
});

// Mount API router
app.use('/api', apiRouter);

// 5. 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    suggested_endpoints: [
      '/',
      '/health',
      '/api',
      '/api/test',
      '/api-status'
    ]
  });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An internal server error occurred'
      : err.message,
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
      console.log(`📊 Database: ${db.config.database} @ ${db.config.host}`);
    }

    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log(`✅ Server running on PORT: ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`🌐 Railway: https://ashbati-backend.railway.app`);
      console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Started: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50));
      
      // Log available endpoints
      console.log('\n📡 Available Endpoints:');
      console.log('  • GET  /              - API information');
      console.log('  • GET  /health        - Health check');
      console.log('  • GET  /api-status    - Alternative status');
      console.log('  • GET  /api           - API root');
      console.log('  • GET  /api/test      - Test endpoint');
      console.log('  • GET  /api/products  - Products endpoint');
    });

    // Graceful shutdown handler
    const gracefulShutdown = () => {
      console.log('\n🛑 Received shutdown signal');
      server.close(() => {
        console.log('✅ Server closed gracefully');
        if (db) {
          db.close();
          console.log('✅ Database connection closed');
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    
    // Start without database if connection fails
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️  Server started WITHOUT database on PORT: ${PORT}`);
      console.log(`🌐 Access at: http://localhost:${PORT}`);
    });
  }
};

// Start the server
startServer();