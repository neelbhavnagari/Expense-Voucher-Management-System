/**
 * MongoDB Database Initialization & Index Migration Script
 * Expense Voucher Management System (EVM)
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Voucher = require('../models/Voucher');

async function migrate() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/evm_system';
  console.log('Starting MongoDB schema index migration...');

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB database.');

    // Ensure User indexes
    await User.init();
    await User.syncIndexes();
    console.log('User indexes synced successfully.');

    // Ensure Voucher indexes
    await Voucher.init();
    await Voucher.syncIndexes();
    console.log('Voucher indexes synced successfully.');

    console.log('MongoDB schema and index migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

module.exports = migrate;
