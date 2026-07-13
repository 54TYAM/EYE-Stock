import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Activity, User, Sparkles } from 'lucide-react';
import EyeLogo from './EyeLogo';
import './MainLayout.css';

export default function MainLayout({ children }) {
  const location = useLocation();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const downloadRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setIsDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="main-layout">
      {/* Top Navbar */}
      <header className="top-navbar no-print">
        <NavLink to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">
            <EyeLogo />
          </div>
          <span className="logo-text">EYE Stock</span>
        </NavLink>

        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive && location.pathname === '/' ? 'active' : ''}`}>
            HOME
          </NavLink>

          <NavLink to="/results" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            INTELLIGENCE
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            ABOUT
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <div className="download-dropdown-container" ref={downloadRef}>
            <button
              className="download-btn"
              onClick={() => setIsDownloadOpen(!isDownloadOpen)}
            >
              DOWNLOAD FOR FREE
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', transform: isDownloadOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="m18 15-6-6-6 6" />
              </svg>
            </button>

            {isDownloadOpen && (
              <div className="download-dropdown-menu">
                <div className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-82.5 102.7-119.3-65.2-30.7-61.7-90-61.8-91.3zM250.8 131.5c18.6-21.5 31.5-52.8 28.1-83.5-27.1 1.1-59.5 18-78.3 39.8-16.1 18.6-30.9 50.8-26.9 80.8 30.1 2.3 60.1-16.2 77.1-37.1z" /></svg>
                  <div className="dropdown-text">
                    <span className="dropdown-title">Get for Mac</span>
                  </div>
                  <span className="badge-soon">Soon</span>
                </div>
                <div className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 448 512" fill="currentColor"><path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" /></svg>
                  <div className="dropdown-text">
                    <span className="dropdown-title">Get for Windows</span>
                  </div>
                  <span className="badge-soon">Soon</span>
                </div>
                <div className="dropdown-item">
                  <svg className="dropdown-icon" viewBox="0 0 448 512" fill="currentColor"><path d="M212.1 4.7c-50.6 21-87 63.8-100.8 116.4-13.6 51.9-12.8 108.8 5.6 156 12 30.9 29.4 60.1 52.6 84.7 12 12.8 25.1 24.3 39.8 33.7 9.8 6.3 20.3 11.4 31.4 15.1 18.9 6.3 39.3 8.3 59.2 5.5 20.4-2.8 39.8-10.6 56.6-22.3 16.2-11.2 30-25.5 40.5-41.9 10.9-17 18.4-35.8 22-55.5 3.7-20.2 4-41 1.2-61.2-2.9-20.5-9.3-40.4-18.7-58.7-9.1-17.8-21-34.1-35.1-48.1-14.8-14.8-31.9-27.1-50.6-36.2-23.7-11.5-49.8-17.4-76.3-17.4h-29.5zm55.3 168.4c17.5 0 31.7 14.2 31.7 31.7s-14.2 31.7-31.7 31.7-31.7-14.2-31.7-31.7 14.2-31.7 31.7-31.7zm-99.3 0c17.5 0 31.7 14.2 31.7 31.7s-14.2 31.7-31.7 31.7-31.7-14.2-31.7-31.7 14.2-31.7 31.7-31.7zm49.7 75.3c15.6.1 27.2 4.1 36.1 9.5 4.5 2.7 8.3 5.8 11.8 9.3 3.4 3.5 6.4 7.2 9 11.4 5.3 8.3 9.4 17.5 11.6 27.6 2.2 10.1 2.5 20.9.1 31.7-2.4 10.8-7.7 21.5-16.1 31-8.3 9.5-19.8 17.7-34.6 23.3-14.7 5.7-32.9 8.6-54.8 8.6-21.9 0-40.1-2.9-54.8-8.6-14.8-5.7-26.3-13.8-34.6-23.3-8.4-9.5-13.7-20.2-16.1-31-2.4-10.8-2.1-21.6.1-31.7 2.2-10.1 6.3-19.3 11.6-27.6 2.6-4.2 5.6-7.9 9-11.4 3.4-3.5 7.2-6.6 11.8-9.3 8.9-5.4 20.5-9.4 36.1-9.5zM224 286.7c-9 0-16.4 7.4-16.4 16.4s7.4 16.4 16.4 16.4 16.4-7.4 16.4-16.4-7.4-16.4-16.4-16.4z" /></svg>
                  <div className="dropdown-text">
                    <span className="dropdown-title">Get for Linux</span>
                  </div>
                  <span className="badge-soon">Soon</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }} ref={profileRef}>
            <div className="user-avatar" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <svg width="18" height="18" viewBox="0 0 448 512" fill="#ffffff">
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/>
              </svg>
            </div>
            {isProfileOpen && (
              <div className="speech-bubble">
                Coming soon!
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-scrollable">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Dock */}
      <nav className="mobile-dock no-print">
        <NavLink to="/" className={({ isActive }) => `dock-item ${isActive && location.pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span className="dock-label">Home</span>
        </NavLink>
        <NavLink to="/results" className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}>
          <Compass size={20} />
          <span className="dock-label">Intell</span>
        </NavLink>
      </nav>
    </div>
  );
}
