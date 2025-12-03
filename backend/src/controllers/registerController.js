import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const registerController = {};

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT.SECRET, {
        expiresIn: config.JWT.EXPIRES || '30d',
    });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
registerController.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    // Validación de campos básicos
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios: nombre, email, password" });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const user = await User.create({
            nombre,
            email,
            password,
        });

        if (user) {
            const token = generateToken(user._id);

            // Guardar el token en una cookie HTTP-only
            res.cookie("authToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
            });

            res.status(201).json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                token: token,
                message: "Usuario registrado exitosamente"
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos' });
        }
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export default registerController;
