console.log("🔄 Démarrage du serveur...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// ⚠️ ضع dotenv config فقط للتطوير المحلي
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log("🔧 Mode développement - Chargement de .env");
} else {
  console.log("🔧 Mode production - Utilisation des variables Railway");
}

const { sequelize } = require('./src/models');
const routes = require('./src/routes/index');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: '🌿 Bienvenue sur l\'API de Ashbati',
    status: 'online',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: 'connected',
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log(`🔗 Tentative de connexion à la base de données...`);
    
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL réussie !');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur le port: ${PORT}`);
      console.log(`🌐 URL publique: https://${process.env.RAILWAY_STATIC_URL || 'votre-projet'}.railway.app`);
      console.log(`⏱️  Uptime: ${new Date().toLocaleString()}`);
    });

  } catch (error) {
    console.error('❌ Erreur de démarrage:', error.message);
    console.error('📌 Stack:', error.stack);
    process.exit(1);
  }
};

startServer();