console.log("🔄 Démarrage du serveur... [1/8]");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

console.log("📦 Modules chargés... [2/8]");

// ⚠️ ضع dotenv config فقط للتطوير المحلي
if (process.env.NODE_ENV !== 'production') {
  console.log("🔧 Mode développement détecté");
  dotenv.config();
  console.log("🔧 .env chargé");
} else {
  console.log("🔧 Mode production détecté");
}

console.log("🔧 PORT:", process.env.PORT);
console.log("🔧 NODE_ENV:", process.env.NODE_ENV);
console.log("🔧 DATABASE_URL exists:", !!process.env.DATABASE_URL);

console.log("📂 Chargement des modèles... [3/8]");
const { sequelize } = require('./src/models');

console.log("🛣️  Chargement des routes... [4/8]");
const routes = require('./src/routes/index');

const app = express();
console.log("🚀 Express app créée... [5/8]");

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);
console.log("🔧 Middlewares configurés... [6/8]");

// Route de test
app.get('/', (req, res) => {
  console.log("📡 Requête reçue sur /");
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
console.log(`🎯 Port configuré: ${PORT} [7/8]`);

const startServer = async () => {
  try {
    console.log(`🔗 Tentative de connexion à la base de données...`);
    
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL réussie !');

    console.log(`🌍 Démarrage du serveur sur 0.0.0.0:${PORT}...`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SERVEUR DÉMARRÉ SUR LE PORT: ${PORT}`);
      console.log(`🌐 URL publique: https://${process.env.RAILWAY_STATIC_URL || 'ashbati-backend'}.railway.app`);
      console.log(`⏱️  Heure: ${new Date().toLocaleString()}`);
      console.log(`📊 Mémoire: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    });

  } catch (error) {
    console.error('❌ ERREUR CRITIQUE:', error.message);
    console.error('📌 Stack:', error.stack);
    console.error('💀 Arrêt du processus...');
    process.exit(1);
  }
};

console.log("🎬 Démarrage du serveur... [8/8]");
startServer();