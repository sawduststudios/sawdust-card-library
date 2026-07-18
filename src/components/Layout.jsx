import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  const getNavStyle = ({ isActive }, isHome = false) => ({
    padding: '0.5rem 1rem',
    border: isActive ? '3px inset #FF0000' : '3px outset #ccc',
    backgroundColor: isActive ? '#FFFF00' : '#e0e0e0',
    textDecoration: 'none',
    fontWeight: 'bold',
    color: isActive ? '#FF0000' : '#0000FF',
    transform: isActive ? 'scale(1.05)' : 'none'
  });

  return (
    <div className="rainbow-border" style={{ maxWidth: '800px', margin: '2rem auto', backgroundColor: '#FFFFFF' }}>
      <nav className="no-print" style={{ padding: '1rem', borderBottom: '4px ridge #FF0000', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', backgroundColor: '#FFFFCC', alignItems: 'center' }}>
        <NavLink to="/" style={(props) => getNavStyle(props, true)}>Svatyně Pilin</NavLink>
        
        {/* Visual separator */}
        <div style={{ width: '4px', height: '30px', backgroundColor: '#FF0000', borderRight: '2px solid #000', margin: '0 1rem' }}></div>
        
        <NavLink to="/kartoteka" style={getNavStyle}>Kartotéka</NavLink>
        <NavLink to="/texty" style={getNavStyle}>Texty</NavLink>
      </nav>
      <main style={{ padding: '1rem', textAlign: 'center' }}>
        <Outlet />
      </main>
    </div>
  );
}
