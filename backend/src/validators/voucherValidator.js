const validateCreateVoucher = (data) => {
  if (!data.department || typeof data.department !== 'string' || !data.department.trim()) {
    return { error: 'Department is mandatory.' };
  }
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    return { error: 'Expense Title is mandatory.' };
  }
  if (!data.expenseDate) {
    return { error: 'Expense Date is mandatory.' };
  }
  const parsedDate = new Date(data.expenseDate);
  if (isNaN(parsedDate.getTime())) {
    return { error: 'Invalid Expense Date.' };
  }
  if (data.amount === undefined || data.amount === null || data.amount === '') {
    return { error: 'Amount is mandatory.' };
  }
  const numAmount = Number(data.amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return { error: 'Amount must be a number greater than zero.' };
  }

  // If status is submitted directly as Pending Approval, employee signature is mandatory
  if (data.status === 'Pending Approval' && !data.employeeSignature) {
    return { error: 'Employee signature is mandatory before submission.' };
  }

  return { error: null };
};

const validateSubmitVoucher = (data, voucher) => {
  const signature = data.employeeSignature || (voucher && voucher.employeeSignature);
  if (!signature) {
    return { error: 'Employee Signature is mandatory before submission.' };
  }
  return { error: null };
};

const validateApproval = (data) => {
  if (!data.directorSignature || typeof data.directorSignature !== 'string' || !data.directorSignature.trim()) {
    return { error: 'Director Signature is mandatory before approval.' };
  }
  return { error: null };
};

const validateRejection = (data) => {
  if (!data.rejectionReason || typeof data.rejectionReason !== 'string' || !data.rejectionReason.trim()) {
    return { error: 'Rejection Reason is mandatory if a voucher is rejected.' };
  }
  return { error: null };
};

module.exports = {
  validateCreateVoucher,
  validateSubmitVoucher,
  validateApproval,
  validateRejection
};
