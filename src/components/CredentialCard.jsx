import React, { useState } from 'react';
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

export default CredentialCard;