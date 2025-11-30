import request from 'supertest';
import app from '../app.js';

describe('POST /api/auth', () => {
  it('debería registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Usuario registrado correctamente');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  it('debería iniciar sesión', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Inicio de sesión exitoso');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });
});
