import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { setAuth } from '../utils/auth';
import './AuthPages.css';
import { toast } from '../utils/toast'; // optional helper

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const routeByRole = (role) => {
    if (role === 'USER') return '/citizen';
    if (role === 'AUTHORITY') return '/authority';
    if (role === 'ADMIN') return '/admin';
    return '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      const res = await api.post('http://localhost:8080/api/auth/login', { email, password });
      
      // backend should return: { token, role, id, name, email }
      const { token, role, id, name, email: userEmail } = res.data;

      if (!token || !id) {
        setErr('Login failed: token or user id missing in response');
        setLoading(false);
        return;
      }

      // Save everything in localStorage
      setAuth(token, role, id, name, userEmail);

      localStorage.setItem("userId", id);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      setLoading(false);
      toast('Login successful ✅');
      navigate(routeByRole(role));
    } catch (error) {
      setLoading(false);
      console.error(error);
      const msg = error?.response?.data || error.message;
      setErr(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="login-h2">Login to <span>TrackItRight⚡</span></h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="login-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {err && <div className="error">{err}</div>}

          <div className="form-actions">
            <button className="btn login-buttons" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              className="btn-outline login-buttons"
              onClick={() => navigate('/register')}
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
