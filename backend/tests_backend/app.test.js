import { jest } from "@jest/globals";

process.env.NODE_ENV = "test";
process.env.DOTENV_CONFIG_QUIET = "true";

// =======================
// MOCK DB
// =======================
jest.unstable_mockModule("../src/db.js", () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn().mockResolvedValue({ release: jest.fn() })
  }
}));

// =======================
// MOCK MIDDLEWARES
// =======================
jest.unstable_mockModule("../src/middlewares/auth.js", () => ({
  authRequired: (req, res, next) => {
    req.user = { id: 1, role: "student", email: "erick@test.com" };
    next();
  }
}));

jest.unstable_mockModule("../src/middlewares/isAdmin.js", () => ({
  isAdmin: (req, res, next) => {
    req.user.role = "admin";
    next();
  }
}));

// =======================
// MOCK UPLOAD CONTROLLER
// =======================
jest.unstable_mockModule("../src/controllers/uploadController.js", () => ({
  analyzeDocument: (req, res) => {
    res.json({
      originalText: "AAA",
      correctedText: "BBB",
      annotations: [],
      fileUrl: "http://fake.test/file.txt"
    });
  }
}));

// =======================
// IMPORTS REALES
// =======================
const { pool } = await import("../src/db.js");

// MOCK BCRYPT
jest.unstable_mockModule("bcrypt", () => ({
  __esModule: true,
  default: {
    compare: jest.fn().mockResolvedValue(true),
    hash: jest.fn().mockResolvedValue("$2a$10$fakehash") // necesario para register
  }
}));

const app = (await import("../src/app.js")).default;
import request from "supertest";

// ===============================================
//                TESTS
// ===============================================
describe("TEST COMPLETO BACKEND", () => {

  test("POST /api/auth/register", async () => {
    pool.query.mockResolvedValueOnce([[]]);
    pool.query.mockResolvedValueOnce([{ insertId: 99 }]);

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Erick",
        email: "erick@test.com",
        password: "12345678",
        role: "student"
      });

    expect(res.status).toBe(201);
    expect(res.body.user.id).toBe(99);
  });

  test("POST /api/auth/login", async () => {
    pool.query.mockResolvedValueOnce([[{
      id: 1,
      email: "erick@test.com",
      password_hash: "$2a$10$fakehash",
      name: "Erick",
      role: "student"
    }]]);



    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "erick@test.com",
        password: "12345678"  // FIX
      });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("erick@test.com");
  });

  test("POST /api/auth/logout", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test("GET /api/auth/profile", async () => {
    pool.query.mockResolvedValueOnce([[{
      id: 1,
      name: "Erick",
      email: "erick@test.com",
      role: "student"
    }]]);

    const res = await request(app).get("/api/auth/profile");
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("erick@test.com");
  });

  test("POST /api/upload", async () => {
    const res = await request(app)
      .post("/api/upload")
      .attach("file", Buffer.from("AAA"), "test.txt");

    expect(res.status).toBe(200);
    expect(res.body.correctedText).toBe("BBB");
  });

  test("GET /api/history", async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, file_name: "a.txt" }]]);

    const res = await request(app).get("/api/history");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("GET /api/history/:id", async () => {
    pool.query.mockResolvedValueOnce([[{
      original_text: "AAA",
      corrected_text: "BBB",
      annotations: "[]"
    }]]);

    const res = await request(app).get("/api/history/1");

    expect(res.status).toBe(200);
    expect(res.body.originalText).toBe("AAA");
  });

  test("GET /api/admin/history", async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, file_name: "xxx" }]]);

    const res = await request(app).get("/api/admin/history");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("GET /api/admin/history/:id", async () => {
    pool.query.mockResolvedValueOnce([[{
      original_text: "AAA",
      corrected_text: "BBB",
      annotations: "[]"
    }]]);

    const res = await request(app).get("/api/admin/history/55");

    expect(res.status).toBe(200);
    expect(res.body.correctedText).toBe("BBB");
  });

});


test("PUT /api/admin/history/:id", async () => {
  pool.query.mockResolvedValueOnce({ affectedRows: 1 });
  const res = await request(app)
    .put("/api/admin/history/1")
    .send({ file_name: "nuevo.txt" });

  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
  expect(res.body.message).toBe("Registro actualizado");
});

test("DELETE /api/admin/history/:id", async () => {
  pool.query.mockResolvedValueOnce({ affectedRows: 1 });
  const res = await request(app).delete("/api/admin/history/1");

  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
  expect(res.body.message).toBe("Registro eliminado");
});