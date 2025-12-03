import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    tipo: {
        type: String,
        enum: ['video', 'audio'],
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    urlPublica: {
        type: String,
        // Opcional: URL del teaser o clip corto
    },
    urlPrivada: {
        type: String,
        required: true,
        // URL del contenido completo (Vimeo/S3)
    },
    esPremium: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;
