// server.js
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { fileURLToPath } from "url";
import { Document, Packer, Paragraph, TextRun } from "docx";
import "./db.js";
import app from "./app.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// 🧠 Configurar Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });



// 🔧 Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 📁 Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 🔍 Ruta de análisis con GEMINI
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    let text = "";

    // 📄 Leer archivo según formato
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const data = await mammoth.extractRawText({ path: filePath });
      text = data.value;
    } else if (req.file.mimetype.startsWith("text/")) {
      text = fs.readFileSync(filePath, "utf8");
    } else {
      return res.status(400).json({ error: "Tipo de archivo no soportado" });
    }

    // 🧠 Solicitud a GEMINI
    const prompt = `
Eres un experto corrector de textos académicos en español.
Corrige ortografía, gramática, puntuación y formato de citas (APA, ISO o similar).
Devuelve el texto corregido y una lista detallada de errores con sus correcciones.
Texto:
${text}
`;

      let correctedText = "";
      try {
        const result = await model.generateContent(prompt);
        correctedText = result.response.text();
      } catch (err) {
        console.error("⚠️ Error al conectar con Gemini:", err.message);
        return res.status(500).json({ error: "Error al conectarse con Gemini API" });
      }


    // 📝 Guardar archivo corregido .txt
    const correctedFilePath = path.join("uploads", `${Date.now()}_corregido.txt`);
    fs.writeFileSync(correctedFilePath, correctedText);

    res.json({
      message: "✅ Análisis completado con Gemini",
      correctedText,
      correctedFilePath,
    });
  } catch (error) {
    console.error("❌ Error al analizar archivo:", error);
    res.status(500).json({ error: "Error al analizar el archivo con Gemini" });
  }
});


app.get("/api/models", async (req, res) => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models?key=" + process.env.GEMINI_API_KEY
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener modelos:", error);
    res.status(500).json({ error: error.message });
  }
});


// 🔐 Ejemplo de endpoints de autenticación existentes (no eliminados)
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Aquí podrías agregar lógica de autenticación
    res.json({ message: "Inicio de sesión exitoso", user: { email } });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Aquí podrías registrar un nuevo usuario
    res.json({ message: "Usuario registrado correctamente", user: { name, email } });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// 🚀 Iniciar servidor
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`✅ Servidor escuchando en http://localhost:${port}`)
);
