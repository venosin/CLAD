import { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre de la categoría es obligatorio."],
            trim: true,
            minlength: [2, "El nombre debe tener al menos 2 caracteres."],
        },
        descripcion: {
            type: String,
            trim: true,
        },
        thumbnailUrl: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
            trim: true,
            required: [true, "El slug es obligatorio para la URL."],
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Category", categorySchema);
