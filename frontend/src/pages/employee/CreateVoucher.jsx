import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import VoucherForm from '../../components/vouchers/VoucherForm';
import { voucherService } from '../../services/voucherService';
import useAuth from '../../hooks/useAuth';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const CreateVoucher = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      await voucherService.createVoucher({
        ...formData,
        employeeName: user.name,
        employeeId: user.employeeId,
        department: formData.department || user.department
      });

      navigate('/employee/vouchers');
    } catch (err) {
      setError(err.message || 'Failed to create voucher.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container page-container-narrow">
      <div className="page-back-link">
        <Link to="/employee/vouchers" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to My Vouchers</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h2>Create Expense Voucher</h2>
          <p className="page-header-subtitle">
            Enter expense details, attach receipts/signatures, and submit for director approval.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <VoucherForm
        initialData={{
          department: user?.department || 'Engineering',
          employeeSignature: user?.signature || ''
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CreateVoucher;
