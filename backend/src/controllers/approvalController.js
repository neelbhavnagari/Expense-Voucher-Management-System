const approvalService = require('../services/approvalService');
const voucherService = require('../services/voucherService');
const asyncHandler = require('../utils/asyncHandler');

const approveVoucher = asyncHandler(async (req, res) => {
  const { directorSignature } = req.body;
  const voucher = await approvalService.approveVoucher(req.params.id, directorSignature, req.user);

  res.status(200).json({
    success: true,
    message: 'Voucher approved successfully.',
    data: voucher
  });
});

const rejectVoucher = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;
  const voucher = await approvalService.rejectVoucher(req.params.id, rejectionReason, req.user);

  res.status(200).json({
    success: true,
    message: 'Voucher rejected.',
    data: voucher
  });
});

const getPendingApprovals = asyncHandler(async (req, res) => {
  const query = { ...req.query, status: 'Pending Approval' };
  const result = await voucherService.getVouchers(query, req.user);

  res.status(200).json({
    success: true,
    data: result.vouchers,
    pagination: result.pagination
  });
});

module.exports = {
  approveVoucher,
  rejectVoucher,
  getPendingApprovals
};
