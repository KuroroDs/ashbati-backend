// ==================== CONFIGURATION ====================
console.log("🚀 Ashbati API - Starting Server...");
const Product = require('./src/models/Product');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

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

// Add identifying headers FIRST (before CORS)
app.use((req, res, next) => {
  // Set headers to identify our app (helps Railway recognize it's our response)
  res.setHeader('X-Ashbati-API', 'v1.0.0');
  res.setHeader('X-Server', 'Express-Node');
  res.setHeader('X-Powered-By', 'Ashbati-Backend');
  next();
});

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
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

// ==================== CRITICAL ENDPOINTS (for Railway health checks) ====================

// 1. SIMPLE HEALTH CHECK (for Railway health check)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'Ashbati API',
    timestamp: new Date().toISOString()
  });
});

// 2. API STATUS (alternative health check)
app.get('/api-status', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Ashbati Backend',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ==================== MAIN ROUTES ====================

// 3. ROOT ROUTE
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌿 Ashbati API - Backend Service',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api_status: '/api-status',
      api: '/api',
      api_test: '/api/test'
    }
  });
});

// 4. API ROUTES
const apiRouter = require('express').Router();

// API root
apiRouter.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ashbati API v1',
    version: '1.0.0',
    endpoints: {
      test: '/test',
      products: '/products',
      health: '/health'
    }
  });
});

// Test endpoint
apiRouter.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Products endpoint - CODE NEW
apiRouter.get('/products', async (req, res) => {
  try {
    // 1. نجيبو المنتجات من الداتابايز صح
    const products = await Product.findAll();

    // 2. نبعثوهم للفرونت اند
    res.json({
      success: true,
      data: products, // هاذي هي الصح! كانت [] ورجعت داتا حقيقية
      message: 'Products fetched successfully',
      count: products.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products from DB',
      error: error.message
    });
  }
});

// Database status endpoint
apiRouter.get('/db-status', async (req, res) => {
  try {
    if (db) {
      await db.authenticate();
      res.json({
        success: true,
        message: 'Database connected',
        database: db.config.database,
        host: db.config.host
      });
    } else {
      res.json({
        success: false,
        message: 'Database not configured'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message
    });
  }
});

// Mount API router
app.use('/api', apiRouter);

// ==================== ERROR HANDLERS ====================

// 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    available_endpoints: [
      '/',
      '/health',
      '/api-status',
      '/api',
      '/api/test',
      '/api/products',
      '/api/db-status'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occurred',
    timestamp: new Date().toISOString()
  });
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection if available
    if (db) {
      try {
        await db.authenticate();
        console.log('✅ Database connection established');
      } catch (dbError) {
        console.log('⚠️  Database connection failed:', dbError.message);
      }
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
      
      // Log critical endpoints for Railway
      console.log('\n📡 Critical Endpoints (for Railway health checks):');
      console.log('  • GET  /health        - Simple health check');
      console.log('  • GET  /api-status    - Detailed status');
      
      console.log('\n📡 Available API Endpoints:');
      console.log('  • GET  /              - API information');
      console.log('  • GET  /api           - API root');
      console.log('  • GET  /api/test      - Test endpoint');
      console.log('  • GET  /api/products  - Products endpoint');
      console.log('  • GET  /api/db-status - Database status');
    });

    // Graceful shutdown
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
    process.exit(1);
  }
};

// Start the server
startServer();