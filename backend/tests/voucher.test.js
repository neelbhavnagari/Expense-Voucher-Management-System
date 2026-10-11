const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Voucher = require('../src/models/Voucher');

let mongoServer;
let employeeToken;
let employeeUser;

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
  await Voucher.deleteMany({});

  const regRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Dave Dev',
      email: 'dave@abccompany.com',
      password: 'Password123!',
      role: 'Employee',
      department: 'Engineering'
    });

  employeeToken = regRes.body.data.token;
  employeeUser = regRes.body.data.user;
});

describe('Voucher CRUD & Rules API', () => {
  test('Employee can create a voucher as Draft', async () => {
    const res = await request(app)
      .post('/api/vouchers')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        title: 'Team Coffee & Donuts',
        department: 'Engineering',
        category: 'Food & Meals',
        expenseDate: '2026-10-10',
        amount: 45.0,
        status: 'Draft'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Draft');
    expect(res.body.data.voucherNumber).toMatch(/^EV-\d{6}-\d{4}$/);
  });

  test('Employee cannot create a voucher with zero or negative amount', async () => {
    const res = await request(app)
      .post('/api/vouchers')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        title: 'Team Coffee',
        department: 'Engineering',
        category: 'Food & Meals',
        expenseDate: '2026-10-10',
        amount: -10
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('Employee can edit a draft voucher', async () => {
    const createRes = await request(app)
      .post('/api/vouchers')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        title: 'Team Coffee',
        department: 'Engineering',
        category: 'Food & Meals',
        expenseDate: '2026-10-10',
        amount: 45.0
      });

    const voucherId = createRes.body.data._id;

    const updateRes = await request(app)
      .put(`/api/vouchers/${voucherId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        title: 'Team Coffee & Lunch',
        amount: 85.0
      });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.title).toBe('Team Coffee & Lunch');
    expect(updateRes.body.data.amount).toBe(85.0);
  });

  test('Employee cannot submit voucher without signature', async () => {
    const createRes = await request(app)
      .post('/api/vouchers')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        title: 'Team Coffee',
        department: 'Engineering',
        category: 'Food & Meals',
        expenseDate: '2026-10-10',
        amount: 45.0
      });

    const voucherId = createRes.body.data._id;

    const submitRes = await request(app)
      .post(`/api/vouchers/${voucherId}/submit`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({});

    expect(submitRes.statusCode).toBe(400);
    expect(submitRes.body.message).toMatch(/signature/i);
  });
});
