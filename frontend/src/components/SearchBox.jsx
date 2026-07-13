import { useState } from 'react';

export default function SearchBox({ onSubmit, disabled }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSubmit(query.trim());
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Enter a company name (e.g., Tesla)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          autoFocus
        />
        <button type="submit" className="search-btn" disabled={disabled || !query.trim()}>
          {disabled ? <span className="spinner" /> : 'Analyze'}
        </button>
      </form>
    </div>
  );
}
