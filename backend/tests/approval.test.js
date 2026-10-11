const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Voucher = require('../src/models/Voucher');

let mongoServer;
let employeeToken;
let directorToken;
let voucherId;

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

  const empRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Dave Dev',
      email: 'dave@abccompany.com',
      password: 'Password123!',
      role: 'Employee'
    });
  employeeToken = empRes.body.data.token;

  const dirRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Dir Boss',
      email: 'boss@abccompany.com',
      password: 'Password123!',
      role: 'Director'
    });
  directorToken = dirRes.body.data.token;

  // Create submitted voucher
  const voucherRes = await request(app)
    .post('/api/vouchers')
    .set('Authorization', `Bearer ${employeeToken}`)
    .send({
      title: 'Server Hosting',
      department: 'Engineering',
      category: 'Software & Tools',
      expenseDate: '2026-10-10',
      amount: 150.0,
      employeeSignature: 'data:image/svg+xml;base64,sampleSig',
      status: 'Pending Approval'
    });
  voucherId = voucherRes.body.data._id;
});

describe('Director Approval & Rejection Workflow', () => {
  test('Director cannot approve without signature', async () => {
    const res = await request(app)
      .post(`/api/approvals/${voucherId}/approve`)
      .set('Authorization', `Bearer ${directorToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/signature/i);
  });

  test('Director can approve with valid signature', async () => {
    const res = await request(app)
      .post(`/api/approvals/${voucherId}/approve`)
      .set('Authorization', `Bearer ${directorToken}`)
      .send({
        directorSignature: 'data:image/svg+xml;base64,dirSig'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('Approved');
    expect(res.body.data.directorSignature).toBeDefined();
    expect(res.body.data.approvalDate).toBeDefined();
  });

  test('Director cannot reject without rejection reason', async () => {
    const res = await request(app)
      .post(`/api/approvals/${voucherId}/reject`)
      .set('Authorization', `Bearer ${directorToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/reason/i);
  });

  test('Director can reject with valid rejection reason', async () => {
    const res = await request(app)
      .post(`/api/approvals/${voucherId}/reject`)
      .set('Authorization', `Bearer ${directorToken}`)
      .send({
        rejectionReason: 'Invalid invoice receipt submitted.'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('Rejected');
    expect(res.body.data.rejectionReason).toBe('Invalid invoice receipt submitted.');
  });

  test('Employee cannot approve a voucher (Role restriction)', async () => {
    const res = await request(app)
      .post(`/api/approvals/${voucherId}/approve`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        directorSignature: 'fake'
      });

    expect(res.statusCode).toBe(403);
  });
});
