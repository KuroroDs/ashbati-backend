console.log("🔄 Démarrage du serveur...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. تأكد أن dotenv يحمل المتغيرات أولاً
dotenv.config();

// 2. debug: شوف المتغيرات
console.log("🔧 DEBUG ENV:");
console.log("DATABASE_URL exists?", !!process.env.DATABASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);

// 3. استدعاء sequelize بعد dotenv
const { sequelize } = require('./src/models'); 

// 4. استدعاء ملف الروابط
const routes = require('./src/routes/index'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

// Route de test
app.get('/', (req, res) => {
    res.send('🌿 Bienvenue sur l\'API de Ashbati - Le serveur fonctionne !');
});

const PORT = process.env.PORT || 3000; // غير من 5000 لـ 3000

const startServer = async () => {
    try {
        console.log("⏳ Connexion à la base de données en cours...");
        
        // تيست الاتصال
        await sequelize.authenticate();
        console.log('✅ Connexion à PostgreSQL réussie !');

        // ⚠️ لا تستعمل sync({ alter: true }) في الإنتاج!
        // استعمل migrations بدلاً من ذلك
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: false }); // أو { force: false } للتجربة فقط
            console.log('📦 Les tables sont synchronisées (développement).');
        } else {
            // في الإنتاج، ما تسنكش تلقائياً
            console.log('🚫 Mode production - Aucune synchronisation automatique.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Le serveur est en ligne sur le port: ${PORT}`);
            console.log(`🌐 URL Railway: https://${process.env.RAILWAY_STATIC_URL || 'votre-projet'}.railway.app`);
        });
    } catch (error) {
        console.error('❌ Une erreur s\'est produite :', error);
        console.error('📌 Détails:', error.message);
        
        // إغلاق السيرفر إذا فشل الاتصال
        process.exit(1);
    }
};

startServer();