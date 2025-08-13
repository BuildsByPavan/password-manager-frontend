import React from 'react';

const CredentialForm = ({ formData, onChange, onSubmit, editingId, onCancel, loading }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Enter URL"
        value={formData.title}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={onChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="notes"
        placeholder="Notes (Optional)"
        value={formData.notes}
        onChange={onChange}
      />
      <button type="submit" disabled={loading}>
        {editingId ? 'Update' : 'Save'}
      </button>
      {editingId && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{ backgroundColor: 'rgb(193, 42, 42)' }}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default CredentialForm;