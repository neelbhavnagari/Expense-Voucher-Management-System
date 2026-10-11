import React, { useState, useEffect, useCallback } from 'react';
import { voucherService } from '../../services/voucherService';
import VoucherTable from '../../components/vouchers/VoucherTable';
import VoucherFilters from '../../components/vouchers/VoucherFilters';
import Loader from '../../components/common/Loader';

const AllVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
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
      employeeName: '',
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

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Organization Vouchers Registry</h2>
          <p className="page-header-subtitle">
            Search, filter, inspect employee signatures, and track reimbursement disbursement status.
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
        <Loader message="Loading vouchers ledger..." />
      ) : (
        <VoucherTable
          vouchers={vouchers}
          currentRole="Accounts"
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AllVouchers;
