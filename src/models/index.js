const sequelize = require('../config/database');
const Category = require('./Category');
const Product = require('./Product');
const Unit = require('./Unit'); // زدنا هادي

// 1. علاقة الفئة بالمنتجات (كما كانت)
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// 2. علاقة الوحدات بالمنتجات (الجديدة)
// الوحدة الواحدة (مثلاً Kg) يقدر يكون عندها بزاف المنتجات
Unit.hasMany(Product, { foreignKey: 'unit_id', as: 'products' });
// المنتج تابع لوحدة وحدة
Product.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

module.exports = {
    sequelize,
    Category,
    Product,
    Unit
};