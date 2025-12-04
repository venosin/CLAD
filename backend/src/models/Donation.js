import { Schema, model } from "mongoose";

const donationSchema = new Schema(
    {
        usuario: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        monto: {
            type: Number,
            required: [true, "El monto de la donación es obligatorio."],
            min: [1, "El monto mínimo es 1."],
        },
        moneda: {
            type: String,
            required: [true, "La moneda es obligatoria."],
            default: "USD",
            trim: true,
        },
        transactionId: {
            type: String,
            required: [true, "El ID de transacción es obligatorio."],
            trim: true,
        },
        estado: {
            type: String,
            required: [true, "El estado de la donación es obligatorio."],
            enum: {
                values: ["pendiente", "completado", "fallido"],
                message: "{VALUE} no es un estado válido.",
            },
            default: "completed",
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Donation", donationSchema);