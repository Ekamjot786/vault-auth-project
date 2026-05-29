import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INITIAL_PW = { old_password: '', new_password: '', new_password2: '' };

export default function Dashboard() {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();

  const [pwForm, setPwForm]   = useState(INITIAL_PW);
  const [pwError, setPwError] = useState('');
  const [pwOk, setPwOk]       = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handlePw = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const submitPw = async (e) => {
    e.preventDefault();
    setPwError(''); setPwOk('');
    if (pwForm.new_password !== pwForm.new_password2) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(pwForm);
      setPwOk('Password changed! Please log in again.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const key = Object.keys(data)[0];
        setPwError(Array.isArray(data[key]) ? data[key][0] : data[key]);
      } else {
        setPwError('Could not change password.');
      }
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user
    ? ((user.first_name?.[0] || '') + (user.last_name?.[0] || '') || user.username[0]).toUpperCase()
    : '?';

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">VAULT</div>
        <div className="navbar-actions">
          <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
            Hi, <strong style={{ color: 'var(--text)' }}>{user?.username}</strong>
          </span>
          <button className="btn-ghost" onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Welcome card */}
        <div className="welcome-card">
          <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', marginBottom:'1rem' }}>
            <div style={{
              width:56, height:56, borderRadius:'50%',
              background:'linear-gradient(135deg,var(--accent),var(--accent3))',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.4rem', flexShrink:0,
            }}>
              {initials}
            </div>
            <div>
              <h2>
                Welcome back{user?.first_name ? `, ${user.first_name}` : ''}!
              </h2>
              <p>You're securely signed in to your account.</p>
            </div>
          </div>
        </div>

        {/* Info tiles */}
        <div className="info-grid">
          {[
            { label: 'Username',   value: user?.username },
            { label: 'Email',      value: user?.email },
            { label: 'First Name', value: user?.first_name || '—' },
            { label: 'Last Name',  value: user?.last_name  || '—' },
            { label: 'Member Since', value: user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' })
                : '—' },
          ].map(({ label, value }) => (
            <div className="info-tile" key={label}>
              <div className="tile-label">{label}</div>
              <div className="tile-value">{value}</div>
            </div>
          ))}
        </div>

        {/* Change password */}
        <div className="change-pw-section">
          <h3>
            <span style={{ color:'var(--accent3)' }}>🔒</span> Change Password
            <button
              onClick={() => setShowPw(!showPw)}
              style={{
                marginLeft:'auto', background:'none', border:'1px solid var(--border)',
                color:'var(--muted)', borderRadius:8, padding:'.3rem .8rem',
                cursor:'pointer', fontSize:'.8rem', fontFamily:'inherit',
              }}
            >
              {showPw ? 'Hide' : 'Expand'}
            </button>
          </h3>

          {showPw && (
            <form onSubmit={submitPw}>
              {pwError && <div className="alert alert-error">{pwError}</div>}
              {pwOk    && <div className="alert alert-success">{pwOk}</div>}

              <div className="form-group">
                <label>Current Password</label>
                <input
                  name="old_password" type="password"
                  placeholder="Enter current password"
                  value={pwForm.old_password} onChange={handlePw} required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  name="new_password" type="password"
                  placeholder="Min 8 characters"
                  value={pwForm.new_password} onChange={handlePw} required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  name="new_password2" type="password"
                  placeholder="Repeat new password"
                  value={pwForm.new_password2} onChange={handlePw} required
                />
              </div>
              <button className="btn-primary" type="submit" disabled={pwLoading}
                style={{ maxWidth:220 }}>
                {pwLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
