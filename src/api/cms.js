import { useEffect, useState } from 'react';

function getApiBase() {
  if (window.location.hostname === 'admin.rnrfood.com') {
    return '/api';
  }
  return process.env.REACT_APP_CMS_API || 'http://127.0.0.1:8000/api';
}

const API_BASE = getApiBase();

function getToken() {
  return localStorage.getItem('admin_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function cmsGet(path, fallback) {
  try {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) throw new Error(`CMS request failed: ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data) && data.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return data;
  } catch {
    return fallback;
  }
}

export async function cmsPost(path, payload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`CMS request failed: ${response.status}`);
  return response.json();
}

export function useCmsResource(path, fallback) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    let alive = true;
    cmsGet(path, fallback).then((nextData) => {
      if (alive) setData(nextData);
    });
    return () => {
      alive = false;
    };
  }, [path, fallback]);

  return data;
}

// ── Admin API ─────────────────────────────────────────────

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function adminFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function adminCreate(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Create failed: ${res.status}`);
  }
  return res.json();
}

export async function adminUpdate(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Update failed: ${res.status}`);
  }
  return res.json();
}

export async function adminDelete(path, data) {
  const opts = { method: 'DELETE', headers: authHeaders() };
  if (data) opts.body = JSON.stringify(data);
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}

export async function checkSetupStatus() {
  try {
    const res = await fetch(`${API_BASE}/admin/setup-status/`);
    const data = await res.json();
    return data.needsSetup;
  } catch {
    return false;
  }
}

export async function adminSetup(username, email, password) {
  const res = await fetch(`${API_BASE}/admin/setup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Setup failed');
  }
  return res.json();
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/admin/change-password/`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Change password failed');
  }
  return res.json();
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/admin/forgot-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function verifyResetCode(email, code) {
  const res = await fetch(`${API_BASE}/admin/verify-reset-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Invalid code');
  }
  return res.json();
}

export async function resetPassword(token, password) {
  const res = await fetch(`${API_BASE}/admin/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Reset failed');
  }
  return res.json();
}

export async function adminUpdateProfile(data) {
  return adminUpdate('/admin/profile/', data);
}

export async function adminSendMessage(memberIds, subject, message) {
  return adminCreate('/admin/send-message/', { member_ids: memberIds, subject, message });
}

export async function adminUpload(file, folder = 'uploads') {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  const res = await fetch(`${API_BASE}/admin/upload/`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
