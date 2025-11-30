import request from "supertest";
import app from "../app.js";
import path from "path";
import { pool } from '../db.js';


describe("POST /upload", () => {
  it(
    "debería analizar un archivo PDF y devolver texto corregido",
    async () => {
      const filePath = path.join(process.cwd(), "src/__tests__/sample.pdf");

      const res = await request(app)
        .post("/upload")
        .attach("file", filePath);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("correctedText");
    },
    30000 // ✅ timeout 30 segundos
  );
});



afterAll(async () => {
  await pool.end(); // 🔒 Cierra todas las conexiones al terminar los tests
});