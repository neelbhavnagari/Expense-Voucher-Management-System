import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { voucherService } from '../../services/voucherService';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/vouchers/StatusBadge';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatCurrency';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Upload,
  PenTool,
  RotateCcw,
  AlertTriangle,
  User,
  Calendar,
  CreditCard,
  Building
} from 'lucide-react';

const ReviewVoucher = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Approval state
  const [directorSignature, setDirectorSignature] = useState(user?.signature || '');
  const [signatureMode, setSignatureMode] = useState('upload');
  const [uploadingSig, setUploadingSig] = useState(false);
  const [submittingApproval, setSubmittingApproval] = useState(false);

  // Canvas drawing ref
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Reject state
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [submittingReject, setSubmittingReject] = useState(false);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setLoading(true);
        const res = await voucherService.getVoucherById(id);
        setVoucher(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load voucher.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [id]);

  // Upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingSig(true);
      const res = await voucherService.uploadSignature(file);
      setDirectorSignature(res.data.url);
    } catch (err) {
      alert(err.message || 'Failed to upload signature image.');
    } finally {
      setUploadingSig(false);
    }
  };

  // Canvas drawing
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#047857';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setDirectorSignature(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDirectorSignature('');
    }
  };

  // Approve action
  const handleApprove = async () => {
    if (!directorSignature) {
      alert('Director signature is mandatory before approving a voucher.');
      return;
    }

    try {
      setSubmittingApproval(true);
      await voucherService.approveVoucher(id, { directorSignature });
      navigate('/director/approvals/pending');
    } catch (err) {
      alert(err.message || 'Failed to approve voucher.');
    } finally {
      setSubmittingApproval(false);
    }
  };

  // Reject action
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Rejection Reason is mandatory if a voucher is rejected.');
      return;
    }

    try {
      setSubmittingReject(true);
      await voucherService.rejectVoucher(id, { rejectionReason });
      setShowRejectModal(false);
      navigate('/director/approvals/pending');
    } catch (err) {
      alert(err.message || 'Failed to reject voucher.');
    } finally {
      setSubmittingReject(false);
    }
  };

  if (loading) {
    return <Loader message="Loading voucher for review..." />;
  }

  if (error || !voucher) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error || 'Voucher not found.'}</div>
        <Link to="/director/approvals/pending" className="btn btn-secondary">
          Back to Approvals Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-back-link">
        <Link to="/director/approvals/pending" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Pending Approvals</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h2>Review Expense Voucher</h2>
          <p className="page-header-subtitle">
            Verify expense particulars, validate employee signature, and provide digital executive authorization.
          </p>
        </div>
        <div>
          <StatusBadge status={voucher.status} />
        </div>
      </div>

      {/* Voucher Review Overview Card */}
      <div className="voucher-sheet">
        <div className="sheet-header">
          <div>
            <h3>{voucher.title}</h3>
            <span className="voucher-category-sub">{voucher.category}</span>
          </div>
          <div className="voucher-number-badge">
            <span className="badge-label">Voucher Number</span>
            <strong className="voucher-num-val">{voucher.voucherNumber}</strong>
          </div>
        </div>

        {/* 2-Column Summary */}
        <div className="sheet-grid">
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

          <div className="sheet-section">
            <h4 className="sheet-section-title">
              <Calendar size={16} /> Dates & Particulars
            </h4>
            <div className="sheet-data-list">
              <div className="data-row">
                <span className="data-label">Expense Date:</span>
                <span className="data-value">{formatDate(voucher.expenseDate)}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Submitted Date:</span>
                <span className="data-value">{formatDateTime(voucher.submittedAt)}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Amount:</span>
                <span className="data-value font-bold text-primary font-mono">
                  {formatCurrency(voucher.amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="sheet-items-section">
          <h4 className="sheet-section-title">Expense Description</h4>
          <p className="p-desc">{voucher.description || 'No description provided.'}</p>
        </div>

        {/* Employee Signature Verification */}
        <div className="sheet-signatures-grid">
          <div className="signature-box">
            <span className="sig-title">Submitted Employee Signature</span>
            <div className="sig-preview-frame">
              {voucher.employeeSignature ? (
                <img
                  src={voucher.employeeSignature}
                  alt="Employee Signature"
                  className="sig-img"
                />
              ) : (
                <span className="sig-placeholder text-danger">No signature detected!</span>
              )}
            </div>
            <div className="sig-meta">
              <span>{voucher.employeeName}</span>
              <span>Verified on submission</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Section (Only active if Pending Approval) */}
      {voucher.status === 'Pending Approval' && (
        <div className="review-action-panel">
          <h3 className="panel-title">Director Decision & Authorization</h3>
          <p className="panel-subtitle">
            To approve this expense voucher, your digital signature is required. To reject it, a clear reason must be provided.
          </p>

          <div className="signature-box-section">
            <div className="signature-header">
              <label className="form-label required">Director Approval Signature</label>

              <div className="signature-mode-tabs">
                <button
                  type="button"
                  className={`tab-btn ${signatureMode === 'upload' ? 'tab-btn-active' : ''}`}
                  onClick={() => setSignatureMode('upload')}
                >
                  <Upload size={14} /> Upload Image
                </button>
                <button
                  type="button"
                  className={`tab-btn ${signatureMode === 'draw' ? 'tab-btn-active' : ''}`}
                  onClick={() => setSignatureMode('draw')}
                >
                  <PenTool size={14} /> Draw Signature
                </button>
              </div>
            </div>

            {signatureMode === 'upload' ? (
              <div className="signature-upload-zone">
                <input
                  type="file"
                  id="director-sig-file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="director-sig-file" className="upload-dropzone">
                  <Upload size={24} className="upload-icon" />
                  <span className="upload-title">
                    {uploadingSig ? 'Uploading signature...' : 'Select director signature image'}
                  </span>
                </label>
              </div>
            ) : (
              <div className="canvas-signature-zone">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={130}
                  className="signature-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="canvas-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={clearCanvas}
                  >
                    <RotateCcw size={14} /> Clear Canvas
                  </button>
                </div>
              </div>
            )}

            {directorSignature && (
              <div className="signature-preview-card">
                <div className="preview-label">
                  <CheckCircle size={15} className="text-success" />
                  <span>Director Signature Ready</span>
                </div>
                <img
                  src={directorSignature}
                  alt="Director Signature Preview"
                  className="signature-preview-img"
                />
              </div>
            )}
          </div>

          {/* Action Decision Buttons */}
          <div className="decision-buttons-row">
            <button
              type="button"
              className="btn btn-danger btn-lg"
              onClick={() => setShowRejectModal(true)}
            >
              <XCircle size={18} />
              <span>Reject Voucher</span>
            </button>

            <button
              type="button"
              disabled={submittingApproval || !directorSignature}
              className="btn btn-success btn-lg"
              onClick={handleApprove}
            >
              <CheckCircle size={18} />
              <span>{submittingApproval ? 'Authorizing...' : 'Approve & Sign Voucher'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-danger">
                  <AlertTriangle size={20} />
                </div>
                <h3>Reject Voucher Request</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowRejectModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="mb-2">
                Please provide a mandatory explanation for rejecting voucher{' '}
                <strong>{voucher.voucherNumber}</strong>. The employee will see this reason in their portal.
              </p>

              <textarea
                rows="4"
                className="form-textarea"
                placeholder="e.g. Please attach itemized tax invoice receipt and get HOD pre-approval..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                autoFocus
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                disabled={submittingReject || !rejectionReason.trim()}
                onClick={handleReject}
              >
                {submittingReject ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewVoucher;
