import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        required: true,
    },
    segundoActual: {
        type: Number,
        default: 0, // Ej: Se quedó en el segundo 125
    },
    completado: {
        type: Boolean,
        default: false,
    },
    ultimoAcceso: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Índice compuesto: Un usuario solo puede tener UN registro de progreso por video
progressSchema.index({ usuario: 1, media: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;

