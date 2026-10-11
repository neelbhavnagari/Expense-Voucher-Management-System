const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');

let mongoServer;

jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API', () => {
  test('POST /api/auth/register should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sarah Connor',
        email: 'sarah@abccompany.com',
        password: 'Password123!',
        role: 'Employee',
        department: 'Engineering'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('sarah@abccompany.com');
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login should authenticate user with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sarah Connor',
        email: 'sarah@abccompany.com',
        password: 'Password123!',
        role: 'Employee'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sarah@abccompany.com',
        password: 'Password123!'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login should fail with invalid password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sarah Connor',
        email: 'sarah@abccompany.com',
        password: 'Password123!',
        role: 'Employee'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sarah@abccompany.com',
        password: 'WrongPassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
