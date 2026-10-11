const Voucher = require('../models/Voucher');

/**
 * Generate a unique sequential Voucher Number.
 * Format: EV-YYYYMM-XXXX (e.g., EV-202610-0001)
 */
const generateVoucherNumber = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `EV-${year}${month}-`;

  try {
    // Find highest voucher number with current month prefix
    const latestVoucher = await Voucher.findOne({
      voucherNumber: new RegExp(`^${prefix}`)
    })
      .sort({ voucherNumber: -1 })
      .select('voucherNumber')
      .lean();

    let sequence = 1;
    if (latestVoucher && latestVoucher.voucherNumber) {
      const parts = latestVoucher.voucherNumber.split('-');
      if (parts.length === 3) {
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1;
        }
      }
    }

    const candidate = `${prefix}${String(sequence).padStart(4, '0')}`;
    // Verify uniqueness just in case
    const exists = await Voucher.findOne({ voucherNumber: candidate }).lean();
    if (exists) {
      // Add random fallback suffix
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}${randomSuffix}`;
    }

    return candidate;
  } catch {
    // Fallback if db query fails
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomSuffix}`;
  }
};

module.exports = generateVoucherNumber;
