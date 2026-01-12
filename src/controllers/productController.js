const { Product, Category, Unit } = require('../models');

// دالة لجلب جميع المنتجات
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category, as: 'category', attributes: ['name', 'slug'] }, // جيب ليا سمية القسم
                { model: Unit, as: 'unit', attributes: ['symbol'] }                // جيب ليا الوحدة (kg, g)
            ]
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({
            success: false,
            message: "Une erreur s'est produite lors de la récupération des produits."
        });
    }
};