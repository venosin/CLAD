import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import emailVerification from '../utils/emailVerification.js';

const registerController = {};

// Registrar un nuevo usuario
registerController.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    // Validación de campos básicos obligatorios
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios: nombre, email, password" });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "Ya existe un usuario con este email" });
        }

        // Preparar datos del usuario
        // Nota: La contraseña se hashea en el modelo User con el middleware pre('save')
        // pero como estamos usando el modelo refactorizado que quizás espera el hash manual si usamos create,
        // vamos a dejar que el modelo haga su trabajo si usamos `new User()`.
        // Sin embargo, en el ejemplo proporcionado hashean manualmente.
        // Dado que tu modelo User.js tiene un pre('save'), NO debemos hashear aquí para evitar doble hash
        // O debemos desactivar el pre('save') si queremos control total.
        // Vamos a confiar en el pre('save') de tu modelo actual.

        const userData = {
            nombre,
            email,
            password, // El modelo se encargará de hashear esto
            rol: 'visitante', // Por defecto
            // isVerified: false // Si agregamos este campo al modelo
        };

        // Crear el nuevo usuario
        const newUser = new User(userData);
        await newUser.save();

        // Generar código de verificación
        const verificationCode = crypto.randomBytes(3).toString("hex");
        const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas

        // Crear JWT con el código de verificación (temporal para verificar)
        const tokenCode = jwt.sign(
            {
                email,
                verificationCode,
                expiresAt,
            },
            config.JWT.SECRET,
            { expiresIn: "2h" }
        );

        // Guardar el token en una cookie (opcional, pero útil para el flujo)
        res.cookie("verificationToken", tokenCode, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60 * 1000,
        });

        // Configurar el transportador de correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.EMAIL,
                pass: config.email.PASSWORD,
            },
        });

        // Configurar las opciones del correo
        const mailOptions = {
            from: config.email.EMAIL,
            to: email,
            subject: "Verificación de correo - CLAD",
            html: emailVerification(verificationCode),
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error al enviar correo:", err);
                // Aunque falle el correo, el usuario se creó. Podríamos borrarlo o avisar.
                // Por ahora avisamos.
                return res.status(500).json({
                    message: "Usuario registrado pero error al enviar correo de verificación",
                    userId: newUser._id
                });
            }

            // Respuesta exitosa
            res.status(201).json({
                message: "Usuario registrado. Por favor verifica tu correo con el código enviado.",
                token: tokenCode, // Enviamos el token al frontend por si no usan cookies
                userId: newUser._id
            });
        });

    } catch (error) {
        console.error("Error en registro de usuario:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// Verificar el correo electrónico con el código enviado
registerController.verifyEmail = async (req, res) => {
    const { verificationCode } = req.body;
    const token = req.cookies.verificationToken || req.body.token;

    if (!token) {
        return res.status(400).json({ message: "No se proporcionó token de verificación" });
    }

    try {
        // Verificar y decodificar el JWT
        const decoded = jwt.verify(token, config.JWT.SECRET);
        const { email, verificationCode: storedCode, expiresAt } = decoded;

        // Verificar si el código ha expirado
        if (Date.now() > expiresAt) {
            return res.status(400).json({ message: "El código de verificación ha expirado" });
        }

        // Comparar el código recibido con el almacenado
        if (verificationCode !== storedCode) {
            return res.status(400).json({ message: "Código de verificación inválido" });
        }

        // Buscar y actualizar el usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Marcar como verificado (si tuviéramos el campo, por ahora asumimos que esto completa el proceso)
        // user.isVerified = true; 
        // await user.save();

        // Limpiar la cookie de verificación
        res.clearCookie("verificationToken");

        // Generar token de autenticación real (login automático)
        const authToken = jwt.sign(
            {
                id: user._id,
                rol: user.rol,
            },
            config.JWT.SECRET,
            {
                expiresIn: config.JWT.EXPIRES,
            }
        );

        // Guardar el token en una cookie
        res.cookie("jwt", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
        });

        // Responder con éxito
        res.status(200).json({
            message: "Correo verificado correctamente. Has iniciado sesión automáticamente",
            token: authToken,
            user: {
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
            }
        });

    } catch (error) {
        console.error("Error al verificar email:", error);
        res.status(500).json({
            message: "Error al verificar el correo o token inválido",
            error: error.message
        });
    }
};

export default registerController;
