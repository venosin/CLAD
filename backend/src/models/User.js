import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio."],
            trim: true,
            minlength: [2, "El nombre debe tener al menos 2 caracteres."],
        },
        email: {
            type: String,
            required: [true, "El correo es obligatorio."],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
                "El correo electrónico no es válido.",
            ],
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria."],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
        },
        rol: {
            type: String,
            enum: {
                values: ["visitante", "miembro", "admin"],
                message: "{VALUE} no es un rol válido.",
            },
            default: "visitante",
        },
        fechaRegistro: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

// Comparar la contraseña ingresada con la contraseña hasheada en la base de datos
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encriptar la contraseña usando bcrypt antes de guardar
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export default model("User", userSchema);
