import React, { useState, useEffect } from 'react';

const AuthForm = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthForm({ email: '', username: '', password: '' });
    setError('');
  }, [authMode]);

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const submitAuthForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const endpoint = authMode === 'login' ? 'login' : 'register';
    try {
      const res = await fetch(`https://password-manager-backend-01z7.onrender.com/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (authMode === 'login') {
        if (data.token) {
          onAuthSuccess(data.token);
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        if (data.error) {
          setError(data.error);
        } else {
          setAuthMode('login');
          setAuthForm({ email: '', username: '', password: '' });
        }
      }
    } catch (error) {
      setError('Authentication error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <h2>{authMode === 'login' ? 'Welcome, back' : 'Welcome'}</h2>
      <form onSubmit={submitAuthForm}>
        {authMode === 'register' && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={authForm.username}
            onChange={handleAuthChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={authForm.email}
          onChange={handleAuthChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={authForm.password}
          onChange={handleAuthChange}
          required
        />
        <button type="submit" disabled={loading}>
          {authMode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      <p
        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        className="toggle-auth"
      >
        {authMode === 'login' ? 'Need to register?' : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default AuthForm;