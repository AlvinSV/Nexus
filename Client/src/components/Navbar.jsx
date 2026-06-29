import React from 'react';
import { UserButton } from '@clerk/clerk-react';

function Navbar({ searchQuery, setSearchQuery, theme, setTheme }) {
  return (
    <header className="app-header">
      <div className="logo-section" onClick={() => window.location.reload()}>
        <img src="/images/logo.jpg" alt="Nexus Logo" className="logo-img" />
        <div className="logo-text">nexus<span>.</span></div>
      </div>

      <div className="search-container">
        <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          placeholder="Search communities, posts or topics..." 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="auth-section">
        <button 
          className="theme-toggle-btn" 
          onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <UserButton showName={true} />
      </div>
    </header>
  );
}

export default Navbar;
