const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
        type: DataTypes.TEXT,
        allowNull: true
    },
    buying_price: { // سعر الشراء (باش تحسب الفائدة)
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    selling_price_per_base_unit: { // سعر البيع للوحدة
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stockage: { // الكمية المتوفرة (سميناها stockage كما في الصورة)
        type: DataTypes.FLOAT, // درنا FLOAT حيث يقدر يكون عندك 1.5 كيلو
        defaultValue: 0
    },
    image_url: { // رابط الصورة
        type: DataTypes.STRING,
        allowNull: true
    },
    // unit_id و categoryId غادي يتزادوا أوتوماتيك عبر العلاقات فـ index.js
    // ولكن نقدروا نزيدوهم هنا باش نكونو صريحين:
    unit_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'products' // باش تكون سمية الجدول products
});

module.exports = Product;