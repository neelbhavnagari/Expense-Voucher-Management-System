const Voucher = require('../models/Voucher');
const generateVoucherNumber = require('../utils/generateVoucherNumber');
const ApiError = require('../utils/ApiError');

/**
 * Create a new voucher
 */
const createVoucher = async (data, user) => {
  const voucherNumber = await generateVoucherNumber();

  const isSubmitting = data.status === 'Pending Approval';

  if (isSubmitting && !data.employeeSignature && !user.signature) {
    throw new ApiError(400, 'Employee Signature is mandatory before submission.');
  }

  const voucherData = {
    voucherNumber,
    voucherDate: data.voucherDate || new Date(),
    expenseDate: data.expenseDate,
    department: data.department || user.department || 'General',
    title: data.title,
    category: data.category || 'General',
    description: data.description || '',
    amount: Number(data.amount),
    employeeName: user.name || data.employeeName,
    employeeId: user.employeeId || data.employeeId || '',
    employeeSignature: data.employeeSignature || user.signature || null,
    status: isSubmitting ? 'Pending Approval' : 'Draft',
    submittedAt: isSubmitting ? new Date() : null,
    createdBy: user._id
  };

  const voucher = await Voucher.create(voucherData);
  return voucher;
};

/**
 * Get vouchers with search, filters, sorting and role-based scoping
 */
const getVouchers = async (query, user) => {
  const filter = {};

  // Role scoping: Employees can ONLY view vouchers created by themselves
  if (user.role === 'Employee') {
    filter.createdBy = user._id;
  }

  // Filter by Status
  if (query.status && query.status !== 'All') {
    filter.status = query.status;
  }

  // Filter by Department
  if (query.department && query.department !== 'All') {
    filter.department = new RegExp(`^${query.department}$`, 'i');
  }

  // Filter by Category
  if (query.category && query.category !== 'All') {
    filter.category = new RegExp(`^${query.category}$`, 'i');
  }

  // Search by Voucher Number
  if (query.voucherNumber) {
    filter.voucherNumber = new RegExp(query.voucherNumber.trim(), 'i');
  }

  // Search by Employee Name
  if (query.employeeName) {
    filter.employeeName = new RegExp(query.employeeName.trim(), 'i');
  }

  // General Search across Title, Voucher Number, Employee Name, Department
  if (query.search && query.search.trim()) {
    const s = query.search.trim();
    filter.$or = [
      { voucherNumber: new RegExp(s, 'i') },
      { title: new RegExp(s, 'i') },
      { employeeName: new RegExp(s, 'i') },
      { department: new RegExp(s, 'i') },
      { category: new RegExp(s, 'i') }
    ];
  }

  // Filter by Date Range (on expenseDate or voucherDate)
  if (query.startDate || query.endDate) {
    filter.expenseDate = {};
    if (query.startDate) {
      filter.expenseDate.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      // Set to end of the day
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.expenseDate.$lte = end;
    }
  }

  // Filter by Amount Range
  if (query.minAmount !== undefined && query.minAmount !== '' || query.maxAmount !== undefined && query.maxAmount !== '') {
    filter.amount = {};
    if (query.minAmount !== undefined && query.minAmount !== '') {
      filter.amount.$gte = Number(query.minAmount);
    }
    if (query.maxAmount !== undefined && query.maxAmount !== '') {
      filter.amount.$lte = Number(query.maxAmount);
    }
  }

  // Sorting
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  // Pagination
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [vouchers, total] = await Promise.all([
    Voucher.find(filter)
      .populate('createdBy', 'name email employeeId department')
      .populate('reviewedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Voucher.countDocuments(filter)
  ]);

  return {
    vouchers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
};

/**
 * Get single voucher details by ID
 */
const getVoucherById = async (id, user) => {
  const voucher = await Voucher.findById(id)
    .populate('createdBy', 'name email employeeId department')
    .populate('reviewedBy', 'name email');

  if (!voucher) {
    throw new ApiError(404, 'Voucher not found.');
  }

  // Authorization check: Employee can only see their own
  if (user.role === 'Employee' && voucher.createdBy._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Access denied. You can only view your own vouchers.');
  }

  return voucher;
};

/**
 * Update voucher (only while Draft)
 */
const updateDraftVoucher = async (id, data, user) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, 'Voucher not found.');
  }

  if (voucher.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to edit this voucher.');
  }

  if (voucher.status !== 'Draft') {
    throw new ApiError(400, `Cannot edit voucher with status '${voucher.status}'. Only Draft vouchers can be edited.`);
  }

  if (data.department) voucher.department = data.department;
  if (data.title) voucher.title = data.title;
  if (data.category) voucher.category = data.category;
  if (data.description !== undefined) voucher.description = data.description;
  if (data.expenseDate) voucher.expenseDate = data.expenseDate;
  if (data.amount) voucher.amount = Number(data.amount);
  if (data.employeeSignature) voucher.employeeSignature = data.employeeSignature;
  if (data.employeeId !== undefined) voucher.employeeId = data.employeeId;

  // If user requests to submit during edit
  if (data.status === 'Pending Approval') {
    if (!voucher.employeeSignature && !data.employeeSignature) {
      throw new ApiError(400, 'Employee Signature is mandatory before submission.');
    }
    voucher.status = 'Pending Approval';
    voucher.submittedAt = new Date();
  }

  await voucher.save();
  return voucher;
};

/**
 * Delete draft voucher
 */
const deleteDraftVoucher = async (id, user) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, 'Voucher not found.');
  }

  if (voucher.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this voucher.');
  }

  if (voucher.status !== 'Draft') {
    throw new ApiError(400, `Cannot delete voucher with status '${voucher.status}'. Only Draft vouchers can be deleted.`);
  }

  await Voucher.findByIdAndDelete(id);
  return { message: 'Voucher deleted successfully.' };
};

/**
 * Submit draft voucher for approval
 */
const submitVoucher = async (id, signature, user) => {
  const voucher = await Voucher.findById(id);

  if (!voucher) {
    throw new ApiError(404, 'Voucher not found.');
  }

  if (voucher.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to submit this voucher.');
  }

  if (voucher.status !== 'Draft') {
    throw new ApiError(400, `Voucher is already in '${voucher.status}' status and cannot be submitted again.`);
  }

  const effectiveSig = signature || voucher.employeeSignature;
  if (!effectiveSig) {
    throw new ApiError(400, 'Employee Signature is mandatory before submission.');
  }

  voucher.employeeSignature = effectiveSig;
  voucher.status = 'Pending Approval';
  voucher.submittedAt = new Date();

  await voucher.save();
  return voucher;
};

module.exports = {
  createVoucher,
  getVouchers,
  getVoucherById,
  updateDraftVoucher,
  deleteDraftVoucher,
  submitVoucher
};
