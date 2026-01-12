console.log('🔗 باش نربطو مع الداتابيز...');

const { Sequelize } = require('sequelize');

// تحقق من DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('❌ DATABASE_URL ماموجودش!');
  
  // جرب الـ variables المنفصلة (للتطوير المحلي)
  if (process.env.DB_HOST && process.env.DB_NAME) {
    console.log('🔍 كاين إعدادات داتابيز منفصلة');
    // كون الـ URL يدوياً
    const constructedUrl = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || ''}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`;
    
    console.log('✅ URL متكون:', constructedUrl.replace(/:[^:@]*@/, ':****@'));
    
    const sequelize = new Sequelize(constructedUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    });
    
    module.exports = { sequelize, Sequelize };
    return;
  }
  
  throw new Error('DATABASE_URL ماموجودش');
}

console.log('✅ DATABASE_URL موجود');

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

console.log('✅ الداتابيز راه جاهز');

module.exports = { sequelize, Sequelize };