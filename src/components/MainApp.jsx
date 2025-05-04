import React, { useState, useEffect } from 'react';
import Header from './Header';
import CredentialForm from './CredentialForm';
import CredentialCard from './CredentialCard';

const MainApp = ({ token, onLogout }) => {
  const [credentials, setCredentials] = useState([]);
  const [formData, setFormData] = useState({ title: '', username: '', password: '', notes: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCredentials();
  }, []);

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
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <Header onLogout={onLogout} />
      <CredentialForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editingId={editingId}
        onCancel={() => {
          setFormData({ title: '', username: '', password: '', notes: '' });
          setEditingId(null);
        }}
        loading={loading}
      />
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
    </div>
  );
};

export default MainApp;