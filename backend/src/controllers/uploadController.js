import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import { pool } from "../db.js";

import { sendEmail } from "../utils/email.js";
import PDFDocument from "pdfkit";

dotenv.config();

// ----------- función analizarTexto (de tu versión anterior) ----------
const analizarTexto = async (texto) => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("No se encontró GOOGLE_GEMINI_API_KEY");

  // Modelos válidos
  const modelos = [
    "gemini-2.0-flash",
    "gemini-2.0-pro-exp",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash-latest"
  ];

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
    generationConfig: { maxOutputTokens: 3000, temperature: 0.1 },
  };

  for (const modelo of modelos) {
    try {
      console.log(`📤 Probando modelo: ${modelo}`);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("📥 Respuesta cruda:", data);

      if (data.error) {
        console.log("⚠️ Error en modelo:", modelo, data.error.message);
        continue;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;

      const clean = text.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    } catch (err) {
      console.log(`⚠️ Falló modelo ${modelo}:`, err.message);
    }
  }

  throw new Error("❌ No hubo respuesta válida del modelo.");
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

  // ============================================================
    // 📝 1. CREAR PDF TEMPORAL CON PDFKIT
    // ============================================================
    const tempPdfPath = path.join("uploads", `corregido_${Date.now()}.pdf`);

    const pdfDoc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    pdfDoc.pipe(fs.createWriteStream(tempPdfPath));

    pdfDoc.fontSize(18).text("Documento Corregido - CampusUC", { align: "center" });
    pdfDoc.moveDown();

    pdfDoc.fontSize(12).text(resultado.correctedText, {
      align: "left",
      lineGap: 4,
    });

    pdfDoc.end();

    // ============================================================
    // 📩 2. OBTENER EMAIL DEL ESTUDIANTE
    // ============================================================
    const [userData] = await pool.query("SELECT email, name FROM users WHERE id = ?", [
      userId,
    ]);

    const email = userData[0]?.email;
    const nombre = userData[0]?.name || "estudiante";

    // ============================================================
    // 📮 3. ENVIAR CORREO CON PDF ADJUNTO
    // ============================================================
    if (email) {
      try {
        await sendEmail({
          to: email,
          subject: "Tu documento corregido está listo 📘",
          text: `Hola ${nombre}, tu documento corregido ya está disponible.`,
          html: `
            <h2>Hola ${nombre},</h2>
            <p>CampusUC ha analizado tu documento correctamente.</p>
            <p><strong>Se detectaron ${resultado.annotations.length} observaciones.</strong></p>
            <p>Adjunto encontrarás el PDF con tu texto corregido.</p>
            <hr>
            <p>Puedes revisar el documento completo en la plataforma.</p>
          `,
          attachments: [
            {
              filename: "Documento_corregido.pdf",
              path: tempPdfPath,
              contentType: "application/pdf",
            },
          ],
        });

        console.log("📧 Correo enviado a:", email);
      } catch (err) {
        console.error("❌ Error al enviar correo:", err);
      }
    }

    // ============================================================
    // 🧹 4. ELIMINAR PDF TEMPORAL
    // ============================================================
    setTimeout(() => {
      fs.unlink(tempPdfPath, (err) => {
        if (err) console.error("⚠️ Error eliminando PDF temporal:", err);
        else console.log("🧹 PDF temporal eliminado.");
      });
    }, 5000);



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
