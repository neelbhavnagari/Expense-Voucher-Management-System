export const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Finance',
  'Human Resources',
  'Operations',
  'Product Design',
  'Executive Management'
];

export const EXPENSE_CATEGORIES = [
  'Software & Tools',
  'Office Supplies',
  'Travel & Conveyance',
  'Food & Meals',
  'Client Entertainment',
  'Training & Education',
  'Logistics & Courier',
  'Hardware & Equipment',
  'Other Expenses'
];

export const VOUCHER_STATUS = {
  DRAFT: 'Draft',
  PENDING: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

export const STATUS_COLORS = {
  'Draft': {
    bg: '#f3f4f6',
    text: '#4b5563',
    border: '#d1d5db',
    badge: 'badge-draft'
  },
  'Pending Approval': {
    bg: '#fef3c7',
    text: '#92400e',
    border: '#fde68a',
    badge: 'badge-pending'
  },
  'Approved': {
    bg: '#d1fae5',
    text: '#065f46',
    border: '#a7f3d0',
    badge: 'badge-approved'
  },
  'Rejected': {
    bg: '#fee2e2',
    text: '#991b1b',
    border: '#fecaca',
    badge: 'badge-rejected'
  }
};

export const ROLE_HOMES = {
  Employee: '/employee/dashboard',
  Director: '/director/dashboard',
  Accounts: '/accounts/dashboard'
};
