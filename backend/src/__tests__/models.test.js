import request from 'supertest';
import app from '../app.js';

describe('GET /api/models', () => {
  it('debería devolver la lista de modelos desde Gemini API', async () => {
    const res = await request(app).get('/api/models');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('models'); // response debe tener "models"
    expect(Array.isArray(res.body.models)).toBe(true);
  }, 20000); // timeout extendido
});
