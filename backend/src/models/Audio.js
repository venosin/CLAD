import { Schema, model } from "mongoose";

const audioSchema = new Schema(
    {
        titulo: {
            type: String,
            required: [true, "El título del audio es obligatorio."],
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
            // URL del preview (opcional)
        },
        urlPrivada: {
            type: String,
            required: [true, "La URL del audio completo es obligatoria."],
            trim: true,
            // URL del audio completo
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

export default model("Audio", audioSchema);
