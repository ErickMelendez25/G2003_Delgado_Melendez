import { pool } from "../db.js";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT id, file_name, uploaded_at FROM file_uploads WHERE user_id = ? ORDER BY uploaded_at DESC",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener historial" });
  }
};


export const getAnalysisById = async (req, res) => {
  try {
    const historyId = req.params.id;
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT original_text, corrected_text, annotations 
       FROM file_uploads 
       WHERE id = ? AND user_id = ? LIMIT 1`,
      [historyId, userId]
    );

    if (!rows.length)
      return res.status(404).json({ error: "Archivo no encontrado." });

    let annotations = [];
    try {
      annotations = JSON.parse(rows[0].annotations || "[]");
    } catch {
      annotations = [];
    }

    res.json({
      originalText: rows[0].original_text,
      correctedText: rows[0].corrected_text,
      annotations,
    });

  } catch (err) {
    res.status(500).json({ error: "Error al obtener análisis", detail: err.message });
  }
};
