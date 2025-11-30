import bcrypt from "bcryptjs";
import { pool } from "./src/db.js";

const crearAdmin = async () => {
  const name = "Administrador";
  const email = "admin@campus.com";
  const password = "admin123";
  const role = "admin";

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role]
  );

  console.log("✔ Usuario administrador creado correctamente.");
  process.exit();
};

crearAdmin();
