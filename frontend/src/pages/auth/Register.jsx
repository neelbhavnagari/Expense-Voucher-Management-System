import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLE_HOMES, DEPARTMENTS } from '../../utils/constants';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Building,
  BadgeCheck,
  Shield,
  Briefcase,
  Eye,
  EyeOff
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    department: 'Engineering',
    employeeId: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const registeredUser = await register(formData);
      const targetPath = ROLE_HOMES[registeredUser.role] || '/';
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-header">
          <div className="login-brand-badge">EVM</div>
          <h2>Create New Account</h2>
          <p className="login-subtitle">
            Register your profile to access expense voucher management, reviews, and reimbursements.
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="login-form">
          <div className="form-field">
            <label className="form-label required">Full Name</label>
            <div className="input-with-icon">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label required">Corporate Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john.doe@abccompany.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label required">Password</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label required">Assigned Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Employee">Employee</option>
                <option value="Director">Director (Admin)</option>
                <option value="Accounts">Accounts Team</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label required">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Employee ID (Optional)</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="e.g. EMP-105"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        {/* Link back to Login */}
        <div className="auth-footer-link">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
