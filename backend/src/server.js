import app from './app.js';
import './db.js'; // conexión DB
import dotenv from 'dotenv';
import multer from 'multer';
import fs from "fs";
import axios from "axios";

dotenv.config();

// Configuración de Multer (guarda los archivos en /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 📂 carpeta donde guardarás los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // nombre único
  },
});

const upload = multer({ storage }); // 👈 ahora sí definimos upload

// Puerto
const port = Number(process.env.PORT || 4000);

app.get("/", (req, res) => {
  res.send("Bienvenido a CampusUC API 🚀");
});

// Ruta para subir archivos
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("Archivo recibido:", req.file);

  try {
    // 📂 Leer el contenido del archivo (ejemplo: si es .txt o .docx)
    const text = fs.readFileSync(req.file.path, "utf8");

    // 🔗 Llamada a LanguageTool API (puedes usar su endpoint público)
    const response = await axios.post(
      "https://api.languagetoolplus.com/v2/check",
      new URLSearchParams({
        text: text,
        language: "es",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    // 📌 Transformar el resultado
    const matches = response.data.matches.map((m) => ({
      message: m.message,
      suggestion: m.replacements.map((r) => r.value).join(", "),
      context: m.context.text,
    }));

    res.json({
      spelling: `${matches.length} errores detectados`,
      grammar: "Revisión completa",
      suggestions: matches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al analizar el archivo" });
  }
});


app.listen(port, () =>
  console.log(`🚀 API escuchando en http://localhost:${port}`)
);
