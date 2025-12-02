import { pool } from "../db.js";

export const getAllUploads = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.id, f.file_name, f.uploaded_at, u.email AS user_email
      FROM file_uploads f
      INNER JOIN users u ON u.id = f.user_id
      ORDER BY f.uploaded_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener historial", detail: err.message });
  }
};

export const getUploadByIdAdmin = async (req, res) => {
  try {
    const uploadId = req.params.id;

    const [rows] = await pool.query(
      `SELECT original_text, corrected_text, annotations
       FROM file_uploads WHERE id = ? LIMIT 1`,
      [uploadId]
    );

    if (!rows.length)
      return res.status(404).json({ error: "No encontrado" });

    let annotations = [];

    try {
      if (rows[0].annotations) {
        annotations = JSON.parse(rows[0].annotations);
      }
    } catch (err) {
      annotations = [];
    }

    res.json({
      originalText: rows[0].original_text,
      correctedText: rows[0].corrected_text,
      annotations
    });

  } catch (err) {
    console.log("ERROR ADMIN:", err)
    res.status(500).json({ error: "Error", detail: err.message });
  }
};
export const updateUpload = async (req, res) => {
  const { id } = req.params;
  const { file_name } = req.body;  
  try {
    await pool.query("UPDATE file_uploads SET file_name = ? WHERE id = ?", [file_name, id]);
    res.json({ ok: true, message: "Registro actualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const deleteUpload = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM file_uploads WHERE id = ?", [id]);
    res.json({ ok: true, message: "Registro eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
