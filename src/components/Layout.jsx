import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const [isModesOpen, setIsModesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  const isModeActive = ['/vyvolat', '/seznamka', '/duel'].includes(location.pathname);
  const showModes = location.pathname.startsWith('/kartoteka') || isModeActive;

  useEffect(() => {
    setIsModesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavStyle = ({ isActive }) => ({
    padding: '0.35rem 0.6rem',
    border: isActive ? '3px inset #FF0000' : '3px outset #ccc',
    backgroundColor: isActive ? '#FFFF00' : '#e0e0e0',
    textDecoration: 'none',
    fontWeight: 'bold',
    color: isActive ? '#FF0000' : '#0000FF',
    fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)',
    whiteSpace: 'nowrap'
  });

  return (
    <div className="rainbow-border" style={{ maxWidth: '800px', margin: '1rem auto', backgroundColor: '#FFFFFF' }}>
      <header className="no-print" style={{ backgroundColor: '#000000', color: '#FFFF00', padding: '0.35rem 0.5rem', fontSize: 'clamp(0.75rem, 3vw, 0.9rem)', fontWeight: 'bold', letterSpacing: '1px', textAlign: 'center', borderBottom: '2px solid #FF0000' }}>
        🪚 SAW THE DUST GAME — SONS OF SAWDUST 🪚
      </header>
      <nav className="no-print" style={{ padding: '0.4rem', borderBottom: '4px ridge #FF0000', display: 'flex', flexWrap: 'nowrap', gap: '0.35rem', justifyContent: 'center', backgroundColor: '#FFFFCC', alignItems: 'center' }}>
        <NavLink to="/" style={getNavStyle} end>Svatyně</NavLink>
        <NavLink to="/kartoteka" style={getNavStyle}>Kartotéka</NavLink>
        <NavLink to="/texty" style={getNavStyle}>Texty</NavLink>
        
        {/* Modes Dropdown - only visible in Kartotéka / Modes */}
        {showModes && (
          <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              onClick={() => setIsModesOpen(!isModesOpen)}
              style={{
                padding: '0.35rem 0.6rem',
                border: (isModesOpen || isModeActive) ? '3px inset #FF0000' : '3px outset #ccc',
                backgroundColor: (isModesOpen || isModeActive) ? '#FFCC00' : '#e0e0e0',
                fontWeight: 'bold',
                color: (isModesOpen || isModeActive) ? '#FF0000' : '#0000FF',
                fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              🎮 Módy {isModesOpen ? '▲' : '▼'}
            </button>

            {isModesOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: '#FFFFCC',
                border: '4px ridge #FF0000',
                boxShadow: '6px 6px 0px #000',
                zIndex: 1000,
                minWidth: '180px',
                display: 'flex',
                flexDirection: 'column',
                padding: '0.5rem',
                gap: '0.4rem',
                marginTop: '4px'
              }}>
                <Link to="/vyvolat" style={{ padding: '0.4rem', backgroundColor: '#FF00FF', color: '#000', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', border: '2px dotted #FFFF00' }}>
                  🎲 Rituál vyvolání
                </Link>
                <Link to="/seznamka" style={{ padding: '0.4rem', backgroundColor: '#000', color: '#00FF00', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', border: '2px solid #00FF00' }}>
                  🧪 Zakázané zboží
                </Link>
                <Link to="/duel" style={{ padding: '0.4rem', backgroundColor: '#FF0000', color: '#FFFF00', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', border: '2px ridge #000' }}>
                  🤠 Souboj víry
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
      <main style={{ padding: '1rem', textAlign: 'center' }}>
        <Outlet />
      </main>
    </div>
  );
}
