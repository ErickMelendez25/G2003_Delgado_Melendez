import request from 'supertest';
import app from '../app.js';

describe('GET /api/health', () => {
  it('debería devolver status 200 y ok true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
