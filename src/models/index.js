// هذا الملف اختياري، يمكن حذفه إذا كنت تستعمل config/database.js فقط
console.log('📦 Loading database models...');

const { sequelize } = require('../../config/database');
const { DataTypes } = require('sequelize');

// تعريف الموديلات (أمثلة)
const Product = sequelize?.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

const User = sequelize?.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

// Export models
module.exports = {
  sequelize,
  Product: sequelize ? Product : null,
  User: sequelize ? User : null
};