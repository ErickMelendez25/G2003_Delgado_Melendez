import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { pool } from "../db.js";

dotenv.config();

// ----------- función analizarTexto (de tu versión anterior) ----------
const analizarTexto = async (texto) => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("No se encontró GOOGLE_GEMINI_API_KEY");

  const modelos = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

  const prompt = `
Eres un corrector académico experto. Analiza el siguiente texto.
Tipos: spelling, grammar, citation, other.

Devuelve estrictamente JSON:
{
 "correctedText": "...",
 "annotations": [
   {"original":"...", "type":"...", "suggestion":"...", "note":"..."}
 ]
}

Texto:
"""${texto}"""
`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 3000, temperature: 0.2 },
  };

  const requests = modelos.map(async (modelo) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  });

  const results = await Promise.allSettled(requests);
  const valid = results.find((r) => r.status === "fulfilled" && r.value);

  if (!valid) throw new Error("No hubo respuesta válida del modelo.");
  const cleanText = valid.value.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    return { correctedText: cleanText, annotations: [] };
  }
};

// -------------- controlador principal --------------------
export const analyzeDocument = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No se subió ningún archivo." });

    const userId = req.user.id;
    const fileName = req.file.filename;

    console.log("Usuario:", userId, "Archivo:", fileName);

    const filePath = path.resolve(req.file.path);
    const ext = path.extname(req.file.originalname).toLowerCase();

    let fileContent = "";

    switch (ext) {
      case ".txt":
        fileContent = fs.readFileSync(filePath, "utf8");
        break;
      case ".docx":
        fileContent = (await mammoth.extractRawText({ path: filePath })).value.trim();
        break;
      case ".pdf":
        fileContent = (await pdfParse(fs.readFileSync(filePath))).text.trim();
        break;
      default:
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Formato no soportado (.pdf,.docx,.txt)" });
    }

    // ======== PRIMERO ANALIZAR ========
    const resultado = await analizarTexto(fileContent);

    // ======== LUEGO GUARDAR EN BD ========
    await pool.query(
    `INSERT INTO file_uploads (user_id, file_name, original_text, corrected_text, annotations)
    VALUES (?, ?, ?, ?, ?)`,
    [
        userId,
        fileName,
        fileContent,                      // ← AQUI EL TEXTO ORIGINAL
        resultado.correctedText || "",
        JSON.stringify(resultado.annotations || []),
    ]
    );


    // ======== RESPUESTA ========
    res.json({
      originalText: fileContent,
      ...resultado,
      fileUrl: `${req.protocol}://${req.get("host")}/uploads/${fileName}`,
    });

  } catch (err) {
    console.error("❌ Error en analyzeDocument:", err);
    res.status(500).json({ error: "Error interno", detail: err.message });
  }
};
