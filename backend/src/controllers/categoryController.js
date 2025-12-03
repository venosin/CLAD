import Category from '../models/Category.js';

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Crear una nueva categoría
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    const { nombre, descripcion, thumbnailUrl, slug } = req.body;

    try {
        const categoryExists = await Category.findOne({ slug });

        if (categoryExists) {
            return res.status(400).json({ message: 'La categoría ya existe (slug duplicado)' });
        }

        const category = new Category({
            nombre,
            descripcion,
            thumbnailUrl,
            slug,
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Actualizar una categoría
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
    const { nombre, descripcion, thumbnailUrl, slug } = req.body;

    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            category.nombre = nombre || category.nombre;
            category.descripcion = descripcion || category.descripcion;
            category.thumbnailUrl = thumbnailUrl || category.thumbnailUrl;
            category.slug = slug || category.slug;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Eliminar una categoría
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            await category.deleteOne();
            res.json({ message: 'Categoría eliminada' });
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
