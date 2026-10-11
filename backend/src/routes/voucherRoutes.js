const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  validateCreateVoucher,
  validateSubmitVoucher
} = require('../validators/voucherValidator');

// Protect all voucher routes
router.use(protect);

// Upload signature image (Employees and Directors can upload signatures)
router.post(
  '/upload-signature',
  upload.single('signature'),
  voucherController.uploadSignature
);

// Get all vouchers (scoped by role inside service)
router.get('/', voucherController.getVouchers);

// Create new voucher (Employees only)
router.post(
  '/',
  authorize('Employee'),
  validate(validateCreateVoucher),
  voucherController.createVoucher
);

// Get voucher by ID (Employee sees their own, Director/Accounts see all)
router.get('/:id', voucherController.getVoucherById);

// Update draft voucher (Employees only)
router.put(
  '/:id',
  authorize('Employee'),
  voucherController.updateDraftVoucher
);

// Delete draft voucher (Employees only)
router.delete(
  '/:id',
  authorize('Employee'),
  voucherController.deleteDraftVoucher
);

// Submit draft voucher for approval (Employees only)
router.post(
  '/:id/submit',
  authorize('Employee'),
  voucherController.submitVoucher
);

module.exports = router;
