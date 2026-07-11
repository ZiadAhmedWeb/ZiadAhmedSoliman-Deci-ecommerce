const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

describe('Products API', () => {
  test('lists products publicly without auth', async () => {
    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body.products).toBeDefined();
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('blocks product creation without a token', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Unauthorized Product', price: 10, stock: 5 });

    expect(res.statusCode).toBe(401);
  });

  test('blocks product creation for non-admin users', async () => {
    const testEmail = `customer_${Date.now()}@test.com`;
    await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail, password: 'password123' });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'password123' });

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${loginRes.body.token}`)
      .send({ name: 'Should Fail', price: 10, stock: 5 });

    expect(res.statusCode).toBe(403);
  });
});