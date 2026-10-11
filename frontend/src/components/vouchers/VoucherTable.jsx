import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import {
  Eye,
  Edit2,
  Trash2,
  Send,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const VoucherTable = ({
  vouchers,
  currentRole,
  onDelete,
  onSubmitForApproval,
  pagination,
  onPageChange
}) => {
  if (!vouchers || vouchers.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-state-icon">📋</div>
        <h3>No Vouchers Found</h3>
        <p>No vouchers match your selected criteria or search filter.</p>
      </div>
    );
  }

  const getDetailsLink = (voucher) => {
    if (currentRole === 'Director') {
      return `/director/vouchers/${voucher._id}`;
    }
    if (currentRole === 'Accounts') {
      return `/accounts/vouchers/${voucher._id}`;
    }
    return `/employee/vouchers/${voucher._id}`;
  };

  return (
    <div className="table-responsive-container">
      <table className="voucher-table">
        <thead>
          <tr>
            <th>Voucher #</th>
            <th>Title & Category</th>
            <th>Department</th>
            <th>Employee</th>
            <th>Expense Date</th>
            <th className="text-right">Amount</th>
            <th className="text-center">Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher._id} className="voucher-row">
              <td className="font-mono font-medium">
                <Link to={getDetailsLink(voucher)} className="voucher-link">
                  {voucher.voucherNumber}
                </Link>
              </td>
              <td>
                <div className="table-title-cell">
                  <span className="voucher-title">{voucher.title}</span>
                  <span className="voucher-category-sub">{voucher.category}</span>
                </div>
              </td>
              <td>
                <span className="badge-dept">{voucher.department}</span>
              </td>
              <td>
                <span className="employee-cell-name">
                  {voucher.employeeName}
                  {voucher.employeeId && (
                    <span className="employee-id-sub"> ({voucher.employeeId})</span>
                  )}
                </span>
              </td>
              <td className="whitespace-nowrap">{formatDate(voucher.expenseDate)}</td>
              <td className="text-right font-semibold text-primary">
                {formatCurrency(voucher.amount)}
              </td>
              <td className="text-center">
                <StatusBadge status={voucher.status} />
              </td>
              <td className="text-right">
                <div className="action-buttons-group">
                  {/* View Details */}
                  <Link
                    to={getDetailsLink(voucher)}
                    className="action-btn action-btn-view"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </Link>

                  {/* Employee specific actions for Draft */}
                  {currentRole === 'Employee' && voucher.status === 'Draft' && (
                    <>
                      <Link
                        to={`/employee/vouchers/${voucher._id}/edit`}
                        className="action-btn action-btn-edit"
                        title="Edit Draft"
                      >
                        <Edit2 size={16} />
                      </Link>

                      {onSubmitForApproval && (
                        <button
                          onClick={() => onSubmitForApproval(voucher)}
                          className="action-btn action-btn-submit"
                          title="Submit for Approval"
                        >
                          <Send size={15} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(voucher)}
                          className="action-btn action-btn-delete"
                          title="Delete Draft"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </>
                  )}

                  {/* Director specific action for Pending Approval */}
                  {currentRole === 'Director' && voucher.status === 'Pending Approval' && (
                    <Link
                      to={`/director/review/${voucher._id}`}
                      className="action-btn action-btn-review"
                      title="Review Voucher"
                    >
                      <CheckCircle2 size={16} />
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="table-pagination-footer">
          <span className="pagination-info">
            Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} total items)
          </span>

          <div className="pagination-controls">
            <button
              className="btn btn-secondary btn-sm"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <span className="pagination-page-indicator">{pagination.page}</span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherTable;
