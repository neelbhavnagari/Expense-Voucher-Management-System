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
  FileSpreadsheet
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
    return <Loader message="Loading voucher record..." />;
  }

  if (error || !voucher) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error || 'Voucher not found.'}</div>
        <Link to="/accounts/vouchers" className="btn btn-secondary">
          Back to Ledger
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container printable-area">
      {/* Top Navigation & Print Bar */}
      <div className="details-action-bar no-print">
        <Link to="/accounts/vouchers" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to All Vouchers</span>
        </Link>

        <button onClick={handlePrint} className="btn btn-secondary btn-icon-sm">
          <Printer size={16} />
          <span>Print / Save Voucher Receipt</span>
        </button>
      </div>

      {/* Main Voucher Document Card */}
      <div className="voucher-sheet">
        <div className="sheet-header">
          <div className="sheet-brand">
            <div className="sheet-logo">ABC</div>
            <div>
              <h2>ABC Company Private Limited</h2>
              <p>Expense Voucher & Reimbursement Certificate</p>
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

        {/* 2-Column Summary Grid */}
        <div className="sheet-grid">
          <div className="sheet-section">
            <h4 className="sheet-section-title">
              <User size={16} /> Employee Information
            </h4>
            <div className="sheet-data-list">
              <div className="data-row">
                <span className="data-label">Claimant Name:</span>
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
                <span className="data-label">Category:</span>
                <span className="data-value">{voucher.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
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
                <th className="text-right">Reimbursement Amount</th>
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
                <td colSpan="3" className="text-right font-bold">Total Approved Payable:</td>
                <td className="text-right font-bold font-mono text-primary total-cell">
                  {formatCurrency(voucher.amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signatures Verified for Accounts */}
        <div className="sheet-signatures-grid">
          <div className="signature-box">
            <span className="sig-title">Claimant Employee Signature</span>
            <div className="sig-preview-frame">
              {voucher.employeeSignature ? (
                <img
                  src={voucher.employeeSignature}
                  alt="Employee Signature"
                  className="sig-img"
                />
              ) : (
                <span className="sig-placeholder">No signature</span>
              )}
            </div>
            <div className="sig-meta">
              <span>{voucher.employeeName}</span>
              {voucher.submittedAt && (
                <span className="sig-date">Submitted: {formatDateTime(voucher.submittedAt)}</span>
              )}
            </div>
          </div>

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
                <span className="sig-approved-badge">Executive Approval Verified</span>
              ) : voucher.status === 'Rejected' ? (
                <span className="sig-rejected-badge">Rejected</span>
              ) : (
                <span className="sig-placeholder">Pending Executive Review</span>
              )}
            </div>
            <div className="sig-meta">
              <span>Director / Management</span>
              {voucher.approvalDate && (
                <span className="sig-date">Approved: {formatDateTime(voucher.approvalDate)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Audit footer */}
        <div className="sheet-audit-footer">
          <span>Created: {formatDateTime(voucher.createdAt)}</span>
          <span>Last Updated: {formatDateTime(voucher.updatedAt)}</span>
          <span className="system-tag">Accounts Verification Copy</span>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetails;
