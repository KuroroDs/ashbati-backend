console.log('🔗 باش نربطو مع الداتابيز...');

const { Sequelize } = require('sequelize');

// تحقق من DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
let sequelize;

if (!databaseUrl) {
  console.log('⚠️  DATABASE_URL ماموجودش - نستعملو إعدادات محلية');
  
  // إعدادات للتطوير المحلي
  if (process.env.DB_HOST && process.env.DB_NAME) {
    console.log('🔍 كاين إعدادات داتابيز منفصلة');
    const constructedUrl = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || ''}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`;
    
    console.log('✅ URL متكون');
    
    sequelize = new Sequelize(constructedUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: false // SSL محلياً ماشي ضروري
    });
  } else {
    console.log('❌ ماعندناش إعدادات داتابيز');
    sequelize = null; // ⬅️ مهم: خليه null إذا ما كاينش
  }
} else {
  console.log('✅ DATABASE_URL موجود');
  
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : false
  });
}

console.log('✅ الداتابيز راه جاهز:', sequelize ? 'نعم' : 'لا');

// ⚠️ ⚠️ ⚠️ مهم: دايماً كيexport حتى إذا sequelize هو null
module.exports = { sequelize, Sequelize };