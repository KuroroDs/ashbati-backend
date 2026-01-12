console.log("🟢 1. بدينا...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

console.log("🟢 2. دابا جاهزين...");

// خلي dotenv يشتغل غير فالتجريب
if (process.env.NODE_ENV !== 'production') {
  console.log("🔵 مود التجريب");
  dotenv.config();
} else {
  console.log("🔵 مود الانتاج");
}

console.log("🔍 البورط:", process.env.PORT);
console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL ? "موجود" : "ماشي موجود");

console.log("🟢 3. غادي نحمل الداتابيز...");

// هون المتغيرات
let db;  // بدل sequelize، سميه db
try {
  const models = require('./src/models');
  db = models.sequelize;  // خلي الاسم مختلف
  console.log("✅ الداتابيز تحمل");
} catch (error) {
  console.log("⚠️  مشكل فالداتابيز:", error.message);
  db = null;
}

console.log("🟢 4. غادي نحمل الروابط...");

let apiRoutes;
try {
  apiRoutes = require('./src/routes/index');
  console.log("✅ الروابط تحملو");
} catch (error) {
  console.log("⚠️  مشكل فالروابط:", error.message);
  apiRoutes = null;
}

const app = express();
console.log("🟢 5. express بدا...");

app.use(cors());
app.use(express.json());

// إذا عندك دايركتوار uploads
try {
  app.use('/uploads', express.static('uploads'));
} catch (err) {
  console.log("⚠️  uploads ماموجودش");
}

// الروابط
if (apiRoutes) {
  app.use('/api', apiRoutes);
} else {
  app.get('/api/test', (req, res) => {
    res.json({ message: "API تعمل" });
  });
}

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({ 
    message: '🌿 مرحبا فAPI ديال أشباتي',
    status: 'شغال',
    time: new Date().toISOString()
  });
});

// صفحة الصحة
app.get('/health', (req, res) => {
  res.json({ 
    status: 'سليم',
    database: db ? 'متصل' : 'مفصول',
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;
console.log(`🎯 البورط: ${PORT}`);

const startServer = async () => {
  try {
    console.log(`🔗 غادي نربطو مع الداتابيز...`);
    
    if (db) {
      await db.authenticate();
      console.log('✅ الداتابيز ربطت!');
    } else {
      console.log('⚠️  الداتابيز مازال مافيهاش');
    }

    console.log(`🌍 غادي نبداو السيرفر...`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎉 السيرفر بدا ف: ${PORT}`);
      console.log(`🌐 لينك: https://ashbati-backend.railway.app`);
      console.log(`⏰ ${new Date().toLocaleTimeString()}`);
    });

  } catch (error) {
    console.error('❌ خطأ:', error.message);
    
    // حتى إذا الداتابيز ما ربطتش، السيرفر يبدا
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️  السيرفر بدا بدون داتابيز ف ${PORT}`);
    });
  }
};

console.log("🎬 باش نبداو السيرفر...");
startServer();