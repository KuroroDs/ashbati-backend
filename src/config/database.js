// config/database.js - غيرو هكدا
const { Sequelize } = require('sequelize');
require('dotenv').config();

// خلي DATABASE_URL هو الأساسي
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // استعمل DATABASE_URL (للإنتاج على Railway)
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: { require: true, rejectUnauthorized: false }
    } : {}
  });
} else {
  // للتطوير المحلي (إذا ما كاينش DATABASE_URL)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'ashbati_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'root',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    }
  );
}

console.log('✅ Database configured for:', process.env.NODE_ENV);
module.exports = sequelize;