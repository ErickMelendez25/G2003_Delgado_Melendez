// src/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
});

// ✅ Solo verifica la conexión si no estás corriendo tests
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      const connection = await pool.getConnection();
      console.log(`✅ Conectado a la base de datos '${process.env.DB_NAME}'`);
      connection.release();
    } catch (err) {
      console.error('❌ Error al conectar a la base de datos:', err.message);
    }
  })();
}
