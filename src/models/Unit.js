const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Unit = sequelize.define('Unit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    symbol: {
        type: DataTypes.STRING, // g, kg, ml, pcs
        allowNull: false
    }
}, {
    tableName: 'units', // باش نضمنو الاسم يكون كما بغينا
    timestamps: false   // الوحدات ماكيحتاجوش created_at
});

module.exports = Unit;