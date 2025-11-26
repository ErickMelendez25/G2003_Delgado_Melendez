import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import adminHistoryRoutes from "./routes/adminHistoryRoutes.js";


const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 👇 ESTA LÍNEA ES LA IMPORTANTE
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin/history", adminHistoryRoutes);


app.listen(4000, () => console.log("Servidor corriendo en puerto 4000"));
