import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/vouchers/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  ArrowRight,
  Printer,
  ShieldCheck,
  Eye
} from 'lucide-react';

const AccountsDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getStats();
        setStats(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load accounts dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Loading accounts dashboard..." />;
  }

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="dashboard-hero hero-accounts">
        <div className="hero-text">
          <div className="hero-tag">
            <FileSpreadsheet size={16} />
            <span>Finance & Accounts Reimbursement Portal</span>
          </div>
          <h2>Welcome, {user?.name || 'Accounts Officer'}</h2>
          <p>
            Monitor verified expense claims, view executive sign-offs, and process employee reimbursements with complete audit transparency.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/accounts/vouchers" className="btn btn-primary btn-lg shadow-sm">
            <FileSpreadsheet size={18} />
            <span>View All Vouchers</span>
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        <div className="kpi-card card-approved">
          <div className="kpi-icon-wrap">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Approved for Reimbursement</span>
            <span className="kpi-value text-success">{stats?.approvedVouchers || 0}</span>
          </div>
        </div>

        <div className="kpi-card card-amount">
          <div className="kpi-icon-wrap">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Approved Amount</span>
            <span className="kpi-value text-primary font-bold">
              {formatCurrency(stats?.totalApprovedExpenseAmount || 0)}
            </span>
          </div>
        </div>

        <div className="kpi-card card-pending">
          <div className="kpi-icon-wrap">
            <Clock size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Pending Approval</span>
            <span className="kpi-value text-warning">{stats?.pendingApproval || 0}</span>
          </div>
        </div>

        <div className="kpi-card card-rejected">
          <div className="kpi-icon-wrap">
            <XCircle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Rejected Claims</span>
            <span className="kpi-value">{stats?.rejectedVouchers || 0}</span>
          </div>
        </div>

        <div className="kpi-card card-total">
          <div className="kpi-icon-wrap">
            <FileSpreadsheet size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Organization Vouchers</span>
            <span className="kpi-value">{stats?.totalVouchers || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Approved Vouchers ready for reimbursement */}
      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Approved Vouchers Ready for Reimbursement</h3>
            <p className="section-subtitle">
              Verified by Director with digital signature attached
            </p>
          </div>
          <Link to="/accounts/vouchers" className="btn btn-secondary btn-sm">
            <span>Explore All</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {stats?.recentApprovedVouchers && stats.recentApprovedVouchers.length > 0 ? (
          <div className="table-responsive-container">
            <table className="voucher-table">
              <thead>
                <tr>
                  <th>Voucher #</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Expense Title</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Approval</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentApprovedVouchers.map((v) => (
                  <tr key={v._id}>
                    <td className="font-mono font-medium">{v.voucherNumber}</td>
                    <td>{v.employeeName}</td>
                    <td><span className="badge-dept">{v.department}</span></td>
                    <td>{v.title}</td>
                    <td className="text-right font-bold text-primary">{formatCurrency(v.amount)}</td>
                    <td className="text-center"><StatusBadge status={v.status} /></td>
                    <td className="text-right">
                      <Link to={`/accounts/vouchers/${v._id}`} className="btn btn-secondary btn-sm">
                        <Eye size={14} />
                        <span>View / Print</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-mini">
            <p>No approved vouchers pending payout at this moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsDashboard;
