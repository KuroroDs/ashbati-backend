const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // تأكد بلي المسار صحيح

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    slug: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Category; // <--- أهم سطر: باش index.js يقدر يخدم بيه