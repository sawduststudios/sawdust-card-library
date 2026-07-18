import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
      <h1>Svatyně Pilin</h1>
      <p>Vítej, poutníku. Vyber si cestu k osvícení, kterou ti zjevili Sons of Sawdust.</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
        <Link to="/kartoteka" style={{ padding: '2rem', border: '4px dashed black', backgroundColor: '#f0f0f0', textDecoration: 'none', color: 'black', width: '80%', maxWidth: '300px' }}>
          <h2 style={{ margin: 0 }}>🚪 Kartotéka</h2>
        </Link>
        <Link to="/texty" style={{ padding: '2rem', border: '4px dashed black', backgroundColor: '#f0f0f0', textDecoration: 'none', color: 'black', width: '80%', maxWidth: '300px' }}>
          <h2 style={{ margin: 0 }}>🚪 Texty</h2>
        </Link>
      </div>
      <footer style={{ marginTop: '4rem', fontSize: '0.8rem', fontWeight: 'bold' }}>Powered by FAITH</footer>
    </div>
  );
}
