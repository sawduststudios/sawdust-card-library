import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <nav className="no-print" style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>Svatyně Pilin</Link>
        <Link to="/kartoteka" style={{ textDecoration: 'none', color: '#666' }}>Kartotéka</Link>
        <Link to="/texty" style={{ textDecoration: 'none', color: '#666' }}>Texty</Link>
      </nav>
      <main style={{ padding: '0 1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
