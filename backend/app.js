// Importar librerías necesarias
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet"; // Importar helmet para seguridad
import fs from "fs";
import path from "path";

// Importar rutas
import userRoutes from "./src/routes/userRoutes.js";
import videoRoutes from "./src/routes/videoRoutes.js";
import audioRoutes from "./src/routes/audioRoutes.js";
import donationRoutes from "./src/routes/donationRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import progressRoutes from "./src/routes/progressRoutes.js";
import passwordRoutes from "./src/routes/passwordRoutes.js";

// Crear la instancia de la aplicación Express
const app = express();

// Middleware para seguridad (Helmet)
app.use(helmet());

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para analizar cookies
app.use(cookieParser());

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:4000",
            //   "http://192.168.100.48:8081", // Expo Dev Server (casa)
            //   "exp://192.168.100.48:8081", // Expo Go (casa)
            //   "http://192.168.100.48:4000", // Backend local (casa)
            //   "http://192.168.137.1:8081", // Expo Dev Server (colegio hotspot)
            //   "exp://192.168.137.1:8081", // Expo Go (colegio hotspot)
            //   "http://10.10.4.206:8081", // Expo Dev Server (colegio red directa)
            //   "exp://10.10.4.206:8081", // Expo Go (colegio red directa)
            //   "http://192.168.137.1:4000", // Backend (colegio hotspot)
            //   "http://10.10.4.206:4000", // Backend (colegio red directa)
            //   "https://omegadent.onrender.com", // Tu backend
            //   "https://omega-dent.vercel.app", // Frontend en Vercel
            //   "https://omega-dent-public-page.vercel.app", // Frontend alternativo en Vercel
            //   "https://omega-dent-pv.vercel.app", // 🆕 AGREGAR ESTE NUEVO DOMINIO
        ],
        credentials: true, // Permitir envío de cookies y credenciales
    })
);

// Usar rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/audios", audioRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/password", passwordRoutes);

export default app;