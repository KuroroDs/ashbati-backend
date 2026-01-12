console.log("🟢 1. بدينا...");

const fs = require('fs');
const path = require('path');

console.log('📁 Current directory:', __dirname);
console.log('📁 routes/index exists?', fs.existsSync(path.join(__dirname, 'src/routes/index.js')));

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

console.log("🟢 2. دابا جاهزين...");

// Environment
if (process.env.NODE_ENV !== 'production') {
  console.log("🔵 مود التجريب");
  dotenv.config();
} else {
  console.log("🔵 مود الانتاج");
}

console.log("🔍 البورط:", process.env.PORT);
console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL ? "موجود" : "ماشي موجود");

console.log("🟢 3. غادي نحمل الداتابيز...");

// Database
let db;
try {
  const models = require('./src/models');
  db = models.sequelize; // ⬅️ يمكن يكون null
  console.log("✅ الداتابيز تحمل:", db ? 'نعم' : 'لا');
} catch (error) {
  console.log("⚠️  مشكل فالداتابيز:", error.message);
  db = null;
}

console.log("🟢 4. غادي نحمل الروابط...");

// Routes
const app = express();
app.use(cors());
app.use(express.json());

// Static files
if (fs.existsSync('uploads')) {
  app.use('/uploads', express.static('uploads'));
  console.log("✅ uploads متاح");
}

// API Routes
if (fs.existsSync('./src/routes/index.js')) {
  try {
    const apiRoutes = require('./src/routes/index');
    app.use('/api', apiRoutes);
    console.log("✅ الروابط تحملو");
  } catch (error) {
    console.log("⚠️  مشكل فالروابط:", error.message);
    app.get('/api/test', (req, res) => {
      res.json({ message: "API test route" });
    });
  }
} else {
  console.log("⚠️  ملف الروابط ماموجودش");
  app.get('/api/test', (req, res) => {
    res.json({ message: "API تعمل - routes مازالو ما تحملوش" });
  });
}

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({ 
    message: '🌿 مرحبا فAPI ديال أشباتي',
    status: 'شغال',
    time: new Date().toISOString(),
    version: '1.0.0'
  });
});

// صفحة الصحة
app.get('/health', (req, res) => {
  res.json({ 
    status: 'سليم',
    database: db ? 'متصل' : 'مفصول',
    uptime: process.uptime(),
    memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
  });
});

// Port
const PORT = process.env.PORT || 3000;
console.log(`🎯 البورط: ${PORT}`);

// Start server
const startServer = async () => {
  try {
    console.log(`🔗 غادي نربطو مع الداتابيز...`);
    
    if (db) {
      await db.authenticate();
      console.log('✅ الداتابيز ربطت!');
    } else {
      console.log('⚠️  الداتابيز مازال مافيهاش - نكملو بدون داتابيز');
    }

    console.log(`🌍 غادي نبداو السيرفر...`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎉 السيرفر بدا ف: ${PORT}`);
      console.log(`🌐 لينك: https://ashbati-backend.railway.app`);
      console.log(`⏰ ${new Date().toLocaleTimeString()}`);
      console.log("====================================");
      console.log("✅ السيرفر جاهز للاستعمال!");
      console.log("====================================");
    });

  } catch (error) {
    console.error('❌ خطأ فبداية السيرفر:', error.message);
    
    // حتى إذا فيه خطأ، السيرفر يبدا
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️  السيرفر بدا مع أخطاء ف ${PORT}`);
    });
  }
};

console.log("🎬 باش نبداو السيرفر...");
startServer();