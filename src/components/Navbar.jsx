import React, { useState, useEffect } from 'react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeProfile, 
  onSwitchProfile, 
  isMusicPlaying, 
  onToggleMusic 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'timeline', label: 'Our Timeline' },
    { id: 'planner', label: 'Date Planner' },
    { id: 'vault', label: 'Memory Vault' },
    { id: 'letter', label: 'Secret Letter' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-left">
        <button 
          onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }} 
          className="nav-logo"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          COUPLE<span style={{ color: '#fff' }}>FLIX</span>
        </button>
        <ul className="nav-links">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button 
                onClick={() => setActiveTab(tab.id)} 
                className={`nav-link-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="nav-right">
        {/* Background Music Toggler */}
        <button 
          onClick={onToggleMusic} 
          title={isMusicPlaying ? 'Mute Music' : 'Play Music'}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isMusicPlaying ? (
            /* Speaker Icon Waves */
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303zm-2.828-2.828A5.48 5.48 0 0 0 10.025 8a5.48 5.48 0 0 0-1.317-3.782l-.707.707A4.48 4.48 0 0 1 9.025 8a4.48 4.48 0 0 1-1.025 2.91l.707.708z"/>
              <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
            </svg>
          ) : (
            /* Mute Speaker Icon */
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
            </svg>
          )}
        </button>

        {/* Profile Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="nav-profile-trigger" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              backgroundColor: activeProfile.avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              userSelect: 'none'
            }}>
              {activeProfile.emoji}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }} className="hidden-mobile">
              {activeProfile.name}
            </span>
            <svg width="10" height="6" fill="currentColor" viewBox="0 0 10 6" style={{
              transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
              marginLeft: '2px'
            }}>
              <path d="M0 0l5 5 5-5z"/>
            </svg>
          </button>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid #333',
              borderRadius: '4px',
              width: '160px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100,
              boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}>
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  onSwitchProfile();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.2s ease',
                  borderBottom: '1px solid #222'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Switch Profiles
              </button>
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  setActiveTab('letter');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Secret Lockbox
              </button>
            </div>
          )}
        </div>

        {/* Hamburger menu button for mobile screens */}
        <button 
          className="nav-hamburger" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          ) : (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4c0-.28.225-.5.5-.5h10a.5.5 0 0 1 0 1H3c-.275 0-.5-.22-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Links Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-menu">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMobileMenuOpen(false);
              }} 
              className={`mobile-nav-link-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
