const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('./models/User');
const Voucher = require('./models/Voucher');

const SAMPLE_EMPLOYEE_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70" viewBox="0 0 220 70"><path d="M20,45 Q40,15 70,35 T120,40 Q150,10 180,35 Q195,50 210,30" fill="none" stroke="%232563eb" stroke-width="3" stroke-linecap="round"/><text x="25" y="62" font-family="cursive" font-size="14" fill="%231e3a8a">John Doe (Verified)</text></svg>';
const SAMPLE_DIRECTOR_SIGNATURE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70" viewBox="0 0 220 70"><path d="M15,40 Q50,5 90,45 T140,25 Q170,5 190,40" fill="none" stroke="%23059669" stroke-width="3.5" stroke-linecap="round"/><text x="25" y="62" font-family="cursive" font-size="14" fill="%23064e3b">R. Director [Approved]</text></svg>';

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/evm_system';
  console.log('Connecting to MongoDB at:', uri.replace(/:([^@]+)@/, ':****@'));

  try {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected to MongoDB successfully.');
    } catch (connErr) {
      console.warn(`Direct connection failed: ${connErr.message}`);
      console.log('Falling back to MongoMemoryServer for seed demo verification...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const memServer = await MongoMemoryServer.create();
      await mongoose.connect(memServer.getUri());
      console.log('Connected to In-Memory MongoDB successfully.');
    }

    // Reset collections if requested
    const shouldReset = process.argv.includes('--reset');
    if (shouldReset) {
      console.log('Resetting existing database collections...');
      await User.deleteMany({});
      await Voucher.deleteMany({});
    }

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0 && !shouldReset) {
      console.log(`Database already has ${existingUsers} users. Skipping seeding (use --reset to overwrite).`);
      process.exit(0);
    }

    console.log('Seeding demo users...');
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

    const accounts = await User.create({
      name: 'Alice Accountant',
      email: 'accounts@abccompany.com',
      password: 'Password123!',
      role: 'Accounts',
      employeeId: 'ACC-001',
      department: 'Finance'
    });

    console.log('Seeding sample expense vouchers...');
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

    console.log('✅ Seeding complete!');
    console.log('\n--- Pre-seeded Demo User Credentials ---');
    console.log('1. Employee 1:  john.doe@abccompany.com    | Password123! (Engineering)');
    console.log('2. Employee 2:  jane.smith@abccompany.com  | Password123! (Marketing)');
    console.log('3. Director:    director@abccompany.com    | Password123! (Executive Approver)');
    console.log('4. Accounts:    accounts@abccompany.com    | Password123! (Finance Team)\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
