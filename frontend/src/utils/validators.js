export const validateVoucherForm = (form, isSubmitting = false) => {
  const errors = {};

  if (!form.department || !form.department.trim()) {
    errors.department = 'Department is mandatory.';
  }

  if (!form.title || !form.title.trim()) {
    errors.title = 'Expense Title is mandatory.';
  }

  if (!form.expenseDate) {
    errors.expenseDate = 'Expense Date is mandatory.';
  }

  if (form.amount === undefined || form.amount === '' || form.amount === null) {
    errors.amount = 'Amount is mandatory.';
  } else if (Number(form.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  }

  if (isSubmitting && !form.employeeSignature) {
    errors.employeeSignature = 'Employee Signature is mandatory before submission.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
