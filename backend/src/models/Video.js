import { Schema, model } from "mongoose";

const videoSchema = new Schema(
    {
        titulo: {
            type: String,
            required: [true, "El título del video es obligatorio."],
            trim: true,
        },
        descripcion: {
            type: String,
            trim: true,
        },
        thumbnailUrl: {
            type: String,
            required: [true, "La imagen de portada es obligatoria."],
            trim: true,
        },
        categoria: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "La categoría es obligatoria."],
        },
        urlPublica: {
            type: String,
            trim: true,
            // URL del teaser o clip corto (15-20s) para usuarios no registrados
        },
        urlPrivada: {
            type: String,
            required: [true, "La URL del video completo es obligatoria."],
            trim: true,
            // URL del video completo para usuarios registrados
        },
        esPremium: {
            type: Boolean,
            default: true,
        },
        duracion: {
            type: Number, // Duración en segundos
            min: [0, "La duración no puede ser negativa."],
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Video", videoSchema);
