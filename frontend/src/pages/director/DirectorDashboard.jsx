import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/vouchers/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import {
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const DirectorDashboard = () => {
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
        setError(err.message || 'Failed to load director dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Loading director dashboard..." />;
  }

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div className="dashboard-hero hero-director">
        <div className="hero-text">
          <div className="hero-tag">
            <ShieldCheck size={16} />
            <span>Executive Approver Portal</span>
          </div>
          <h2>Welcome, {user?.name || 'Director'}</h2>
          <p>
            Review pending reimbursement claims, verify employee signatures, and manage corporate expense workflows.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/director/approvals/pending" className="btn btn-primary btn-lg shadow-sm">
            <Clock size={18} />
            <span>Review Pending Approvals ({stats?.pendingApprovalCount || 0})</span>
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* KPI Stats Grid */}
      <div className="kpi-grid">
        <div className="kpi-card card-pending">
          <div className="kpi-icon-wrap">
            <Clock size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Pending Approvals</span>
            <span className="kpi-value text-warning">{stats?.pendingApprovalCount || 0}</span>
          </div>
        </div>

        <div className="kpi-card card-amount">
          <div className="kpi-icon-wrap">
            <DollarSign size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Pending Amount</span>
            <span className="kpi-value text-primary font-bold">
              {formatCurrency(stats?.totalPendingAmount || 0)}
            </span>
          </div>
        </div>

        <div className="kpi-card card-approved">
          <div className="kpi-icon-wrap">
            <CheckCircle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Approved Today</span>
            <span className="kpi-value">{stats?.approvedToday || 0}</span>
          </div>
        </div>

        <div className="kpi-card card-rejected">
          <div className="kpi-icon-wrap">
            <XCircle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Rejected Today</span>
            <span className="kpi-value">{stats?.rejectedToday || 0}</span>
          </div>
        </div>

        <div className="kpi-card card-total">
          <div className="kpi-icon-wrap">
            <Layers size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Organization Vouchers</span>
            <span className="kpi-value">{stats?.totalVouchers || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Voucher Activity */}
      <div className="section-card">
        <div className="section-card-header">
          <div>
            <h3>Recent Organization Voucher Activity</h3>
            <p className="section-subtitle">Real-time status across all departments</p>
          </div>
          <Link to="/director/vouchers" className="btn btn-secondary btn-sm">
            <span>View All Vouchers</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="table-responsive-container">
            <table className="voucher-table">
              <thead>
                <tr>
                  <th>Voucher #</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Expense Title</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((v) => (
                  <tr key={v._id}>
                    <td className="font-mono font-medium">{v.voucherNumber}</td>
                    <td>{v.employeeName}</td>
                    <td><span className="badge-dept">{v.department}</span></td>
                    <td>{v.title}</td>
                    <td className="text-right font-semibold">{formatCurrency(v.amount)}</td>
                    <td className="text-center"><StatusBadge status={v.status} /></td>
                    <td className="text-right">
                      {v.status === 'Pending Approval' ? (
                        <Link to={`/director/review/${v._id}`} className="btn btn-primary btn-sm">
                          Review
                        </Link>
                      ) : (
                        <Link to={`/director/vouchers/${v._id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-mini">
            <p>No recent voucher activity.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectorDashboard;
