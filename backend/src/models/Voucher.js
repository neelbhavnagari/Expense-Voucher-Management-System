const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    voucherNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    voucherDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    expenseDate: {
      type: Date,
      required: [true, 'Expense date is mandatory']
    },
    department: {
      type: String,
      required: [true, 'Department is mandatory'],
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Expense title is mandatory'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Expense category is mandatory'],
      trim: true,
      default: 'General'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    amount: {
      type: Number,
      required: [true, 'Amount is mandatory'],
      min: [0.01, 'Amount must be greater than zero']
    },
    employeeName: {
      type: String,
      required: true,
      trim: true
    },
    employeeId: {
      type: String,
      trim: true,
      default: ''
    },
    employeeSignature: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected'],
      default: 'Draft',
      index: true
    },
    directorSignature: {
      type: String,
      default: null
    },
    approvalDate: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: null,
      trim: true
    },
    submittedAt: {
      type: Date,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Voucher', voucherSchema);
