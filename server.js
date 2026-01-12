// ============ اولا: ملف server.js كامل مزيان ============

console.log("🟢 1. باش تبدا السيرفر...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

console.log("🟢 2. الكودات تتبداو تحمل...");

// خلي dotenv يشتغل غير فالتجريب فالحاسوب ديالك
if (process.env.NODE_ENV !== 'production') {
  console.log("🔵 مود التجريب - كيقرا من ملف .env");
  dotenv.config();
} else {
  console.log("🔵 مود الانتاج - كيقرا من Railway");
}

// شوف واش كاين شي مشكل فالعدادات
console.log("🔍 PORT:", process.env.PORT);
console.log("🔍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔍 DATABASE_URL موجود؟", !!process.env.DATABASE_URL);

console.log("🟢 3. غادي نحمل الداتابيز...");

// جرب مع try/catch باش ماتفشلش
let sequelize;
try {
  const models = require('./src/models');
  sequelize = models.sequelize;
  console.log("✅ الداتابيز تتحمل بنجاح");
} catch (error) {
  console.log("❌ مشكل فتحميل الداتابيز:", error.message);
  sequelize = null;
}

console.log("🟢 4. غادي نحمل الروابط...");

let routes;
try {
  routes = require('./src/routes/index');
  console.log("✅ الروابط تتحملو بنجاح");
} catch (error) {
  console.log("❌ مشكل فتحميل الروابط:", error.message);
  routes = null;
}

const app = express();
console.log("🟢 5. express تبدا تشتغل...");

// الإعدادات الأساسية
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// إذا الروابط مازالو ما تحملوش، دير روابط بسيطة
if (routes) {
  app.use('/api', routes);
  console.log("✅ الروابط راهم جاهزين");
} else {
  // روابط طوارئ
  app.get('/api/test', (req, res) => {
    res.json({ message: "API Ashbati تعمل" });
  });
  console.log("⚠️  الروابط الأساسية تحدو");
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

// صفحة الصحة (باش يبقى السيرفر شغال)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'سليم',
    database: sequelize ? 'متصل' : 'مش متصل',
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;
console.log(`🎯 البورط راه ${PORT}`);

const startServer = async () => {
  try {
    console.log(`🔗 غادي نحاولو نربطو مع الداتابيز...`);
    
    if (sequelize) {
      await sequelize.authenticate();
      console.log('✅ الداتابيز ربط معاه بنجاح !');
    } else {
      console.log('⚠️  الداتابيز مازال ما ربطش');
    }

    console.log(`🌍 غادي نبداو السيرفر ف ${PORT}...`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🎉🎉🎉 السيرفر بدا بنجاح فالبورط: ${PORT}`);
      console.log(`🌐 لينك ديالك: https://ashbati-backend.railway.app`);
      console.log(`⏰ الوقت: ${new Date().toLocaleTimeString()}`);
      console.log("=================================");
      console.log("🚀 السيرفر جاهز لياكل الطلبات!");
      console.log("=================================");
    });

  } catch (error) {
    console.error('❌ ڤلا خطأ:', error.message);
    console.error('📌 التفاصيل:', error.stack);
    
    // حتى إذا فشل الداتابيز، السيرفر يبدا
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚠️  السيرفر بدا بدون داتابيز ف ${PORT}`);
    });
  }
};

console.log("🎬 باش نبداو...");
startServer();

// ============ ثانيا: ملف src/models/index.js كامل ============
console.log('🔗 باش نربطو مع الداتابيز...');

const { Sequelize } = require('sequelize');

// شوف واش كاين DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL ماموجودش!');
  console.log('ℹ️  تحقق من Variables فRailway');
  throw new Error('DATABASE_URL ماموجودش');
}

console.log('✅ DATABASE_URL موجود');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  retry: {
    max: 3,
    timeout: 5000
  }
});

console.log('✅ الداتابيز راه جاهز');

module.exports = { sequelize, Sequelize };

// ============ نصايح أخيرة: ============
/*
1. فRailway، دير Variables:
   - PORT = 3000
   - NODE_ENV = production
   - DATABASE_URL = الرابط ديالك

2. إذا مازال ما يبداش:
   - سير لDeployments -> Redeploy
   - أو Restart Service

3. تحقق من package.json:
   {
     "scripts": {
       "start": "node server.js"
     }
   }

4. إذا بغيتي داتابيز يبقى شغال، دير:
   - فملف package.json:
     "scripts": {
       "keep-alive": "node keep-alive.js"
     }
   
   - وملف keep-alive.js:
     setInterval(() => {
       fetch('https://ashbati-backend.railway.app/health');
     }, 10 * 60 * 1000);
*/

// ============ كود أبسط إذا مازال ما يبداش: ============
/*
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'سلام عليكم، أشباتي شغال' });
});

app.listen(PORT, () => {
  console.log(`✅ السيرفر شغال ف ${PORT}`);
});
*/

