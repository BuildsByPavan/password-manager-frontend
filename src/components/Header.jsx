import React from 'react';

const Header = ({ token, onLogout }) => {
  const SecurityIcon = () => (
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
  );

  return (
    <header>
      <h1>
        <SecurityIcon />
        <span className="animate-title">Password Manager</span>
      

      {token && (
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      )}</h1>
    </header>
  );
};

export default Header;
