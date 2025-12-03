import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true, // " Alabanza " -> "Alabanza"
    },
    descripcion: {
        type: String,
    },
    thumbnailUrl: {
        type: String, // Imagen de portada de la serie/categoría
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true, // Para URLs amigables: miweb.com/series/vida-nueva
    },
}, {
    timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
