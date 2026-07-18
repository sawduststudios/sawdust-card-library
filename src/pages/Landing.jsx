import { Link } from 'react-router-dom';
import WiggleLink from '../components/WiggleLink';

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

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
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

      {/* Cursed but UX-friendly links */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: '#FF0000', borderBottom: '2px dashed #000', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>
          Alternativní cesty k vaší sbírce karet:
        </h2>
        
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>
          <Link to="/vyvolat" className="blink" style={{ 
            display: 'inline-block',
            transform: 'rotate(-3deg)',
            padding: '1rem', 
            backgroundColor: '#FF00FF', 
            border: '8px dotted #FFFF00', 
            textDecoration: 'none', 
            color: '#000',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            boxShadow: '8px 8px 0px #000',
            maxWidth: '90vw',
            boxSizing: 'border-box'
          }}>
            🎲 RITUÁL VYVOLÁNÍ
          </Link>

          <WiggleLink to="/seznamka" baseRot={2} style={{ 
            display: 'inline-block',
            padding: '1.2rem', 
            backgroundColor: '#000', 
            border: '4px solid #00FF00', 
            textDecoration: 'underline wavy #FF0000', 
            color: '#00FF00',
            fontWeight: 'bold',
            fontSize: '1.6rem',
            textShadow: '2px 2px #FF0000',
            maxWidth: '90vw',
            boxSizing: 'border-box'
          }}>
            🧪 ZAKÁZANÉ ZBOŽÍ
          </WiggleLink>
        </div>
      </div>

      <div style={{ marginTop: '4rem', borderTop: '4px double #FF0000', paddingTop: '1rem', color: '#008000', fontWeight: 'bold' }}>
        <p>Tento web neobsahuje žádné sledovací prvky ještěrů z pekel.</p>
        <p>Doporučujeme rozlišení 800x600.</p>
      </div>
    </div>
  );
}
