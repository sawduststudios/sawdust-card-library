import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem', backgroundColor: '#f9f9f9' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>🏠 Svatyně</Link>
        <Link to="/kartoteka" style={{ textDecoration: 'none', color: 'black' }}>Kartotéka</Link>
        <Link to="/texty" style={{ textDecoration: 'none', color: 'black' }}>Texty</Link>
      </nav>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
