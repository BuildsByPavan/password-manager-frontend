import React, { useState, useEffect } from 'react';
import './App.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CredentialCard = ({ cred, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="card">
      <h3>{cred.title}</h3>
      <p>
        <strong>Username:</strong> {cred.username}
      </p>
      <p>
        <strong>Password:</strong> {showPassword ? cred.password : '********'}
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{ marginLeft: '10px', cursor: 'pointer' }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </p>
      {cred.notes && <p><strong>Notes:</strong> {cred.notes}</p>}
      <div className="card-actions">
        <button onClick={() => onEdit(cred)} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(cred._id)} className="delete-btn">Delete</button>
      </div>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  const [credentials, setCredentials] = useState([]);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authForm, setAuthForm] = useState({ email: '', username: '', password: '' });
  const [formData, setFormData] = useState({ title: '', username: '', password: '', notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCredentials();
    }
  }, [token]);

  useEffect(() => {
    // Reset the registration/login form on mode change.
    setAuthForm({ email: '', username: '', password: '' });
    setError('');
  }, [authMode]);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://password-manager-backend-01z7.onrender.com/api/credentials', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch credentials');
      const data = await res.json();
      setCredentials(data);
    } catch (error) {
      setError('Error fetching credentials: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const submitAuthForm = async (e) => {
    e.preventDefault();
    setLoading(true);
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
          localStorage.setItem('token', data.token);
          setToken(data.token);
         
          setError('');
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        // For registration mode, handle duplicate email errors.
        if (data.error) {
          setError(data.error);
        } else {
          setError('');
          setAuthMode('login');
          setAuthForm({ email: '', username: '', password: '' });
          // Optionally, display a UI message indicating successful registration.
        }
      }
    } catch (error) {
      setError('Authentication error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
   
    setCredentials([]);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId
      ? `https://password-manager-backend-01z7.onrender.com/api/credentials/${editingId}`
      : 'https://password-manager-backend-01z7.onrender.com/api/credentials';
    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to save credential');
      await fetchCredentials();
      setFormData({ title: '', username: '', password: '', notes: '' });
      setEditingId(null);
      setError('');
    } catch (error) {
      setError('Error saving credential: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cred) => {
    setFormData({
      title: cred.title,
      username: cred.username,
      password: cred.password,
      notes: cred.notes,
    });
    setEditingId(cred._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`https://password-manager-backend-01z7.onrender.com/api/credentials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete credential');
      setCredentials(credentials.filter(cred => cred._id !== id));
      setError('');
    } catch (error) {
      setError('Error deleting credential: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!token ? (
        <div className="auth-container">
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
      ) : (
        <>
          <header>
            <h1>
              <span className="security-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="40"
                  height="40"
                  fill="#66d9ef"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Security Icon</title>
                  <path d="M12 2C9.243 2 7 4.243 7 7v4H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2a3 3 0 013 3v4H9V7a3 3 0 013-3zm6 8v9H6v-9h12z" />
                </svg>
              </span>
              <span className="animate-title">Password Manager</span>
            </h1>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </header>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes (Optional)"
              value={formData.notes}
              onChange={handleChange}
            />
            <button type="submit" disabled={loading}>
              {editingId ? 'Update' : 'Save'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({ title: '', username: '', password: '', notes: '' });
                  setEditingId(null);
                }}
                disabled={loading} style={{backgroundColor:'rgb(193, 42, 42)'}}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="credentials">
            {credentials.map((cred) => (
              <CredentialCard
                key={cred._id}
                cred={cred}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
