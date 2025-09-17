import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authRequired(req, res, next) {
  const token = req.cookies?.[process.env.COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'No autenticado' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

