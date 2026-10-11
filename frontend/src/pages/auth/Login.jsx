import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLE_HOMES } from '../../utils/constants';
import {
  LogIn,
  Shield,
  User,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Clock,
  HelpCircle,
  X,
  TrendingUp,
  Building
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your corporate email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const loggedInUser = await login(email.trim(), password);

      const targetPath =
        location.state?.from?.pathname || ROLE_HOMES[loggedInUser.role] || '/';
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setError('');
      setLoading(true);
      const loggedInUser = await login(demoEmail, demoPass);
      const targetPath = ROLE_HOMES[loggedInUser.role] || '/';
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Quick login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="login-split-wrapper">
      <div className="login-split-card">
        {/* Left Side: Enterprise Showcase Presentation */}
        <div className="login-brand-panel">
          <div className="brand-panel-glow" />

          {/* Top Brand Header */}
          <div className="brand-panel-top">
            <div className="brand-logo-combo">
              <div className="brand-badge-box">EVM</div>
              <div className="brand-text-box">
                <span className="company-name">ABC COMPANY</span>
                <span className="app-name">Expense Voucher System</span>
              </div>
            </div>

            <div className="brand-tag-pill">
              <Sparkles size={13} className="text-amber-300" />
              <span>Enterprise Edition v1.0</span>
            </div>
          </div>

          {/* Main Visual Value Proposition */}
          <div className="brand-panel-middle">
            <h1 className="brand-hero-title">
              Digitize. Authorize. <br />
              <span className="text-gradient-cyan">Reimburse.</span>
            </h1>

            <p className="brand-hero-desc">
              ABC Company's high-transparency financial portal replacing manual paper forms
              with cryptographically verified digital approvals and end-to-end audit tracking.
            </p>

            {/* Feature Highlights List */}
            <div className="brand-features-list">
              <div className="brand-feature-item">
                <div className="feature-icon-circle bg-indigo-circle">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>Digital Signature Workflows</strong>
                  <p>Legally binding approvals from Director with real-time audit stamps.</p>
                </div>
              </div>

              <div className="brand-feature-item">
                <div className="feature-icon-circle bg-teal-circle">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <strong>Role-Based Lifecycle Tracking</strong>
                  <p>Strict segregation between Employee claim, Director approval, and Accounts payout.</p>
                </div>
              </div>

              <div className="brand-feature-item">
                <div className="feature-icon-circle bg-emerald-circle">
                  <FileCheck2 size={18} />
                </div>
                <div>
                  <strong>Instant Voucher Verification</strong>
                  <p>Automatic bill attachments, itemized summaries, and instant status updates.</p>
                </div>
              </div>
            </div>

            {/* Interactive Live Voucher Stamp Demo */}
            <div className="brand-voucher-preview-card">
              <div className="preview-card-header">
                <div className="preview-voucher-id">#EV-202610-0001</div>
                <span className="preview-badge-approved">
                  <CheckCircle2 size={12} /> Approved
                </span>
              </div>
              <div className="preview-card-body">
                <div className="preview-title">AWS Cloud Production Cluster</div>
                <div className="preview-meta">
                  <span>Engineering</span>
                  <span className="preview-amount font-mono">₹3,250.00</span>
                </div>
              </div>
              <div className="preview-card-footer">
                <div className="signature-pill">
                  <CheckCircle2 size={12} className="text-success" />
                  <span>R. Director (Digitally Signed)</span>
                </div>
                <span className="preview-time">Instant Sync</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="brand-panel-bottom">
            <div className="security-guarantee">
              <Shield size={14} />
              <span>256-Bit SSL Encrypted • Role Segregation Audited</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form & Demo Accounts */}
        <div className="login-form-panel">
          <div className="form-panel-header">
            <div className="login-welcome-badge">
              <LogIn size={15} />
              <span>Portal Access</span>
            </div>
            <h2>Sign In to EVM</h2>
            <p className="text-muted">
              Enter your corporate credentials to manage expense vouchers and track approvals.
            </p>
          </div>

          {error && (
            <div className="alert alert-error auth-alert animate-shake">
              <div className="alert-content">
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="alert-dismiss-btn"
                aria-label="Dismiss error"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleLoginSubmit} className="modern-auth-form">
            <div className="form-field">
              <label className="form-label" htmlFor="login-email">
                Corporate Email Address
              </label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon-prefix" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. john.doe@abccompany.com"
                  required
                  autoComplete="email"
                  className="form-input input-with-prefix"
                />
              </div>
            </div>

            <div className="form-field">
              <div className="form-label-between">
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="link-forgot-password"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon-prefix" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="form-input input-with-prefix input-with-suffix"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-suffix-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="custom-checkbox"
                />
                <span>Remember me on this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block btn-lg auth-submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner-sm" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In to Portal</span>
                  <ArrowRight size={16} className="btn-arrow-icon" />
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="auth-footer-prompt">
            <span>New employee at ABC Company?</span>{' '}
            <Link to="/register" className="auth-register-link font-semibold">
              Register Account →
            </Link>
          </div>

          {/* Quick Demo Login Switcher */}
          <div className="modern-demo-section">
            <div className="demo-section-divider">
              <span className="divider-line" />
              <span className="divider-label">Or 1-Click Demo Login</span>
              <span className="divider-line" />
            </div>

            <div className="demo-cards-stack">
              {/* Employee Card */}
              <button
                type="button"
                className="demo-role-card role-card-employee"
                onClick={() => handleQuickLogin('john.doe@abccompany.com', 'Password123!')}
                disabled={loading}
              >
                <div className="demo-role-icon icon-employee">
                  <User size={18} />
                </div>
                <div className="demo-role-details">
                  <div className="demo-role-top">
                    <strong>John Doe</strong>
                    <span className="role-pill pill-employee">Employee</span>
                  </div>
                  <span className="demo-role-sub">Engineering Dept • ID: EMP-101</span>
                </div>
                <div className="demo-role-action">
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </div>
              </button>

              {/* Director Card */}
              <button
                type="button"
                className="demo-role-card role-card-director"
                onClick={() => handleQuickLogin('director@abccompany.com', 'Password123!')}
                disabled={loading}
              >
                <div className="demo-role-icon icon-director">
                  <Shield size={18} />
                </div>
                <div className="demo-role-details">
                  <div className="demo-role-top">
                    <strong>Robert Director</strong>
                    <span className="role-pill pill-director">Director</span>
                  </div>
                  <span className="demo-role-sub">Executive Approver • Digital Signature</span>
                </div>
                <div className="demo-role-action">
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </div>
              </button>

              {/* Accounts Card */}
              <button
                type="button"
                className="demo-role-card role-card-accounts"
                onClick={() => handleQuickLogin('accounts@abccompany.com', 'Password123!')}
                disabled={loading}
              >
                <div className="demo-role-icon icon-accounts">
                  <Briefcase size={18} />
                </div>
                <div className="demo-role-details">
                  <div className="demo-role-top">
                    <strong>Alice Accountant</strong>
                    <span className="role-pill pill-accounts">Accounts</span>
                  </div>
                  <span className="demo-role-sub">Finance Team • Reimbursements</span>
                </div>
                <div className="demo-role-action">
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Helper Modal */}
      {showForgotModal && (
        <div className="auth-modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <div className="auth-modal-icon">
                <HelpCircle size={22} className="text-primary" />
              </div>
              <button
                type="button"
                className="auth-modal-close"
                onClick={() => setShowForgotModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <h3>Enterprise Password Reset</h3>
            <p className="auth-modal-text">
              ABC Company adheres to strict corporate access protocols. If you have forgotten
              your password or need access reset:
            </p>
            <div className="auth-modal-info-box">
              <div className="info-box-item">
                <strong>1. Contact IT Support:</strong>
                <span>Email <code>it-support@abccompany.com</code> with your Employee ID.</span>
              </div>
              <div className="info-box-item">
                <strong>2. Demo Environment Note:</strong>
                <span>
                  All pre-seeded demo accounts use default password:{' '}
                  <strong className="text-primary font-mono">Password123!</strong>
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setShowForgotModal(false)}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
