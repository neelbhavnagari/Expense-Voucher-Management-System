const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('./models/User');
const Voucher = require('./models/Voucher');

const uri = process.env.MONGODB_URI;

console.log('Testing connection to MongoDB Atlas cluster...');
console.log('URI:', uri.replace(/:([^@]+)@/, ':****@'));

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 6000 })
  .then(async () => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas Cluster!');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map((c) => c.name));

    const userCount = await User.countDocuments();
    const voucherCount = await Voucher.countDocuments();
    console.log(`Current data: ${userCount} users, ${voucherCount} vouchers.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Connection Error:');
    if (err.message.includes('whitelist') || err.message.includes('Could not connect to any servers')) {
      console.error('👉 IP NOT WHITELISTED in MongoDB Atlas!');
      console.error('Please follow these 2 steps in your browser:');
      console.error('1. Go to cloud.mongodb.com -> Network Access (on the left menu)');
      console.error('2. Click "+ Add IP Address" -> choose "Allow Access from Anywhere" (0.0.0.0/0) -> click Confirm.');
      console.error('3. Wait 30 seconds and run this script again: node src/check-atlas.js\n');
    } else if (err.message.includes('bad auth')) {
      console.error('👉 AUTHENTICATION FAILED: Check username and password in Atlas Security -> Database Access.');
    } else {
      console.error(err.message);
    }
    process.exit(1);
  });
