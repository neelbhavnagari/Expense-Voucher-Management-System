import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import VoucherForm from '../../components/vouchers/VoucherForm';
import { voucherService } from '../../services/voucherService';
import Loader from '../../components/common/Loader';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const EditVoucher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setLoading(true);
        const res = await voucherService.getVoucherById(id);
        if (res.data.status !== 'Draft') {
          alert('Only vouchers in Draft status can be edited.');
          navigate('/employee/vouchers');
          return;
        }
        setVoucher(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load voucher details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      await voucherService.updateDraftVoucher(id, formData);
      navigate('/employee/vouchers');
    } catch (err) {
      setError(err.message || 'Failed to update draft voucher.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading draft voucher..." />;
  }

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
          <h2>Edit Draft Voucher</h2>
          <p className="page-header-subtitle">
            Editing voucher: <strong className="font-mono">{voucher?.voucherNumber}</strong>
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {voucher && (
        <VoucherForm
          initialData={voucher}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default EditVoucher;
