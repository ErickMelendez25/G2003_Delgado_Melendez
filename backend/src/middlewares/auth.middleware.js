// backend/middlewares/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const COOKIE_NAME = process.env.COOKIE_NAME || "campusuc_token";

export function authRequired(req, res, next) {
  try {
    // 1) Intentar cookie HttpOnly
    const tokenFromCookie = req.cookies?.[COOKIE_NAME];
    // 2) Intentar header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    const token = tokenFromCookie || tokenFromHeader;
    if (!token) return res.status(401).json({ error: "No autenticado" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    console.error("authRequired error:", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
