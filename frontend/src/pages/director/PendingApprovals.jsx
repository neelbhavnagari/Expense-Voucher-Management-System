import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { voucherService } from '../../services/voucherService';
import VoucherFilters from '../../components/vouchers/VoucherFilters';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/vouchers/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const PendingApprovals = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: 'All',
    category: 'All',
    voucherNumber: '',
    employeeName: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await voucherService.getPendingApprovals(filters);
      setVouchers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load pending approvals:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'All',
      category: 'All',
      voucherNumber: '',
      employeeName: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      page: 1,
      limit: 10
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Pending Voucher Approvals</h2>
          <p className="page-header-subtitle">
            Expense vouchers awaiting executive review, verification, and digital sign-off.
          </p>
        </div>
      </div>

      <VoucherFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showRoleFilters={true}
      />

      {loading ? (
        <Loader message="Loading pending vouchers..." />
      ) : vouchers.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">🎉</div>
          <h3>All Caught Up!</h3>
          <p>There are no vouchers currently awaiting director approval.</p>
        </div>
      ) : (
        <div className="table-responsive-container">
          <table className="voucher-table">
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Title & Category</th>
                <th>Expense Date</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Signature</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v._id}>
                  <td className="font-mono font-medium">
                    <Link to={`/director/review/${v._id}`} className="voucher-link">
                      {v.voucherNumber}
                    </Link>
                  </td>
                  <td>
                    <strong>{v.employeeName}</strong>
                    {v.employeeId && (
                      <span className="employee-id-sub"> ({v.employeeId})</span>
                    )}
                  </td>
                  <td><span className="badge-dept">{v.department}</span></td>
                  <td>
                    <div className="table-title-cell">
                      <span className="voucher-title">{v.title}</span>
                      <span className="voucher-category-sub">{v.category}</span>
                    </div>
                  </td>
                  <td>{formatDate(v.expenseDate)}</td>
                  <td className="text-right font-bold text-primary">
                    {formatCurrency(v.amount)}
                  </td>
                  <td className="text-center">
                    {v.employeeSignature ? (
                      <span className="signature-pill-verified">Verified</span>
                    ) : (
                      <span className="signature-pill-missing">Missing</span>
                    )}
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/director/review/${v._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle2 size={15} />
                      <span>Review</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && pagination.totalPages > 1 && (
            <div className="table-pagination-footer">
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} pending)
              </span>
              <div className="pagination-controls">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
