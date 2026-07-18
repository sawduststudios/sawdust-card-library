import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="rainbow-border" style={{ maxWidth: '800px', margin: '2rem auto', backgroundColor: '#FFFFFF' }}>
      <nav className="no-print" style={{ padding: '1rem', borderBottom: '4px ridge #FF0000', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', backgroundColor: '#FFFFCC' }}>
        <Link to="/" style={{ padding: '0.5rem 1rem', border: '3px outset #ccc', backgroundColor: '#e0e0e0', textDecoration: 'none', fontWeight: 'bold', color: '#0000FF' }}>Svatyně Pilin</Link>
        <Link to="/kartoteka" style={{ padding: '0.5rem 1rem', border: '3px outset #ccc', backgroundColor: '#e0e0e0', textDecoration: 'none', fontWeight: 'bold', color: '#0000FF' }}>Kartotéka</Link>
        <Link to="/texty" style={{ padding: '0.5rem 1rem', border: '3px outset #ccc', backgroundColor: '#e0e0e0', textDecoration: 'none', fontWeight: 'bold', color: '#0000FF' }}>Texty</Link>
        <Link to="/vyvolat" className="blink" style={{ padding: '0.5rem 1rem', border: '3px outset #FF00FF', backgroundColor: '#FFFF00', textDecoration: 'none', fontWeight: 'bold', color: '#FF0000' }}>🎲 RITUÁL VYVOLÁNÍ</Link>
        <Link to="/seznamka" className="blink" style={{ padding: '0.5rem 1rem', border: '3px outset #00FF00', backgroundColor: '#000000', textDecoration: 'none', fontWeight: 'bold', color: '#00FF00' }}>🧪 ZAKÁZANÉ ZBOŽÍ</Link>
      </nav>
      <main style={{ padding: '1rem', textAlign: 'center' }}>
        <Outlet />
      </main>
    </div>
  );
}
