const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  validateApproval,
  validateRejection
} = require('../validators/voucherValidator');

// Protect and restrict all approval routes strictly to Director
router.use(protect);
router.use(authorize('Director'));

// Get pending approval requests
router.get('/pending', approvalController.getPendingApprovals);

// Approve voucher
router.post(
  '/:id/approve',
  validate(validateApproval),
  approvalController.approveVoucher
);

// Reject voucher
router.post(
  '/:id/reject',
  validate(validateRejection),
  approvalController.rejectVoucher
);

module.exports = router;
