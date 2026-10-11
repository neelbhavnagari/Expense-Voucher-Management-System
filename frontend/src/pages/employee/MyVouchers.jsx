import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { voucherService } from '../../services/voucherService';
import VoucherTable from '../../components/vouchers/VoucherTable';
import VoucherFilters from '../../components/vouchers/VoucherFilters';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import { PlusCircle, CheckCircle } from 'lucide-react';

const MyVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    department: 'All',
    category: 'All',
    voucherNumber: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Dialog states
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitTarget, setSubmitTarget] = useState(null);

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await voucherService.getVouchers(filters);
      setVouchers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load vouchers:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      department: 'All',
      category: 'All',
      voucherNumber: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      page: 1,
      limit: 10
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Delete Draft
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await voucherService.deleteDraftVoucher(deleteTarget._id);
      setToastMessage(`Draft voucher ${deleteTarget.voucherNumber} was deleted successfully.`);
      setDeleteTarget(null);
      fetchVouchers();
    } catch (err) {
      alert(err.message || 'Failed to delete draft voucher.');
    }
  };

  // Submit Draft
  const confirmSubmit = async () => {
    if (!submitTarget) return;
    try {
      await voucherService.submitVoucher(submitTarget._id, {
        employeeSignature: submitTarget.employeeSignature
      });
      setToastMessage(`Voucher ${submitTarget.voucherNumber} submitted for Director approval.`);
      setSubmitTarget(null);
      fetchVouchers();
    } catch (err) {
      alert(err.message || 'Failed to submit voucher.');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>My Expense Vouchers</h2>
          <p className="page-header-subtitle">
            Manage your reimbursement requests, view status updates, and draft new claims.
          </p>
        </div>
        <Link to="/employee/vouchers/create" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Create Voucher</span>
        </Link>
      </div>

      {toastMessage && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="alert-dismiss-btn"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <VoucherFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showRoleFilters={false}
      />

      {/* Vouchers Table */}
      {loading ? (
        <Loader message="Loading your vouchers..." />
      ) : (
        <VoucherTable
          vouchers={vouchers}
          currentRole="Employee"
          onDelete={(v) => setDeleteTarget(v)}
          onSubmitForApproval={(v) => {
            if (!v.employeeSignature) {
              alert(
                'Please edit this voucher to attach your employee signature before submitting.'
              );
              return;
            }
            setSubmitTarget(v);
          }}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Draft Voucher"
        message={`Are you sure you want to permanently delete draft voucher "${deleteTarget?.title}" (${deleteTarget?.voucherNumber})? This cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Keep Draft"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!submitTarget}
        title="Submit Voucher for Director Approval"
        message={`Are you ready to submit voucher "${submitTarget?.voucherNumber}" for ₹${submitTarget?.amount}? Once submitted, it cannot be modified.`}
        confirmLabel="Submit for Approval"
        cancelLabel="Review Again"
        isDanger={false}
        onConfirm={confirmSubmit}
        onCancel={() => setSubmitTarget(null)}
      />
    </div>
  );
};

export default MyVouchers;
