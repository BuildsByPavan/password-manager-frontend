import React, { useState } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import MainApp from './components/MainApp';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div className="container">
      {!token ? (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      ) : (
        <MainApp token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;