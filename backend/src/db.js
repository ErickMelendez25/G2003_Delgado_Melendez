// src/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Verificar conexión
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Conectado a la base de datos '${process.env.DB_NAME}' en ${process.env.DB_HOST}:${process.env.DB_PORT} con el usuario '${process.env.DB_USER}'`);
    connection.release();
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  }
})();
