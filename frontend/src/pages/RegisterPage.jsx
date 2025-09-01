import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from '../utils/toast'; // optional small helper below
import '../styles/AuthPages.css';
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

  const [departments, setDepartments] = useState([]);
  const [depsLoading, setDepsLoading] = useState(false);
  const [depsErr, setDepsErr] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    // Only fetch when needed, or fetch once unconditionally if preferred
    if (form.role !== 'AUTHORITY') return;
    const loadDeps = async () => {
      setDepsErr('');
      setDepsLoading(true);
      try {
        const res = await fetch('http://localhost:8080/api/departments', {
          headers: { 'Accept': 'application/json' }
        });
        const text = await res.text();
        if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
        const data = text ? JSON.parse(text) : [];
        setDepartments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setDepsErr('Failed to load departments.');
      } finally {
        setDepsLoading(false);
      }
    };
    loadDeps();
  }, [form.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      };
      // Only include departmentId if role is AUTHORITY and a department is selected
      if (form.role === 'AUTHORITY' && form.departmentId) {
        payload.departmentId = Number(form.departmentId);
      }
      const res = await api.post('/api/auth/register', payload);
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
        <h2>Create an <span>Account⚡</span></h2>
        <p className="muted-first">Register as Citizen / Authority / Admin (admin likely for testing).</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full name</label>
          <input name="name" value={form.name} onChange={handleChange} required />

          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" required />

          <label>Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" required minLength={6} />

          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange} className='rolebar'>
            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          {form.role === 'AUTHORITY' && (
            <div className="authority-group">
              <label>Department</label>
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                disabled={depsLoading || !!depsErr}
                required={false}
              >
                <option value="">{depsLoading ? 'Loading...' : 'Select department (optional)'}</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}{d.description ? ` - ${d.description}` : ''}
                  </option>
                ))}
              </select>
              {depsErr && <div className="error">{depsErr}</div>}
              <small className="muted">
                Selecting a department is optional; admin can link later too.
              </small>
            </div>
          )}


          {err && <div className="error">{err}</div>}

          <div className="form-actions">
            <button className="btn register-btn" type="submit" disabled={loading}>
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
