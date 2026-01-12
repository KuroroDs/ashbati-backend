const { sequelize, Category, Product, Unit } = require('./src/models');

const seedDatabase = async () => {
    try {
        console.log('🌱 بداية زراعة البيانات (Seeding)...');
        
        // 1. الاتصال بقاعدة البيانات
        await sequelize.authenticate();
        
        // (اختياري) مسح البيانات القديمة باش مايتعاودوش
        // await sequelize.sync({ force: true }); 

        // -----------------------------------------
        // 2. إنشاء الوحدات (Units)
        // -----------------------------------------
        console.log('⚖️ إنشاء الوحدات...');
        const unitGram = await Unit.create({ name: 'Gram', symbol: 'g' });
        const unitKg = await Unit.create({ name: 'Kilogram', symbol: 'kg' });
        const unitPiece = await Unit.create({ name: 'Pièce', symbol: 'pcs' }); // للقارورات والعلب

        // -----------------------------------------
        // 3. إنشاء الأقسام (Categories)
        // -----------------------------------------
        console.log('📂 إنشاء الأقسام...');
        const catHoney = await Category.create({ 
            name: 'العسل ومنتجات النحل', 
            slug: 'honey',
            image: 'honey.jpg'
        });
        
        const catHerbs = await Category.create({ 
            name: 'الأعشاب العلاجية', 
            slug: 'herbs',
            image: 'herbs.jpg'
        });

        const catOils = await Category.create({ 
            name: 'الزيوت الطبيعية', 
            slug: 'oils',
            image: 'oils.jpg'
        });

        // -----------------------------------------
        // 4. إنشاء المنتجات (Products)
        // -----------------------------------------
        console.log('📦 إضافة المنتجات...');

        // منتج 1: عسل سدر (بالكيلو)
        await Product.create({
            name: 'عسل سدر جبلي حر',
            description: 'عسل سدر طبيعي 100% من جبال الأوراس، مفيد للمناعة.',
            buying_price: 3500.00,        // شريناه بـ 3500
            selling_price_per_base_unit: 4500.00, // نبيعوه بـ 4500
            stockage: 50,                 // عندنا 50 كيلو
            image_url: 'honey_sidr.jpg',
            unit_type: 'WEIGHT',
            unit_id: unitKg.id,
            categoryId: catHoney.id
        });

        // منتج 2: زيت الأرغان (بالقارورة/القطعة)
        await Product.create({
            name: 'زيت الأرغان للتجميل',
            description: 'زيت أرغان أصلي للشعر والبشرة.',
            buying_price: 1200.00,
            selling_price_per_base_unit: 1800.00,
            stockage: 100,                // عندنا 100 قارورة
            image_url: 'argan_oil.jpg',
            unit_type: 'PIECE',
            unit_id: unitPiece.id,
            categoryId: catOils.id
        });

        // منتج 3: زهرة البابونج (بالغرام)
        await Product.create({
            name: 'زهرة البابونج (Camomille)',
            description: 'بابونج مجفف ممتاز للاسترخاء والنوم.',
            buying_price: 5.00,           // سعر الغرام الواحد فالشراء
            selling_price_per_base_unit: 10.00, // سعر الغرام الواحد للبيع
            stockage: 5000,               // عندنا 5000 غرام (5 كيلو)
            image_url: 'camomille.jpg',
            unit_type: 'WEIGHT',
            unit_id: unitGram.id,
            categoryId: catHerbs.id
        });

        console.log('✅ تمت عملية الزراعة بنجاح! المخزن عامر دابا.');
        process.exit();

    } catch (error) {
        console.error('❌ خطا في العملية:', error);
        process.exit(1);
    }
};

seedDatabase();