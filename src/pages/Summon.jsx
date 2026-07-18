import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../../data/cards.json';
import './Summon.css';

const images = import.meta.glob('../../images/*', { eager: true, import: 'default' });

const RARITY_COLORS = {
  legendary: '#ffd700',
  rare: '#87cefa',
  common: '#e0e0e0'
};

const EXIT_MESSAGES = [
  "PÁN PILIN TĚ SLEDUJE... A NENÍ SPOKOJEN.",
  "ZAVÍRÁM BRÁNY DO ASTRÁLU! (Chyba: Nedostatek Víry)",
  "ODPOJUJI OD MATRIXU... 010101",
  "SBOHEM, ZBABĚLČE! UTÍKÁŠ Z BOJE?!",
  "VESMÍRNÍ LIDÉ TĚ ODMÍTAJÍ!",
  "SYSTÉM BYL ZKOMPROMITOVÁN JEŠTĚRY Z PEKEL!",
  "AŠTAR ŠERAN TI ZAKAZUJE PŘÍSTUP."
];

export default function Summon() {
  const navigate = useNavigate();
  const [summonState, setSummonState] = useState('idle'); // 'idle', 'shuffling', 'revealed', 'discarding', 'exiting'
  const [currentCard, setCurrentCard] = useState(null);
  const [particles, setParticles] = useState([]);
  const [exitMessage, setExitMessage] = useState('');

  // Generate random particles
  const generateParticles = () => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDelay: Math.random() * 0.5 + 's',
      backgroundColor: ['#00FF00', '#FF00FF', '#00FFFF', '#FFFF00'][Math.floor(Math.random() * 4)]
    }));
  };

  const startRitual = () => {
    setSummonState('shuffling');
    setParticles(generateParticles());

    // Rapidly switch cards
    const shuffleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * data.cards.length);
      setCurrentCard(data.cards[randomIndex]);
    }, 100);

    // Stop after 3 seconds
    setTimeout(() => {
      clearInterval(shuffleInterval);
      const finalIndex = Math.floor(Math.random() * data.cards.length);
      setCurrentCard(data.cards[finalIndex]);
      setSummonState('revealed');
      setParticles([]); // clear particles
    }, 3000);
  };

  const handleDiscard = () => {
    setSummonState('discarding');
    setTimeout(() => {
      startRitual(); // Immediately jump back into shuffling after discard animation finishes
    }, 500); 
  };

  const handleExit = () => {
    const msg = EXIT_MESSAGES[Math.floor(Math.random() * EXIT_MESSAGES.length)];
    setExitMessage(msg);
    setSummonState('exiting');
    setTimeout(() => {
      navigate('/kartoteka');
    }, 2000); // Redirect after crazy exit animation
  };

  if (summonState === 'exiting') {
    return (
      <div className="summon-exit-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="blink" style={{ fontSize: '5rem', color: '#FFFFFF', textShadow: '5px 5px #000000', margin: '2rem', textAlign: 'center', textTransform: 'uppercase' }}>
          {exitMessage}
        </h1>
      </div>
    );
  }

  return (
    <div 
      className={summonState === 'shuffling' ? 'summoning-shake flashing-bg' : ''}
      style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Particles layer */}
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle" 
          style={{ left: p.left, top: p.top, animationDelay: p.animationDelay, backgroundColor: p.backgroundColor }} 
        />
      ))}

      {summonState === 'idle' && (
        <div style={{ textAlign: 'center' }}>
          <h1 className="blink" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: '#FF0000', textShadow: '4px 4px #FFFF00' }}>
            RITUÁL VYVOLÁNÍ
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 5vw, 1.5rem)', fontWeight: 'bold', color: '#0000FF', maxWidth: '600px', margin: '1rem auto 2rem auto' }}>
            Jste připraveni poměřit své síly s ostatními? Spojte svou mysl s vesmírnou energií.
          </p>
          <button 
            onClick={startRitual}
            style={{ 
              fontSize: 'clamp(1.5rem, 6vw, 2rem)', 
              padding: '1rem 2rem', 
              backgroundColor: '#00FF00', 
              color: '#FF0000', 
              border: '8px outset #FF00FF', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'inherit'
            }}
          >
            ZAHÁJIT TAŽENÍ
          </button>
        </div>
      )}

      {summonState === 'shuffling' && currentCard && (
        <div style={{ textAlign: 'center', pointerEvents: 'none', width: '100%', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 12vw, 4rem)', color: '#FFFFFF', textShadow: '0 0 10px #000000', margin: 0, wordBreak: 'break-word', lineHeight: '1.1' }}>
            {currentCard.name.toUpperCase()}!!!
          </h2>
          <div style={{ fontSize: 'clamp(1.2rem, 5vw, 2rem)', color: '#00FF00', backgroundColor: '#0000FF', padding: '1rem', marginTop: '2rem', border: '5px dashed #FFFF00' }}>
            HLEDÁNÍ VE SPIRITUÁLNÍ DIMENZI...
          </div>
        </div>
      )}

      {(summonState === 'revealed' || summonState === 'discarding') && currentCard && (
        <div className={summonState === 'discarding' ? 'summon-discard' : 'summon-reveal'} style={{ textAlign: 'center', width: '100%', maxWidth: '500px', padding: '0 0.5rem', boxSizing: 'border-box' }}>
          <h2 className="blink" style={{ fontSize: '1.2rem', color: '#FF0000', textShadow: '1px 1px #FFFF00', margin: '0 0 0.5rem 0' }}>
            TVŮJ OSUD JE ZPEČETĚN!
          </h2>
          
          <div style={{ backgroundColor: '#FFFFFF', border: '6px ridge #FF0000', padding: '0.5rem', marginBottom: '1rem' }}>
            {currentCard.image && images[`../../${currentCard.image}`] ? (
              <img 
                src={images[`../../${currentCard.image}`]} 
                alt={currentCard.name} 
                style={{ width: '100%', border: '4px solid #0000FF' }} 
              />
            ) : (
              <div style={{ width: '100%', aspectRatio: '2.5/3.5', backgroundColor: '#C0C0C0', border: '4px solid #0000FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#FF0000' }}>
                BEZ OBRÁZKU
              </div>
            )}
            
            <h1 style={{ margin: '0.5rem 0 0.25rem 0', color: '#0000FF', textTransform: 'uppercase', fontSize: '1.5rem', wordBreak: 'break-word', lineHeight: '1.1' }}>{currentCard.name}</h1>
            <div style={{ 
              display: 'inline-block',
              backgroundColor: RARITY_COLORS[currentCard.rarity] || '#ccc', 
              padding: '2px 8px', 
              border: '3px inset #fff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.9rem'
            }}>
              {currentCard.rarity} • {currentCard.class.replace('-', ' ')}
            </div>

            <div style={{ backgroundColor: '#FFFF00', padding: '0.25rem', border: '3px solid #FF0000', marginTop: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '1rem', fontWeight: 'bold' }}>
                <div style={{ color: '#0000FF' }}>ATK: <span style={{ color: '#FF0000' }}>{currentCard.stats?.attack ?? '-'}</span></div>
                <div style={{ color: '#0000FF' }}>DEF: <span style={{ color: '#FF0000' }}>{currentCard.stats?.defense ?? '-'}</span></div>
                <div style={{ color: '#0000FF' }}>HP: <span style={{ color: '#FF0000' }}>{currentCard.stats?.hp ?? '-'}</span></div>
                <div style={{ color: '#0000FF' }}>PWR: <span style={{ color: '#FF0000' }}>{currentCard.powerLevel}</span></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={handleDiscard}
              disabled={summonState === 'discarding'}
              style={{ padding: '1rem', backgroundColor: '#00FF00', color: '#0000FF', border: '6px outset #FFFFFF', fontWeight: 'bold', fontSize: '1.2rem', cursor: summonState === 'discarding' ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
            >
              TAHAT ZNOVU
            </button>
            <button 
              onClick={handleExit}
              disabled={summonState === 'discarding'}
              style={{ padding: '1rem', backgroundColor: '#FF0000', color: '#FFFF00', border: '6px outset #000000', fontWeight: 'bold', fontSize: '1.2rem', cursor: summonState === 'discarding' ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
            >
              UKONČIT RITUÁL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
