const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  const testEmail = `testuser_${Date.now()}@test.com`;

  test('rejects registration with a short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: '123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/6 characters/);
  });

  test('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe(testEmail);
    expect(res.body.role).toBe('customer');
  });

  test('rejects duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: 'password123' });

    expect(res.statusCode).toBe(409);
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
  });
});