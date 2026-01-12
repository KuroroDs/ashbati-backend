console.log("🔄 Démarrage du serveur...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./src/models'); 

// 1. استدعاء ملف الروابط (هذا هو السطر اللي كان ناقص)
const routes = require('./src/routes/index'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
// 2. تفعيل الروابط (أي حاجة تبدا بـ /api غتمشي لملف routes)
app.use('/api', routes);

// Route de test (الصفحة الرئيسية)
app.get('/', (req, res) => {
    res.send('🌿 Bienvenue sur l\'API de Ashbati - Le serveur fonctionne !');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log("⏳ Connexion à la base de données en cours...");
        
        await sequelize.authenticate();
        console.log('✅ Connexion à PostgreSQL réussie !');

        // رجعناها alter باش مايمسحش الداتا
        await sequelize.sync({ alter: true });
        console.log('📦 Les tables sont synchronisées.');

        app.listen(PORT, () => {
            console.log(`🚀 Le serveur est en ligne sur : http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Une erreur s\'est produite :', error);
    }
};

startServer();