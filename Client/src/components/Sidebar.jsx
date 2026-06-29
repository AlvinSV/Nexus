import React from 'react';

function Sidebar({ onAboutClick, onHelpClick }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-panel">
        <h3 className="sidebar-title">Navigation</h3>
        <ul className="sidebar-menu">
          <li className="sidebar-item active">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home Feed
          </li>
          <li className="sidebar-item" onClick={onAboutClick}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About
          </li>
          <li className="sidebar-item" onClick={onHelpClick}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help
          </li>
        </ul>
      </div>

      <div className="sidebar-panel">
        <h3 className="sidebar-title">Trending Communities</h3>
        <ul className="sidebar-menu" style={{ marginBottom: '12px' }}>
          <li className="sidebar-item">
            <span className="community-icon" style={{ background: '#ff4500', color: 'white' }}>b</span>
            r/battlestations
          </li>
          <li className="sidebar-item">
            <span className="community-icon" style={{ background: '#8a2be2', color: 'white' }}>c</span>
            r/cooking
          </li>
          <li className="sidebar-item">
            <span className="community-icon" style={{ background: '#00d2c4', color: 'white' }}>n</span>
            r/nature
          </li>
          <li className="sidebar-item">
            <span className="community-icon" style={{ background: '#1da1f2', color: 'white' }}>t</span>
            r/technology
          </li>
        </ul>
        <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '13px' }}>
          Start a Community
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
