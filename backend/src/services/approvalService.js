const Voucher = require('../models/Voucher');
const ApiError = require('../utils/ApiError');

/**
 * Approve a pending voucher (Director role only)
 */
const approveVoucher = async (id, directorSignature, director) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, 'Voucher not found.');
  }

  if (voucher.status !== 'Pending Approval') {
    throw new ApiError(
      400,
      `Cannot approve voucher with status '${voucher.status}'. Only vouchers in 'Pending Approval' status can be approved.`
    );
  }

  const effectiveSig = directorSignature || director.signature;
  if (!effectiveSig) {
    throw new ApiError(400, 'Director Signature is mandatory before approval.');
  }

  voucher.status = 'Approved';
  voucher.directorSignature = effectiveSig;
  voucher.approvalDate = new Date();
  voucher.reviewedBy = director._id;
  voucher.rejectionReason = null; // Clear any previous rejection reason

  await voucher.save();
  return voucher;
};

/**
 * Reject a pending voucher (Director role only)
 */
const rejectVoucher = async (id, rejectionReason, director) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, 'Voucher not found.');
  }

  if (voucher.status !== 'Pending Approval') {
    throw new ApiError(
      400,
      `Cannot reject voucher with status '${voucher.status}'. Only vouchers in 'Pending Approval' status can be rejected.`
    );
  }

  if (!rejectionReason || !rejectionReason.trim()) {
    throw new ApiError(400, 'Rejection Reason is mandatory if a voucher is rejected.');
  }

  voucher.status = 'Rejected';
  voucher.rejectionReason = rejectionReason.trim();
  voucher.approvalDate = new Date();
  voucher.reviewedBy = director._id;

  await voucher.save();
  return voucher;
};

module.exports = {
  approveVoucher,
  rejectVoucher
};
