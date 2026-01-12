const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Debug
console.log('🔗 DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
console.log('🔗 Using SSL:', process.env.NODE_ENV === 'production');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log, // لرؤية الاستعلامات
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3
  }
});

module.exports = { sequelize, Sequelize };