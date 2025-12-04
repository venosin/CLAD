import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import HTMLPasswordResetMail from '../utils/HTMLPasswordResetMail.js';

const passwordController = {};

// Solicitar restablecimiento de contraseña
passwordController.requestReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "El email es obligatorio" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Por seguridad, no indicamos si el usuario existe o no, pero para desarrollo/UX a veces se hace.
            // En este caso, diremos que si existe se envió.
            return res.status(404).json({ message: "No existe un usuario con ese correo electrónico" });
        }

        // Generar código de recuperación
        const resetCode = crypto.randomBytes(3).toString("hex"); // 6 caracteres
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

        // Crear token temporal para la recuperación
        const resetToken = jwt.sign(
            {
                email,
                resetCode,
                expiresAt,
                type: 'password_reset'
            },
            config.JWT.SECRET,
            { expiresIn: "15m" }
        );

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
            subject: "Recuperación de contraseña - CLAD",
            html: HTMLPasswordResetMail(resetCode),
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("Error al enviar correo de recuperación:", err);
                return res.status(500).json({ message: "Error al enviar el correo" });
            }

            res.status(200).json({
                message: "Correo de recuperación enviado",
                token: resetToken // Enviar token al frontend
            });
        });

    } catch (error) {
        console.error("Error en solicitud de recuperación:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// Verificar código de recuperación
passwordController.verifyCode = async (req, res) => {
    const { resetCode, token } = req.body;

    if (!resetCode || !token) {
        return res.status(400).json({ message: "Faltan datos (código o token)" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT.SECRET);

        if (decoded.type !== 'password_reset') {
            return res.status(400).json({ message: "Token inválido para esta operación" });
        }

        if (Date.now() > decoded.expiresAt) {
            return res.status(400).json({ message: "El código ha expirado" });
        }

        if (resetCode !== decoded.resetCode) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        res.status(200).json({ message: "Código verificado correctamente" });

    } catch (error) {
        return res.status(400).json({ message: "Token inválido o expirado" });
    }
};

// Restablecer la contraseña
passwordController.resetPassword = async (req, res) => {
    const { newPassword, token } = req.body;

    if (!newPassword || !token) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    try {
        const decoded = jwt.verify(token, config.JWT.SECRET);

        if (decoded.type !== 'password_reset') {
            return res.status(400).json({ message: "Token inválido" });
        }

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar contraseña
        // Nota: Como el modelo tiene un pre('save') que hashea si se modifica 'password',
        // simplemente asignamos la nueva contraseña en texto plano.
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente" });

    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        res.status(500).json({ message: "Error al restablecer la contraseña" });
    }
};

export default passwordController;
