console.log('🔗 Initialisation de Sequelize...');

const { Sequelize } = require('sequelize');

// Debug
console.log('📊 DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
console.log('🔒 SSL required:', process.env.NODE_ENV === 'production');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // غير لـ true باش تشوف الـ queries
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

console.log('✅ Sequelize initialisé');

module.exports = { sequelize, Sequelize };