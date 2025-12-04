import { Schema, model } from "mongoose";

const progressSchema = new Schema(
    {
        usuario: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "El usuario es obligatorio."],
        },
        contenido: {
            type: Schema.Types.ObjectId,
            required: [true, "El contenido es obligatorio."],
            refPath: "tipoContenido", // Referencia dinámica
        },
        tipoContenido: {
            type: String,
            required: [true, "El tipo de contenido es obligatorio."],
            enum: {
                values: ["Video", "Audio"],
                message: "{VALUE} no es un tipo de contenido válido.",
            },
        },
        segundoActual: {
            type: Number,
            default: 0,
            min: [0, "El segundo actual no puede ser negativo."],
        },
        completado: {
            type: Boolean,
            default: false,
        },
        ultimoAcceso: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

// Índice compuesto: Un usuario solo puede tener UN registro de progreso por contenido específico
progressSchema.index({ usuario: 1, contenido: 1, tipoContenido: 1 }, { unique: true });

export default model("Progress", progressSchema);
