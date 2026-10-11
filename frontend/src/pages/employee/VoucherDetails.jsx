import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { voucherService } from '../../services/voucherService';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/vouchers/StatusBadge';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatCurrency';
import {
  ArrowLeft,
  Printer,
  Calendar,
  Building,
  User,
  CreditCard,
  AlertOctagon,
  CheckCircle,
  FileText
} from 'lucide-react';

const VoucherDetails = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setLoading(true);
        const res = await voucherService.getVoucherById(id);
        setVoucher(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load voucher details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loader message="Loading voucher details..." />;
  }

  if (error || !voucher) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error || 'Voucher not found.'}</div>
        <Link to="/employee/vouchers" className="btn btn-secondary">
          Back to My Vouchers
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container printable-area">
      {/* Top Navigation & Print Bar */}
      <div className="details-action-bar no-print">
        <Link to="/employee/vouchers" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to My Vouchers</span>
        </Link>

        <button onClick={handlePrint} className="btn btn-secondary btn-icon-sm">
          <Printer size={16} />
          <span>Print / Download Voucher</span>
        </button>
      </div>

      {/* Main Voucher Document Card */}
      <div className="voucher-sheet">
        {/* Printable Header */}
        <div className="sheet-header">
          <div className="sheet-brand">
            <div className="sheet-logo">ABC</div>
            <div>
              <h2>ABC Company Private Limited</h2>
              <p>Official Employee Expense Voucher</p>
            </div>
          </div>

          <div className="sheet-meta">
            <div className="voucher-number-badge">
              <span className="badge-label">Voucher Number</span>
              <strong className="voucher-num-val">{voucher.voucherNumber}</strong>
            </div>
            <div className="sheet-status-wrap">
              <StatusBadge status={voucher.status} />
            </div>
          </div>
        </div>

        {/* Rejection Alert Callout if Rejected */}
        {voucher.status === 'Rejected' && voucher.rejectionReason && (
          <div className="rejection-notice-box">
            <div className="rejection-icon">
              <AlertOctagon size={24} />
            </div>
            <div className="rejection-content">
              <h4>Voucher Rejected by Director</h4>
              <p className="rejection-reason-text">
                <strong>Reason:</strong> {voucher.rejectionReason}
              </p>
              <span className="rejection-subtext">
                Please contact the Director or create a revised voucher addressing the comments above.
              </span>
            </div>
          </div>
        )}

        {/* 2-Column Summary Grid */}
        <div className="sheet-grid">
          {/* Employee Info */}
          <div className="sheet-section">
            <h4 className="sheet-section-title">
              <User size={16} /> Employee Information
            </h4>
            <div className="sheet-data-list">
              <div className="data-row">
                <span className="data-label">Employee Name:</span>
                <span className="data-value font-medium">{voucher.employeeName}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Employee ID:</span>
                <span className="data-value">{voucher.employeeId || 'N/A'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Department:</span>
                <span className="data-value">{voucher.department}</span>
              </div>
            </div>
          </div>

          {/* Voucher Info */}
          <div className="sheet-section">
            <h4 className="sheet-section-title">
              <Calendar size={16} /> Voucher Details
            </h4>
            <div className="sheet-data-list">
              <div className="data-row">
                <span className="data-label">Voucher Date:</span>
                <span className="data-value">{formatDate(voucher.voucherDate)}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Expense Date:</span>
                <span className="data-value">{formatDate(voucher.expenseDate)}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Expense Category:</span>
                <span className="data-value">{voucher.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Items Breakdown Table */}
        <div className="sheet-items-section">
          <h4 className="sheet-section-title">
            <CreditCard size={16} /> Expense Claim Particulars
          </h4>
          <table className="sheet-table">
            <thead>
              <tr>
                <th>Expense Title</th>
                <th>Category</th>
                <th>Description</th>
                <th className="text-right">Claimed Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">{voucher.title}</td>
                <td>{voucher.category}</td>
                <td className="text-muted">{voucher.description || 'No description provided.'}</td>
                <td className="text-right font-bold text-primary font-mono">
                  {formatCurrency(voucher.amount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-right font-bold">Total Claimed:</td>
                <td className="text-right font-bold font-mono text-primary total-cell">
                  {formatCurrency(voucher.amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures & Approval Section */}
        <div className="sheet-signatures-grid">
          {/* Employee Signature */}
          <div className="signature-box">
            <span className="sig-title">Employee Signature</span>
            <div className="sig-preview-frame">
              {voucher.employeeSignature ? (
                <img
                  src={voucher.employeeSignature}
                  alt="Employee Signature"
                  className="sig-img"
                />
              ) : (
                <span className="sig-placeholder">No signature attached (Draft)</span>
              )}
            </div>
            <div className="sig-meta">
              <span>{voucher.employeeName}</span>
              {voucher.submittedAt && (
                <span className="sig-date">Submitted: {formatDateTime(voucher.submittedAt)}</span>
              )}
            </div>
          </div>

          {/* Director Signature */}
          <div className="signature-box">
            <span className="sig-title">Director Approval Signature</span>
            <div className="sig-preview-frame">
              {voucher.directorSignature ? (
                <img
                  src={voucher.directorSignature}
                  alt="Director Signature"
                  className="sig-img"
                />
              ) : voucher.status === 'Approved' ? (
                <span className="sig-approved-badge">Approved by Director</span>
              ) : voucher.status === 'Rejected' ? (
                <span className="sig-rejected-badge">Rejected</span>
              ) : (
                <span className="sig-placeholder">Pending Director Review</span>
              )}
            </div>
            <div className="sig-meta">
              <span>Director / Management</span>
              {voucher.approvalDate && (
                <span className="sig-date">Reviewed: {formatDateTime(voucher.approvalDate)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Audit Footer */}
        <div className="sheet-audit-footer">
          <span>Created: {formatDateTime(voucher.createdAt)}</span>
          <span>Last Updated: {formatDateTime(voucher.updatedAt)}</span>
          <span className="system-tag">EVM ABC Company System</span>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetails;
