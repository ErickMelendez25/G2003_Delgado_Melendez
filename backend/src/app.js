// backend/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// CORS: ajusta origin a tu frontend en producción
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir uploads estáticos
app.use("/uploads", express.static("uploads"));

// Rutas
app.use("/api/auth", authRoutes);    // ahora todas las auth van a /api/auth/*
app.use("/api", uploadRoutes);       // tu /api/upload sigue funcionando

export default app;
