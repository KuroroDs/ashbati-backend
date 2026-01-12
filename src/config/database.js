const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432, // زدنا البور هنا
        dialect: 'postgres', // أكدنا عليها هنا
        logging: false,
    }
);

module.exports = sequelize;