// src/models/Product.js
const { DataTypes } = require('sequelize');
// تأكد بلي هذا المسار صحيح لملف الكونفيغ ديالك
const { sequelize } = require('../../config/database'); 

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  buying_price: {
    type: DataTypes.DECIMAL(10, 2) // على حساب الصورة
  },
  selling_price_per_base_unit: { // هذا هو السعر اللي يبان في الفرونت
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stockage: {
    type: DataTypes.INTEGER, // أو DECIMAL اذا تبيع بالميزان
    defaultValue: 0
  },
  image_url: {
    type: DataTypes.STRING
  },
  unit_id: {
    type: DataTypes.INTEGER
  },
  categoryId: { // ركز مليح: في الصورة مكتوبة categoryId (camelCase)
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'products', // اسم الجدول كيما في الصورة (lowercase)
  timestamps: true // باش يجيب createdAt و updatedAt
});

module.exports = Product;