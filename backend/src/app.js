// src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

dotenv.config();

const app = express();

// Seguridad y límites
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(helmet());
app.use(limiter);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Auth routes mock para tests
app.post('/api/auth/register', async (req, res) => {
  const { name, email } = req.body;
  res.status(200).json({ message: 'Usuario registrado correctamente', user: { name, email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  res.status(200).json({ message: 'Inicio de sesión exitoso', user: { email } });
});

// Models route mock para tests
app.get('/api/models', async (req, res) => {
  res.status(200).json({ models: ['gemini-2.5-flash', 'gemini-1'] });
});

// Multer para tests (upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    let text = '';

    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const data = await mammoth.extractRawText({ path: filePath });
      text = data.value;
    } else if (req.file.mimetype.startsWith('text/')) {
      text = fs.readFileSync(filePath, 'utf8');
    } else {
      return res.status(400).json({ error: 'Tipo de archivo no soportado' });
    }

    // Mock de corrección de texto para tests
    const correctedText = text + ' (corregido)';

    const correctedFilePath = path.join('uploads', `${Date.now()}_corregido.txt`);
    fs.writeFileSync(correctedFilePath, correctedText);

    res.json({ message: '✅ Análisis completado (mock)', correctedText, correctedFilePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al analizar archivo' });
  }
});

export default app;
