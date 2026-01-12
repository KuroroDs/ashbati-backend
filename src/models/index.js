console.log('🔗 باش نربطو مع الداتابيز...');

const { Sequelize } = require('sequelize');

// شوف واش كاين DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL ماموجودش!');
  throw new Error('DATABASE_URL ماموجودش');
}

console.log('✅ DATABASE_URL موجود');

// هنا استعمل const عادي، ماشي مشكل
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

console.log('✅ الداتابيز راه جاهز');

module.exports = { sequelize, Sequelize };