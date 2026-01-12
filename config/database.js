console.log('Initializing database connection...');

const { Sequelize } = require('sequelize');

// Determine which database URL to use
let connectionString;

if (process.env.DATABASE_URL) {
    // Production = Railway URL
    connectionString = process.env.DATABASE_URL;
    console.log('Using DATABASE_URL from environment');
} else if (process.env.DB_HOST && process.env.DB_NAME) {
    // Development = Separate settings
    const user = process.env.DB_USER || 'postgres';
    const password = process.env.DB_PASS || '';
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT || 5432;
    const database = process.env.DB_NAME;

    connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
    console.log('Using separate DB settings for development');
} else {
    console.log('X No database configuration found');
    console.log('Server will run without database connection');
    module.exports = { sequelize: null, Sequelize };
    return;
}

// Create Sequelize instance
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false, // Set to console.log for debugging
    dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {},
    pool: {
        max: 5,
        min: 0,
        acquire: 20000,
        idle: 10000
    }
});

console.log('Sequelize instance created');