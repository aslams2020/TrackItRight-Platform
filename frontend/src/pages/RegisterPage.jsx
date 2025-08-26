import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from '../utils/toast'; // optional small helper below
import './AuthPages.css';
import { ROLE_OPTIONS } from '../utils/constants';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',      // default
    departmentId: ''   // optional; only needed for authorities
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    // Build register payload expected by backend RegisterRequest
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    };

    // Optional departmentId - send only if present
    if (form.departmentId) {
      try {
        payload.departmentId = Number(form.departmentId);
      } catch (ignore) {}
    }

    try {
      const res = await api.post('/api/auth/register', payload);
      // Backend returns created user object (or success)
      setLoading(false);
      toast('Registration successful — please login');
      navigate('/login');
    } catch (error) {
      setLoading(false);
      console.error(error);
      const msg = error?.response?.data?.message || error?.response?.data || error.message;
      setErr(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create an account</h2>
        <p className="muted">Register as Citizen / Authority / Admin (admin likely for testing).</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" required />

          <label>Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" required minLength={6} />

          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          {form.role === 'AUTHORITY' && (
            <>
              <label>Department ID (optional)</label>
              <input
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                placeholder="Enter department id (e.g., 1)"
              />
              <small className="muted">If you know the department id, enter it; admin can link later too.</small>
            </>
          )}

          {err && <div className="error">{err}</div>}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
            <button type="button" className="btn-outline" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
