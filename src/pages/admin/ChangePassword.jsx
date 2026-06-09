import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, Mail } from 'lucide-react';
import { changePassword, adminFetch, adminUpdateProfile } from '../../api/cms';
import AdminLayout from './AdminLayout';

export default function ChangePassword() {
  const [adminEmail, setAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    adminFetch('/admin/profile/')
      .then(data => setAdminEmail(data.email || ''))
      .catch(() => {});
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess(false);
    setEmailLoading(true);
    try {
      await adminUpdateProfile({ email: adminEmail });
      setEmailSuccess(true);
    } catch (err) {
      setEmailError(err.message || 'Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      localStorage.setItem('admin_token', result.token);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AdminLayout title="Account">
      <div className="admin-card" style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <Lock size={22} />
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Account Settings</h2>
        </div>

        <form onSubmit={handleEmailSubmit} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mail size={16} /> Email Address
          </h3>
          <div className="admin-form-group">
            <label>Your Email (for password resets & notifications)</label>
            <input
              type="email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={emailLoading} style={{ marginTop: 4 }}>
            {emailLoading ? 'Updating...' : 'Update Email'}
          </button>
          {emailSuccess && (
            <div className="admin-success-message" style={{ marginTop: 12 }}>
              <CheckCircle size={18} />
              Email updated successfully!
            </div>
          )}
          {emailError && <div className="admin-login-error" style={{ marginTop: 12 }}>{emailError}</div>}
        </form>

        <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '0 0 24px' }} />

        <form onSubmit={handlePasswordSubmit}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={16} /> Change Password
          </h3>
          <div className="admin-form-group" style={{ position: 'relative' }}>
            <label>Current Password</label>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
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
            />
            <span
              onClick={() => setShowConfirm(s => !s)}
              style={{ position: 'absolute', right: 12, top: 38, cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={passwordLoading} style={{ marginTop: 4 }}>
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
          {passwordSuccess && (
            <div className="admin-success-message" style={{ marginTop: 12 }}>
              <CheckCircle size={18} />
              Password changed successfully!
            </div>
          )}
          {passwordError && <div className="admin-login-error" style={{ marginTop: 12 }}>{passwordError}</div>}
        </form>
      </div>
    </AdminLayout>
  );
}