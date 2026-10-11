const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MONGODB_URI, USE_MEMORY_DB } = require('./env');
const User = require('../models/User');
const Voucher = require('../models/Voucher');

let mongoMemoryServer = null;

// SVG data URLs for sample signatures
const SAMPLE_EMPLOYEE_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70" viewBox="0 0 220 70"><path d="M20,45 Q40,15 70,35 T120,40 Q150,10 180,35 Q195,50 210,30" fill="none" stroke="%232563eb" stroke-width="3" stroke-linecap="round"/><text x="25" y="62" font-family="cursive" font-size="14" fill="%231e3a8a">John Doe (Verified)</text></svg>';
const SAMPLE_DIRECTOR_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70" viewBox="0 0 220 70"><path d="M15,40 Q50,5 90,45 T140,25 Q170,5 190,40" fill="none" stroke="%23059669" stroke-width="3.5" stroke-linecap="round"/><text x="25" y="62" font-family="cursive" font-size="14" fill="%23064e3b">R. Director [Approved]</text></svg>';

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Data already exists
    }

    console.log('Seeding initial demo users and vouchers...');

    // 1. Create demo users
    const employee1 = await User.create({
      name: 'John Doe',
      email: 'john.doe@abccompany.com',
      password: 'Password123!',
      role: 'Employee',
      employeeId: 'EMP-101',
      department: 'Engineering',
      signature: SAMPLE_EMPLOYEE_SIGNATURE
    });

    const employee2 = await User.create({
      name: 'Jane Smith',
      email: 'jane.smith@abccompany.com',
      password: 'Password123!',
      role: 'Employee',
      employeeId: 'EMP-102',
      department: 'Marketing',
      signature: SAMPLE_EMPLOYEE_SIGNATURE
    });

    const director = await User.create({
      name: 'Robert Director',
      email: 'director@abccompany.com',
      password: 'Password123!',
      role: 'Director',
      employeeId: 'DIR-001',
      department: 'Management',
      signature: SAMPLE_DIRECTOR_SIGNATURE
    });

    await User.create({
      name: 'Alice Accountant',
      email: 'accounts@abccompany.com',
      password: 'Password123!',
      role: 'Accounts',
      employeeId: 'ACC-001',
      department: 'Finance'
    });

    // 2. Create sample vouchers
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    await Voucher.create([
      {
        voucherNumber: 'EV-202610-0001',
        voucherDate: fiveDaysAgo,
        expenseDate: fiveDaysAgo,
        department: 'Engineering',
        title: 'AWS Cloud Hosting - Production Cluster',
        category: 'Software & Tools',
        description: 'Monthly cloud infrastructure invoice for production clusters and storage.',
        amount: 3250.00,
        employeeName: employee1.name,
        employeeId: employee1.employeeId,
        employeeSignature: SAMPLE_EMPLOYEE_SIGNATURE,
        status: 'Approved',
        directorSignature: SAMPLE_DIRECTOR_SIGNATURE,
        approvalDate: threeDaysAgo,
        submittedAt: fiveDaysAgo,
        createdBy: employee1._id,
        reviewedBy: director._id
      },
      {
        voucherNumber: 'EV-202610-0002',
        voucherDate: threeDaysAgo,
        expenseDate: threeDaysAgo,
        department: 'Engineering',
        title: 'Mechanical Keyboards & Ergonomic Mice for Dev Team',
        category: 'Office Supplies',
        description: 'New workstation accessories for new joiners in backend team.',
        amount: 480.50,
        employeeName: employee1.name,
        employeeId: employee1.employeeId,
        employeeSignature: SAMPLE_EMPLOYEE_SIGNATURE,
        status: 'Pending Approval',
        submittedAt: threeDaysAgo,
        createdBy: employee1._id
      },
      {
        voucherNumber: 'EV-202610-0003',
        voucherDate: now,
        expenseDate: yesterday,
        department: 'Engineering',
        title: 'Developer Team Dinner & Retrospective',
        category: 'Food & Meals',
        description: 'Sprint 42 retrospective dinner at Bistro Bella.',
        amount: 215.00,
        employeeName: employee1.name,
        employeeId: employee1.employeeId,
        employeeSignature: null,
        status: 'Draft',
        createdBy: employee1._id
      },
      {
        voucherNumber: 'EV-202610-0004',
        voucherDate: threeDaysAgo,
        expenseDate: threeDaysAgo,
        department: 'Marketing',
        title: 'Q4 Product Launch Social Media Campaign',
        category: 'Marketing & Ads',
        description: 'LinkedIn and Meta ad campaign spend for product launch.',
        amount: 1500.00,
        employeeName: employee2.name,
        employeeId: employee2.employeeId,
        employeeSignature: SAMPLE_EMPLOYEE_SIGNATURE,
        status: 'Approved',
        directorSignature: SAMPLE_DIRECTOR_SIGNATURE,
        approvalDate: yesterday,
        submittedAt: threeDaysAgo,
        createdBy: employee2._id,
        reviewedBy: director._id
      },
      {
        voucherNumber: 'EV-202610-0005',
        voucherDate: yesterday,
        expenseDate: yesterday,
        department: 'Marketing',
        title: 'Annual Design System Figma License',
        category: 'Software & Tools',
        description: 'Figma Organization plan renewal.',
        amount: 900.00,
        employeeName: employee2.name,
        employeeId: employee2.employeeId,
        employeeSignature: SAMPLE_EMPLOYEE_SIGNATURE,
        status: 'Rejected',
        rejectionReason: 'Please attach the official tax invoice from Figma billing portal with company GST number.',
        approvalDate: now,
        submittedAt: yesterday,
        createdBy: employee2._id,
        reviewedBy: director._id
      },
      {
        voucherNumber: 'EV-202610-0006',
        voucherDate: now,
        expenseDate: now,
        department: 'Marketing',
        title: 'Client Hospitality Lunch with Enterprise Leads',
        category: 'Client Entertainment',
        description: 'Business lunch with lead stakeholders from Apex Group.',
        amount: 340.00,
        employeeName: employee2.name,
        employeeId: employee2.employeeId,
        employeeSignature: SAMPLE_EMPLOYEE_SIGNATURE,
        status: 'Pending Approval',
        submittedAt: now,
        createdBy: employee2._id
      }
    ]);

    console.log('Database seeded successfully with demo users and realistic vouchers.');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};

const connectDB = async () => {
  // If memory DB requested or default fallback
  if (USE_MEMORY_DB) {
    try {
      console.log('Starting In-Memory MongoDB Server...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Connected to In-Memory MongoDB: ${memoryUri}`);
      await seedInitialData();
      return;
    } catch (err) {
      console.warn('Could not start MongoMemoryServer, attempting standard URI connection:', err.message);
    }
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedInitialData();
  } catch (error) {
    console.warn(`Standard MongoDB connection to ${MONGODB_URI} failed: ${error.message}`);
    console.log('Attempting MongoMemoryServer fallback...');
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Connected to Fallback In-Memory MongoDB: ${memoryUri}`);
      await seedInitialData();
    } catch (memErr) {
      console.error('CRITICAL: Failed to connect to both MongoDB and In-Memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB, seedInitialData };
