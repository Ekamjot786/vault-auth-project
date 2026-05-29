import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INITIAL = {
  username: '', email: '', first_name: '', last_name: '', password: '', password2: '',
};

export default function Register() {
  const { register }  = useAuth();
  const navigate      = useNavigate();
  const [form, setForm]       = useState(INITIAL);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        setError(Array.isArray(data[firstKey]) ? data[firstKey][0] : JSON.stringify(data));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="brand-grid" />
        <div className="brand-content">
          <div className="brand-logo">VAULT</div>
          <div className="brand-tagline">Secure Auth System</div>
          <div className="brand-orbs">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <h1>Create account</h1>
          <p className="subtitle">Join and get started today</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="form-group">
                <label>First Name</label>
                <input name="first_name" placeholder="First" value={form.first_name} onChange={handle} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="last_name" placeholder="Last" value={form.last_name} onChange={handle} />
              </div>
            </div>
            <div className="form-group">
              <label>Username *</label>
              <input name="username" placeholder="Choose a username" value={form.username} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" placeholder="Min 8 characters" value={form.password} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input name="password2" type="password" placeholder="Repeat password" value={form.password2} onChange={handle} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-link-row">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
