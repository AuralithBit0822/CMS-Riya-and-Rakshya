import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { adminLogin, checkSetupStatus, adminSetup, forgotPassword, verifyResetCode, resetPassword } from '../../api/cms';

function LoginForm({ onForgotPassword }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await adminLogin(username, password);
      localStorage.setItem('admin_token', result.token);
      localStorage.setItem('admin_user', result.username);
      navigate('/admin');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="admin-login-desc">Sign in to manage your CMS</p>
      {error && <div className="admin-login-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="admin-form-group" style={{ position: 'relative' }}>
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <span
            onClick={() => setShowPassword(s => !s)}
            style={{
              position: 'absolute',
              right: 12,
              top: 38,
              cursor: 'pointer',
              color: '#888',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <button type="button" className="admin-btn-link" onClick={onForgotPassword} style={{ marginTop: 12, background: 'none', border: 'none', color: '#C8102E', cursor: 'pointer', fontSize: 14, width: '100%', textAlign: 'center' }}>
          Forgot Password?
        </button>
      </form>
    </>
  );
}

function SetupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await adminSetup(username, email, password);
      localStorage.setItem('admin_token', result.token);
      localStorage.setItem('admin_user', result.username);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="admin-login-desc">Create your admin account</p>
      {error && <div className="admin-login-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="admin-form-group" style={{ position: 'relative' }}>
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
          <span
            onClick={() => setShowPassword(s => !s)}
            style={{
              position: 'absolute',
              right: 12,
              top: 38,
              cursor: 'pointer',
              color: '#888',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <div className="admin-form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            required
          />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Admin Account'}
        </button>
      </form>
    </>
  );
}

function ForgotPasswordForm({ onBack }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.status === 'sent') {
        setStep('code');
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await verifyResetCode(email, code);
      setToken(result.token);
      setStep('password');
    } catch (err) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setStep('done');
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <>
        <p className="admin-login-desc">Enter your email</p>
        {error && <div className="admin-login-error">{error}</div>}
        <form onSubmit={handleSendCode}>
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your admin email"
              required
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
          <button type="button" className="admin-btn-link" onClick={onBack} style={{ marginTop: 12, background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14, width: '100%', textAlign: 'center' }}>
            <ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Back to Sign In
          </button>
        </form>
      </>
    );
  }

  if (step === 'code') {
    return (
      <>
        <p className="admin-login-desc">Enter the code sent to your email</p>
        {error && <div className="admin-login-error">{error}</div>}
        <form onSubmit={handleVerifyCode}>
          <div className="admin-form-group">
            <label>6-Digit Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              required
              maxLength={6}
              style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading || code.length < 6}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button type="button" className="admin-btn-link" onClick={() => setStep('email')} style={{ marginTop: 12, background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14, width: '100%', textAlign: 'center' }}>
            <ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Back
          </button>
        </form>
      </>
    );
  }

  if (step === 'done') {
    return (
      <>
        <p className="admin-login-desc">Password reset successful</p>
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <CheckCircle size={48} style={{ color: '#22c55e' }} />
          <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>Your password has been updated.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={onBack}>
          Go to Sign In
        </button>
      </>
    );
  }

  return (
    <>
      <p className="admin-login-desc">Set a new password</p>
      {error && <div className="admin-login-error">{error}</div>}
      <form onSubmit={handleResetPassword}>
        <div className="admin-form-group" style={{ position: 'relative' }}>
          <label>New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
          <span
            onClick={() => setShowPassword(s => !s)}
            style={{ position: 'absolute', right: 12, top: 38, cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <div className="admin-form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            required
          />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        <button type="button" className="admin-btn-link" onClick={() => setStep('code')} style={{ marginTop: 12, background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 14, width: '100%', textAlign: 'center' }}>
          <ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Back
        </button>
      </form>
    </>
  );
}

export default function AdminLogin() {
  const [mode, setMode] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      navigate('/admin', { replace: true });
      return;
    }
    checkSetupStatus().then((needsSetup) => {
      setMode(needsSetup ? 'setup' : 'login');
    });
  }, [navigate]);

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <img
            src="/images/Logo.png"
            alt="R&R"
            className="admin-login-logo"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="admin-login-brand-text">
            <span className="admin-login-brand-name">Riya &amp; Rakshya</span>
            <span className="admin-login-brand-sub">Food products</span>
          </div>
        </div>
        {mode === 'loading' ? (
          <p style={{ textAlign: 'center', color: '#999', fontSize: 14 }}>Loading...</p>
        ) : mode === 'setup' ? (
          <SetupForm />
        ) : mode === 'forgot' ? (
          <ForgotPasswordForm onBack={() => setMode('login')} />
        ) : (
          <LoginForm onForgotPassword={() => setMode('forgot')} />
        )}
      </div>
    </div>
  );
}
