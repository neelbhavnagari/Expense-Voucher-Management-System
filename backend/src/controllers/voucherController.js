const voucherService = require('../services/voucherService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const createVoucher = asyncHandler(async (req, res) => {
  const voucher = await voucherService.createVoucher(req.body, req.user);

  res.status(201).json({
    success: true,
    message: voucher.status === 'Draft' ? 'Voucher saved as draft successfully.' : 'Voucher submitted for approval successfully.',
    data: voucher
  });
});

const getVouchers = asyncHandler(async (req, res) => {
  const result = await voucherService.getVouchers(req.query, req.user);

  res.status(200).json({
    success: true,
    data: result.vouchers,
    pagination: result.pagination
  });
});

const getVoucherById = asyncHandler(async (req, res) => {
  const voucher = await voucherService.getVoucherById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    data: voucher
  });
});

const updateDraftVoucher = asyncHandler(async (req, res) => {
  const voucher = await voucherService.updateDraftVoucher(req.params.id, req.body, req.user);

  res.status(200).json({
    success: true,
    message: voucher.status === 'Draft' ? 'Draft voucher updated successfully.' : 'Voucher submitted for approval successfully.',
    data: voucher
  });
});

const deleteDraftVoucher = asyncHandler(async (req, res) => {
  const result = await voucherService.deleteDraftVoucher(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: result.message
  });
});

const submitVoucher = asyncHandler(async (req, res) => {
  const { employeeSignature } = req.body;
  const voucher = await voucherService.submitVoucher(req.params.id, employeeSignature, req.user);

  res.status(200).json({
    success: true,
    message: 'Voucher submitted for approval successfully.',
    data: voucher
  });
});

const uploadSignature = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload an image file.');
  }

  // Construct accessible URL path
  const fileUrl = `/uploads/signatures/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Signature uploaded successfully.',
    data: {
      url: fileUrl,
      filename: req.file.filename
    }
  });
});

module.exports = {
  createVoucher,
  getVouchers,
  getVoucherById,
  updateDraftVoucher,
  deleteDraftVoucher,
  submitVoucher,
  uploadSignature
};
