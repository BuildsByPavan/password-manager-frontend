import React, { useState } from 'react';
import './App.css';
import AuthForm from './components/AuthForm';
import MainApp from './components/MainApp';
import Header from './components/Header';

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
    <>
    <Header onLogout={handleLogout} token={token} />
    <div className="container">
      {!token ? (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      ) : (
        <MainApp token={token} onLogout={handleLogout} />
      )}
    </div></>
    
  );
}

export default App;