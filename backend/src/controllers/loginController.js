import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const loginController = {};

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, config.JWT.SECRET, {
        expiresIn: config.JWT.EXPIRES || '30d',
    });
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
loginController.login = async (req, res) => {
    const { email, password } = req.body;

    // Validación de campos requeridos
    if (!email || !password) {
        return res.status(400).json({ message: "Faltan campos: email y password son requeridos" });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            // Guardar el token en una cookie HTTP-only
            res.cookie("authToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
            });

            res.json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                token: token,
                message: "Inicio de sesión exitoso"
            });
        } else {
            res.status(401).json({ message: 'Email o contraseña inválidos' });
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export default loginController;
