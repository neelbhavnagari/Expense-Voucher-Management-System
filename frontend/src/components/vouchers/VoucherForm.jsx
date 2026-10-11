import React, { useState, useRef, useEffect } from 'react';
import { DEPARTMENTS, EXPENSE_CATEGORIES } from '../../utils/constants';
import { validateVoucherForm } from '../../utils/validators';
import { voucherService } from '../../services/voucherService';
import { Upload, PenTool, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

const VoucherForm = ({ initialData = {}, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    department: initialData.department || 'Engineering',
    title: initialData.title || '',
    category: initialData.category || 'Software & Tools',
    description: initialData.description || '',
    expenseDate: initialData.expenseDate ? initialData.expenseDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    amount: initialData.amount !== undefined ? initialData.amount : '',
    employeeSignature: initialData.employeeSignature || ''
  });

  const [errors, setErrors] = useState({});
  const [signatureMode, setSignatureMode] = useState('upload'); // 'upload' or 'draw'
  const [uploadingSig, setUploadingSig] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Canvas drawing ref and state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        department: initialData.department || 'Engineering',
        title: initialData.title || '',
        category: initialData.category || 'Software & Tools',
        description: initialData.description || '',
        expenseDate: initialData.expenseDate ? initialData.expenseDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        amount: initialData.amount !== undefined ? initialData.amount : '',
        employeeSignature: initialData.employeeSignature || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingSig(true);
      const res = await voucherService.uploadSignature(file);
      setFormData((prev) => ({ ...prev, employeeSignature: res.data.url }));
      setUploadSuccess(true);
      setErrors((prev) => ({ ...prev, employeeSignature: null }));
    } catch (err) {
      alert(err.message || 'Failed to upload signature image.');
    } finally {
      setUploadingSig(false);
    }
  };

  // Canvas signature functions
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
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setFormData((prev) => ({ ...prev, employeeSignature: dataUrl }));
      setErrors((prev) => ({ ...prev, employeeSignature: null }));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setFormData((prev) => ({ ...prev, employeeSignature: '' }));
      setUploadSuccess(false);
    }
  };

  const handleSubmit = (targetStatus) => {
    const shouldSubmit = targetStatus === 'Pending Approval';
    const validation = validateVoucherForm(formData, shouldSubmit);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit({
      ...formData,
      status: targetStatus
    });
  };

  return (
    <div className="voucher-form-card">
      <div className="form-grid">
        {/* Department */}
        <div className="form-field">
          <label className="form-label required">Department Name</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`form-input ${errors.department ? 'input-error' : ''}`}
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <span className="error-text">{errors.department}</span>
          )}
        </div>

        {/* Expense Category */}
        <div className="form-field">
          <label className="form-label required">Expense Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Expense Title */}
        <div className="form-field form-field-full">
          <label className="form-label required">Expense Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. Cloud Server Hosting Renewal or Flight Tickets"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'input-error' : ''}`}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* Expense Date */}
        <div className="form-field">
          <label className="form-label required">Expense Date</label>
          <input
            type="date"
            name="expenseDate"
            value={formData.expenseDate}
            onChange={handleChange}
            className={`form-input ${errors.expenseDate ? 'input-error' : ''}`}
          />
          {errors.expenseDate && (
            <span className="error-text">{errors.expenseDate}</span>
          )}
        </div>

        {/* Amount */}
        <div className="form-field">
          <label className="form-label required">Amount (INR ₹)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`form-input ${errors.amount ? 'input-error' : ''}`}
          />
          {errors.amount && <span className="error-text">{errors.amount}</span>}
        </div>

        {/* Description */}
        <div className="form-field form-field-full">
          <label className="form-label">Expense Description</label>
          <textarea
            rows="3"
            name="description"
            placeholder="Provide context, purpose, or breakdown of this expense..."
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
          ></textarea>
        </div>

        {/* Signature Section */}
        <div className="form-field form-field-full signature-box-section">
          <div className="signature-header">
            <div>
              <label className="form-label required">Employee Signature</label>
              <p className="form-help-text">
                Mandatory before submitting for approval. Save as draft if signature is not ready yet.
              </p>
            </div>

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
                id="signature-file-input"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="signature-file-input" className="upload-dropzone">
                <Upload size={28} className="upload-icon" />
                <span className="upload-title">
                  {uploadingSig ? 'Uploading signature...' : 'Click to select signature image'}
                </span>
                <span className="upload-hint">Supported formats: PNG, JPG, SVG, WebP (Max 5MB)</span>
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
                <span className="canvas-hint">Sign above with mouse or touch</span>
              </div>
            </div>
          )}

          {/* Signature Preview */}
          {formData.employeeSignature && (
            <div className="signature-preview-card">
              <div className="preview-label">
                <CheckCircle size={15} className="text-success" />
                <span>Signature Attached</span>
              </div>
              <img
                src={formData.employeeSignature}
                alt="Employee Signature Preview"
                className="signature-preview-img"
              />
              <button
                type="button"
                className="btn btn-text-danger btn-sm"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, employeeSignature: '' }));
                  clearCanvas();
                }}
              >
                Remove
              </button>
            </div>
          )}

          {errors.employeeSignature && (
            <div className="error-callout">
              <AlertCircle size={16} />
              <span>{errors.employeeSignature}</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-submit-bar">
        <button
          type="button"
          disabled={isSubmitting}
          className="btn btn-secondary"
          onClick={() => handleSubmit('Draft')}
        >
          Save as Draft
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          className="btn btn-primary"
          onClick={() => handleSubmit('Pending Approval')}
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </div>
    </div>
  );
};

export default VoucherForm;
