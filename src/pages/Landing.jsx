import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ padding: '2rem 1rem' }}>
      <marquee scrollamount="12" style={{ color: '#008000', fontSize: '1.5rem', fontWeight: 'bold', border: '2px dashed #008000', marginBottom: '2rem' }}>
        +++ VÍTEJTE VE SVATYNI PILIN +++ NEVĚŘTE LŽÍM SYSTÉMU +++ OTEVŘETE SVOU MYSL +++
      </marquee>
      
      <h1 className="blink" style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>Svatyně Pilin</h1>
      <p style={{ fontSize: '1.2rem', color: '#0000FF', fontWeight: 'bold', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.5' }}>
        Toto je <span style={{ color: '#FF0000' }}>jediné pravé místo</span> pro uchování vědomostí. 
        Karty z našich koncertů nesou <span style={{ textDecoration: 'underline' }}>vesmírnou energii</span>.
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
        <Link to="/kartoteka" style={{ 
          display: 'block', 
          padding: '2rem', 
          backgroundColor: '#FFFF00', 
          border: '6px outset #FFCC00', 
          textDecoration: 'none', 
          color: '#FF0000',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          width: '250px'
        }}>
          🗄️ KARTOTÉKA<br/>
          <span style={{ fontSize: '1rem', color: '#0000FF' }}>(Katalog karet)</span>
        </Link>

        <Link to="/texty" style={{ 
          display: 'block', 
          padding: '2rem', 
          backgroundColor: '#00FFFF', 
          border: '6px outset #00CCCC', 
          textDecoration: 'none', 
          color: '#FF0000',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          width: '250px'
        }}>
          🎤 TEXTY<br/>
          <span style={{ fontSize: '1rem', color: '#0000FF' }}>(Chvalozpěvy)</span>
        </Link>
      </div>

      <div style={{ marginTop: '4rem', borderTop: '4px double #FF0000', paddingTop: '1rem', color: '#008000', fontWeight: 'bold' }}>
        <p>Tento web neobsahuje žádné sledovací prvky ještěrů z pekel.</p>
        <p>Doporučujeme rozlišení 800x600.</p>
      </div>
    </div>
  );
}
