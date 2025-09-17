import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../db.js';
import { registerSchema, loginSchema } from '../validators/auth.validators.js';
dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 12;

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d' });
  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
}

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [data.email]);
    if (exists.length) return res.status(409).json({ error: 'Email ya registrado' });
    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const [result] = await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?,?,?)', [data.name, data.email, hash]);
    setAuthCookie(res, { id: result.insertId, email: data.email, role: 'user' });
    res.status(201).json({ id: result.insertId, name: data.name, email: data.email });
  } catch (err) {
    if (err?.issues) return res.status(400).json({ error: 'Datos inválidos', details: err.issues });
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    setAuthCookie(res, { id: user.id, email: user.email, role: user.role });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    if (err?.issues) return res.status(400).json({ error: 'Datos inválidos', details: err.issues });
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const me = async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
  res.json(rows[0]);
};

export const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME, { sameSite: 'lax', httpOnly: true });
  res.json({ ok: true });
};