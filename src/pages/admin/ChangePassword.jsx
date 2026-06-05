import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { changePassword } from '../../api/cms';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      localStorage.setItem('admin_token', result.token);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-change-password">
      <div className="admin-change-password-card">
        <div className="admin-change-password-header">
          <Lock size={28} />
          <h2>Change Password</h2>
        </div>
        {success && (
          <div className="admin-success-message">
            <CheckCircle size={18} />
            Password changed successfully!
          </div>
        )}
        {error && <div className="admin-login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group" style={{ position: 'relative' }}>
            <label>Current Password</label>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
            <span
              onClick={() => setShowCurrent(s => !s)}
              style={{ position: 'absolute', right: 12, top: 38, cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <div className="admin-form-group" style={{ position: 'relative' }}>
            <label>New Password</label>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
            <span
              onClick={() => setShowNew(s => !s)}
              style={{ position: 'absolute', right: 12, top: 38, cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
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
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}