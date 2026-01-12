try {
  console.log('🔗 Initialisation de Sequelize...');
  
  const { Sequelize } = require('sequelize');
  console.log('✅ Sequelize importé');

  // Debug
  console.log('📊 DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set!');
  }

  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: true, // غير لـ true
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    retry: {
      max: 3
    }
  });

  console.log('✅ Sequelize initialisé avec succès');
  
  // Test immédiat
  sequelize.authenticate()
    .then(() => console.log('🔗 Test de connexion: OK'))
    .catch(err => console.error('🔗 Test de connexion: ERREUR', err.message));

  module.exports = { sequelize, Sequelize };

} catch (error) {
  console.error('❌ ERREUR dans models/index.js:', error.message);
  console.error('📌 Stack:', error.stack);
  throw error;
}    console.log('✅ Connexion à la base de données réussie');
    console.log("🚀 Démarrage du serveur sur le port", PORT);