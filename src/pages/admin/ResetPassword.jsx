import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { resetPassword } from '../../api/cms';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
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
    if (!token) {
      setError('Invalid reset link');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-brand">
            <img src="/images/Logo.png" alt="R&R" className="admin-login-logo" onError={e => { e.target.style.display = 'none'; }} />
            <div className="admin-login-brand-text">
              <span className="admin-login-brand-name">Riya &amp; Rakshya</span>
              <span className="admin-login-brand-sub">Food products</span>
            </div>
          </div>
          <p className="admin-login-desc">Password reset successful</p>
          <div style={{ textAlign: 'center', margin: '16px 0' }}>
            <CheckCircle size={48} style={{ color: '#22c55e' }} />
            <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>Your password has been updated.</p>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/login')}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <img src="/images/Logo.png" alt="R&R" className="admin-login-logo" onError={e => { e.target.style.display = 'none'; }} />
          <div className="admin-login-brand-text">
            <span className="admin-login-brand-name">Riya &amp; Rakshya</span>
            <span className="admin-login-brand-sub">Food products</span>
          </div>
        </div>
        <p className="admin-login-desc">Set a new password</p>
        {error && <div className="admin-login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <div className="admin-form-group" style={{ position: 'relative' }}>
            <label>Confirm New Password</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
            />
            <span
              onClick={() => setShowConfirm(s => !s)}
              style={{ position: 'absolute', right: 12, top: 38, cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}