const mongoose = require('mongoose');
const Voucher = require('../models/Voucher');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const user = req.user;
  const role = user.role;

  if (role === 'Employee') {
    // Scoped strictly to employee
    const userObjectId = new mongoose.Types.ObjectId(user._id.toString());
    const userFilter = { createdBy: user._id };
    const aggUserFilter = { createdBy: userObjectId };

    const [total, draft, pending, approved, rejected, recent] = await Promise.all([
      Voucher.countDocuments(userFilter),
      Voucher.countDocuments({ ...userFilter, status: 'Draft' }),
      Voucher.countDocuments({ ...userFilter, status: 'Pending Approval' }),
      Voucher.countDocuments({ ...userFilter, status: 'Approved' }),
      Voucher.countDocuments({ ...userFilter, status: 'Rejected' }),
      Voucher.find(userFilter).sort({ createdAt: -1 }).limit(5).lean()
    ]);

    // Sum claimed amounts
    const amountAgg = await Voucher.aggregate([
      { $match: aggUserFilter },
      { $group: { _id: null, totalClaimed: { $sum: '$amount' } } }
    ]);
    const totalClaimed = amountAgg.length > 0 ? amountAgg[0].totalClaimed : 0;

    // Status breakdown amounts
    const statusAmounts = await Voucher.aggregate([
      { $match: aggUserFilter },
      { $group: { _id: '$status', total: { $sum: '$amount' } } }
    ]);
    let approvedAmount = 0;
    let pendingAmount = 0;
    statusAmounts.forEach((item) => {
      if (item._id === 'Approved') approvedAmount = item.total;
      if (item._id === 'Pending Approval') pendingAmount = item.total;
    });

    // Top Expense Categories breakdown
    const categoryBreakdown = await Voucher.aggregate([
      { $match: aggUserFilter },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 4 }
    ]);

    // Vouchers that need employee attention (Drafts & Rejected)
    const actionRequired = await Voucher.find({
      ...userFilter,
      status: { $in: ['Draft', 'Rejected'] }
    })
      .sort({ updatedAt: -1 })
      .limit(4)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        role: 'Employee',
        totalVouchers: total,
        draftVouchers: draft,
        pendingApproval: pending,
        approvedVouchers: approved,
        rejectedVouchers: rejected,
        totalAmountClaimed: totalClaimed,
        approvedAmount,
        pendingAmount,
        categoryBreakdown,
        actionRequired,
        recentVouchers: recent
      }
    });
  }

  if (role === 'Director') {
    // Start of today (midnight)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      pendingCount,
      approvedToday,
      rejectedToday,
      totalVouchers,
      recentActivity,
      pendingAmountAgg
    ] = await Promise.all([
      Voucher.countDocuments({ status: 'Pending Approval' }),
      Voucher.countDocuments({
        status: 'Approved',
        approvalDate: { $gte: startOfToday }
      }),
      Voucher.countDocuments({
        status: 'Rejected',
        approvalDate: { $gte: startOfToday }
      }),
      Voucher.countDocuments({}),
      Voucher.find({})
        .populate('createdBy', 'name email employeeId department')
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),
      Voucher.aggregate([
        { $match: { status: 'Pending Approval' } },
        { $group: { _id: null, totalPending: { $sum: '$amount' } } }
      ])
    ]);

    const totalPendingAmount = pendingAmountAgg.length > 0 ? pendingAmountAgg[0].totalPending : 0;

    return res.status(200).json({
      success: true,
      data: {
        role: 'Director',
        pendingApprovalCount: pendingCount,
        approvedToday,
        rejectedToday,
        totalPendingAmount,
        totalVouchers,
        recentActivity
      }
    });
  }

  if (role === 'Accounts') {
    const [
      totalVouchers,
      pendingCount,
      approvedCount,
      rejectedCount,
      approvedAmountAgg,
      recentApproved
    ] = await Promise.all([
      Voucher.countDocuments({}),
      Voucher.countDocuments({ status: 'Pending Approval' }),
      Voucher.countDocuments({ status: 'Approved' }),
      Voucher.countDocuments({ status: 'Rejected' }),
      Voucher.aggregate([
        { $match: { status: 'Approved' } },
        { $group: { _id: null, totalApproved: { $sum: '$amount' } } }
      ]),
      Voucher.find({ status: 'Approved' })
        .populate('createdBy', 'name email employeeId department')
        .sort({ approvalDate: -1, updatedAt: -1 })
        .limit(6)
        .lean()
    ]);

    const totalApprovedExpenseAmount =
      approvedAmountAgg.length > 0 ? approvedAmountAgg[0].totalApproved : 0;

    return res.status(200).json({
      success: true,
      data: {
        role: 'Accounts',
        totalVouchers,
        pendingApproval: pendingCount,
        approvedVouchers: approvedCount,
        rejectedVouchers: rejectedCount,
        totalApprovedExpenseAmount,
        recentApprovedVouchers: recentApproved
      }
    });
  }
});

module.exports = {
  getDashboardStats
};
