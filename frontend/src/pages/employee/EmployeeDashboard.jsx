import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/vouchers/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  FileEdit,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Send,
  PieChart,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Receipt,
  HelpCircle
} from 'lucide-react';

const EmployeeDashboard = () => {
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
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <Loader message="Loading your expense dashboard..." />;
  }

  const totalVouchers = stats?.totalVouchers || 0;
  const approvedVouchers = stats?.approvedVouchers || 0;
  const approvalRate = totalVouchers > 0 ? Math.round((approvedVouchers / totalVouchers) * 100) : 0;
  const totalClaimed = stats?.totalAmountClaimed || 0;
  const approvedAmount = stats?.approvedAmount || 0;
  const pendingAmount = stats?.pendingAmount || 0;

  return (
    <div className="page-container emp-dashboard-container">
      {/* Hero Header */}
      <div className="emp-hero-card">
        <div className="emp-hero-content">
          <div className="emp-hero-pill">
            <Sparkles size={14} className="text-amber-300" />
            <span>Employee Reimbursement Portal</span>
          </div>

          <h2 className="emp-hero-title">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Employee'}! 👋
          </h2>

          <p className="emp-hero-subtitle">
            Welcome to ABC Company's expense voucher system. Create reimbursement requests, track Director approvals in real time, and monitor your payouts.
          </p>

          <div className="emp-hero-user-chips">
            <span className="user-chip">
              <strong>Dept:</strong> {user?.department || 'General'}
            </span>
            {user?.employeeId && (
              <span className="user-chip">
                <strong>ID:</strong> {user.employeeId}
              </span>
            )}
            <span className="user-chip user-chip-verified">
              <ShieldCheck size={14} />
              <span>Digital Signature Ready</span>
            </span>
          </div>
        </div>

        <div className="emp-hero-actions">
          <Link to="/employee/vouchers/create" className="btn btn-primary btn-lg emp-btn-create">
            <PlusCircle size={20} />
            <span>Create New Voucher</span>
          </Link>
          <Link to="/employee/vouchers" className="btn btn-secondary emp-btn-explore">
            <Receipt size={17} />
            <span>View All My Vouchers</span>
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Financial Health Summary Banner */}
      <div className="emp-financial-banner">
        <div className="fin-metric-primary">
          <span className="fin-metric-label">Total Amount Claimed</span>
          <h3 className="fin-metric-val">{formatCurrency(totalClaimed)}</h3>
          <div className="fin-rate-tag">
            <TrendingUp size={14} />
            <span>{approvalRate}% Approval Rate</span>
          </div>
        </div>

        <div className="fin-metric-split">
          <div className="fin-split-item text-success-item">
            <span className="split-label">Approved & Ready for Payout</span>
            <span className="split-val">{formatCurrency(approvedAmount)}</span>
            <div className="split-sub">{stats?.approvedVouchers || 0} claims approved</div>
          </div>

          <div className="fin-split-divider" />

          <div className="fin-split-item text-warning-item">
            <span className="split-label">Under Director Review</span>
            <span className="split-val">{formatCurrency(pendingAmount)}</span>
            <div className="split-sub">{stats?.pendingApproval || 0} claims pending</div>
          </div>
        </div>
      </div>

      {/* 5-Column Interactive KPI Grid */}
      <div className="kpi-grid emp-kpi-grid">
        <Link to="/employee/vouchers" className="kpi-card card-total emp-kpi-card">
          <div className="kpi-icon-wrap">
            <FileText size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Vouchers</span>
            <span className="kpi-value">{stats?.totalVouchers || 0}</span>
            <span className="kpi-foot-hint">All claims created →</span>
          </div>
        </Link>

        <Link to="/employee/vouchers?status=Pending+Approval" className="kpi-card card-pending emp-kpi-card">
          <div className="kpi-icon-wrap">
            <Clock size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Pending Approval</span>
            <span className="kpi-value text-warning">{stats?.pendingApproval || 0}</span>
            <span className="kpi-foot-hint text-warning">Awaiting Director →</span>
          </div>
        </Link>

        <Link to="/employee/vouchers?status=Approved" className="kpi-card card-approved emp-kpi-card">
          <div className="kpi-icon-wrap">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Approved</span>
            <span className="kpi-value text-success">{stats?.approvedVouchers || 0}</span>
            <span className="kpi-foot-hint text-success">Signed & verified →</span>
          </div>
        </Link>

        <Link to="/employee/vouchers?status=Draft" className="kpi-card card-draft emp-kpi-card">
          <div className="kpi-icon-wrap">
            <FileEdit size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Drafts</span>
            <span className="kpi-value">{stats?.draftVouchers || 0}</span>
            <span className="kpi-foot-hint">Unsubmitted claims →</span>
          </div>
        </Link>

        <Link to="/employee/vouchers?status=Rejected" className="kpi-card card-rejected emp-kpi-card">
          <div className="kpi-icon-wrap">
            <XCircle size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Rejected</span>
            <span className="kpi-value text-danger">{stats?.rejectedVouchers || 0}</span>
            <span className="kpi-foot-hint text-danger">Needs attention →</span>
          </div>
        </Link>
      </div>

      {/* Action Required Callout (Drafts / Rejected Claims) */}
      {stats?.actionRequired && stats.actionRequired.length > 0 && (
        <div className="emp-action-required-card">
          <div className="action-card-header">
            <div className="action-header-left">
              <div className="action-bell-icon">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4>Action Required on Your Claims ({stats.actionRequired.length})</h4>
                <p className="section-subtitle">
                  Drafts that need submission or rejected vouchers with director remarks
                </p>
              </div>
            </div>
            <Link to="/employee/vouchers" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          <div className="action-items-grid">
            {stats.actionRequired.map((item) => (
              <div key={item._id} className="action-item-box">
                <div className="action-item-top">
                  <span className="font-mono font-bold">{item.voucherNumber}</span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="action-item-body">
                  <div className="action-item-title">{item.title}</div>
                  <div className="action-item-amt font-mono font-semibold text-primary">
                    {formatCurrency(item.amount)}
                  </div>
                  {item.status === 'Rejected' && item.rejectionReason && (
                    <div className="action-rejection-reason">
                      <strong>Director Note:</strong> "{item.rejectionReason}"
                    </div>
                  )}
                </div>
                <div className="action-item-foot">
                  {item.status === 'Draft' ? (
                    <Link
                      to={`/employee/vouchers/${item._id}/edit`}
                      className="btn btn-primary btn-sm btn-block"
                    >
                      <FileEdit size={14} /> Complete & Submit
                    </Link>
                  ) : (
                    <Link
                      to={`/employee/vouchers/${item._id}`}
                      className="btn btn-secondary btn-sm btn-block"
                    >
                      Review Reason
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Column Content Grid */}
      <div className="emp-two-col-grid">
        {/* Left Column: Recent Vouchers */}
        <div className="section-card emp-recent-table-card">
          <div className="section-card-header">
            <div>
              <h3>Recent Claims Activity</h3>
              <p className="section-subtitle">Your latest expense reimbursement filings</p>
            </div>
            <Link to="/employee/vouchers" className="btn btn-secondary btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {stats?.recentVouchers && stats.recentVouchers.length > 0 ? (
            <div className="table-responsive-container">
              <table className="voucher-table">
                <thead>
                  <tr>
                    <th>Voucher #</th>
                    <th>Expense Title</th>
                    <th>Date</th>
                    <th className="text-right">Amount</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentVouchers.map((v) => (
                    <tr key={v._id}>
                      <td className="font-mono font-semibold">
                        <Link to={`/employee/vouchers/${v._id}`} className="voucher-link">
                          {v.voucherNumber}
                        </Link>
                      </td>
                      <td>
                        <div className="table-title-cell">
                          <span className="voucher-title">{v.title}</span>
                          <span className="voucher-category-sub">{v.category}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap">{formatDate(v.expenseDate)}</td>
                      <td className="text-right font-bold text-primary font-mono">
                        {formatCurrency(v.amount)}
                      </td>
                      <td className="text-center">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="text-right">
                        <Link to={`/employee/vouchers/${v._id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state-mini">
              <Receipt size={36} className="text-muted mb-2" />
              <p>You haven't filed any vouchers yet.</p>
              <Link to="/employee/vouchers/create" className="btn btn-primary btn-sm mt-2">
                Create First Voucher
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Spending Breakdown & How-It-Works Workflow */}
        <div className="emp-sidebar-widgets">
          {/* Top Spending Categories Card */}
          <div className="section-card emp-widget-card">
            <div className="widget-header">
              <div className="widget-title-wrap">
                <PieChart size={18} className="text-primary" />
                <h4>Top Expense Categories</h4>
              </div>
            </div>

            {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
              <div className="category-bars-list">
                {stats.categoryBreakdown.map((cat) => {
                  const percent = totalClaimed > 0 ? Math.round((cat.total / totalClaimed) * 100) : 0;
                  return (
                    <div key={cat._id} className="category-bar-item">
                      <div className="cat-bar-header">
                        <span className="cat-name">{cat._id}</span>
                        <span className="cat-amt font-mono">{formatCurrency(cat.total)}</span>
                      </div>
                      <div className="cat-progress-track">
                        <div
                          className="cat-progress-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="cat-bar-meta">
                        <span>{cat.count} claim{cat.count > 1 ? 's' : ''}</span>
                        <span>{percent}% of total</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted text-sm">No expenses categorized yet.</p>
            )}
          </div>

          {/* Workflow Step Tracker */}
          <div className="section-card emp-widget-card emp-workflow-widget">
            <div className="widget-header">
              <div className="widget-title-wrap">
                <HelpCircle size={18} className="text-primary" />
                <h4>Voucher Approval Process</h4>
              </div>
            </div>

            <div className="workflow-steps-vertical">
              <div className="step-item step-completed">
                <div className="step-bullet">1</div>
                <div className="step-content">
                  <strong>Create & Draft</strong>
                  <p>Enter bill details, amount, and attach your digital signature.</p>
                </div>
              </div>

              <div className="step-item step-active">
                <div className="step-bullet">2</div>
                <div className="step-content">
                  <strong>Submit to Director</strong>
                  <p>Moves claim to Pending Approval for executive authorization.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-bullet">3</div>
                <div className="step-content">
                  <strong>Director Decision</strong>
                  <p>Director signs digital approval or provides rejection remarks.</p>
                </div>
              </div>

              <div className="step-item">
                <div className="step-bullet">4</div>
                <div className="step-content">
                  <strong>Accounts Reimbursement</strong>
                  <p>Approved claims are queued for finance disbursement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
