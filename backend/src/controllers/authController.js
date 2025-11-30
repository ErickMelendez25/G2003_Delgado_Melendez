// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../db.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";

dotenv.config();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 12;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1d";
const COOKIE_NAME = process.env.COOKIE_NAME || "campusuc_token";

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function setAuthCookie(res, payload) {
  const token = createToken(payload);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,      // 👈 IMPORTANTE PARA LOCALHOST
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return token;
}

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [data.email]);
    if (exists.length) return res.status(409).json({ error: "Email ya registrado" });

    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [data.name, data.email, hash, data.role || "student"]
    );

    const payload = { id: result.insertId, email: data.email, role: data.role || "student" };
    const token = setAuthCookie(res, payload);

    // además devolvemos token en body para compatibilidad con clientes header-based
  res.status(201).json({
    user: {
      id: result.insertId,
      name: data.name,
      email: data.email,
      role: payload.role,
    },
    token
  });

  } catch (err) {
    console.error("Error en register:", err);
    if (err?.issues) return res.status(400).json({ error: "Datos inválidos", details: err.issues });
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = setAuthCookie(res, payload);

    // devolvemos info de usuario + token (compatibilidad)
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role       // <-- IMPORTANTE
      },
      token
    });

  } catch (err) {
    console.error("Error en login:", err);
    if (err?.issues) return res.status(400).json({ error: "Datos inválidos", details: err.issues });
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const me = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error en me:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || COOKIE_NAME, { sameSite: "lax", httpOnly: true });
  res.json({ ok: true });
};



// 👇 AGREGA ESTO
export const profile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      user: rows[0]  // <-- ahora sí incluye name
    });

  } catch (err) {
    console.error("Error en profile:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
