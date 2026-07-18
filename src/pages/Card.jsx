import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import data from '../../data/cards.json';
import { filterAndSortCards } from '../utils/filterCards';
import './Card.css';

const images = import.meta.glob('../../images/*', { eager: true, import: 'default' });

export default function Card() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const sortedCards = filterAndSortCards(data.cards, searchParams);
  const currentIndex = sortedCards.findIndex((c) => c.id === id);
  const card = currentIndex !== -1 ? sortedCards[currentIndex] : data.cards.find(c => c.id === id);

  const prevCard = currentIndex > 0 ? sortedCards[currentIndex - 1] : null;
  const nextCard = currentIndex >= 0 && currentIndex < sortedCards.length - 1 ? sortedCards[currentIndex + 1] : null;

  const backLink = searchParams.toString() ? `/kartoteka?${searchParams.toString()}` : '/kartoteka';

  const navigateTo = (targetId) => {
    if (targetId) {
      navigate(`/kartoteka/${targetId}?${searchParams.toString()}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && prevCard) navigateTo(prevCard.id);
      if (e.key === 'ArrowRight' && nextCard) navigateTo(nextCard.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevCard, nextCard, searchParams, navigate]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && nextCard) navigateTo(nextCard.id);
    if (isRightSwipe && prevCard) navigateTo(prevCard.id);
  };

  if (!card) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>Karta nenalezena! (404)</h2>
        <p>Tato karta ve svatých spisech neexistuje.</p>
        <Link to={backLink}>Zpět do Kartotéky</Link>
      </div>
    );
  }

  return (
    <article 
      onTouchStart={onTouchStart} 
      onTouchMove={onTouchMove} 
      onTouchEnd={onTouchEnd}
      style={{ maxWidth: '500px', margin: '0 auto', paddingBottom: '3rem', userSelect: 'none', position: 'relative' }}
    >
      <div className="no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={backLink} style={{ textDecoration: 'none', color: '#666' }}>← Zpět do Kartotéky</Link>
        <div style={{ fontSize: '0.9rem', color: '#999' }}>
          {currentIndex !== -1 ? `${currentIndex + 1} / ${sortedCards.length}` : 'Mimo filtr'}
        </div>
      </div>
      
      <div className="card-image-container">
        {prevCard && (
          <Link to={`/kartoteka/${prevCard.id}?${searchParams.toString()}`} className="nav-arrow left no-print" title="Předchozí karta">
            ←
          </Link>
        )}
        
        {card.image && images[`../../${card.image}`] && (
          <img 
            src={images[`../../${card.image}`]} 
            alt={card.name} 
            className="print-image"
            style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          />
        )}

        {nextCard && (
          <Link to={`/kartoteka/${nextCard.id}?${searchParams.toString()}`} className="nav-arrow right no-print" title="Další karta">
            →
          </Link>
        )}
      </div>

      <div className="swipe-hint no-print">
        ← Potažením listujte →
      </div>
      
      <div className="no-print" style={{ backgroundColor: '#FFFFFF', border: '6px outset #FFCC00', padding: '1rem', marginTop: '1rem' }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'center', borderBottom: '4px dashed #008000', paddingBottom: '1rem' }}>
          <h1 className="blink" style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', lineHeight: '1.2', color: '#FF0000', textShadow: '3px 3px 0px #FFFF00' }}>
            {card.name}
          </h1>
          <div style={{ fontSize: '1.2rem', color: '#0000FF', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: '#FFFFCC', display: 'inline-block', padding: '4px 12px', border: '3px inset #FFFFFF' }}>
            *** {card.rarity} • {card.class.replace('-', ' ')} ***
          </div>
        </div>

        {card.printCount !== null && (
          <div style={{ fontWeight: 'bold', color: '#FF0000', marginBottom: '1rem', textAlign: 'center', fontSize: '1.2rem' }}>
            VYTIŠTĚNO POUZE {card.printCount} KUSŮ NA CELÉM SVĚTĚ !!!
          </div>
        )}

        {card.releaseDate && (
          <div style={{ fontSize: '1rem', color: '#008000', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
            Zjeveno: {new Date(card.releaseDate).toLocaleDateString('cs-CZ')}
          </div>
        )}

        <div style={{ backgroundColor: '#FFFF00', padding: '1rem', border: '6px ridge #FF0000', marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, borderBottom: '4px double #FF0000', paddingBottom: '0.5rem', color: '#0000FF', textAlign: 'center', fontSize: '1.5rem' }}>!!! STATISTIKY !!!</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#008000' }}>
            <div style={{ border: '2px solid #0000FF', padding: '4px', backgroundColor: '#FFFFFF' }}><span style={{color:'#FF0000'}}>ATK:</span> {card.stats?.attack ?? '-'}</div>
            <div style={{ border: '2px solid #0000FF', padding: '4px', backgroundColor: '#FFFFFF' }}><span style={{color:'#FF0000'}}>DEF:</span> {card.stats?.defense ?? '-'}</div>
            <div style={{ border: '2px solid #0000FF', padding: '4px', backgroundColor: '#FFFFFF' }}><span style={{color:'#FF0000'}}>HP:</span> {card.stats?.hp ?? '-'}</div>
            <div style={{ border: '2px solid #0000FF', padding: '4px', backgroundColor: '#FFFFFF' }}><span style={{color:'#FF0000'}}>RNG:</span> {card.stats?.range ?? '-'}</div>
            <div style={{ border: '2px solid #0000FF', padding: '4px', backgroundColor: '#FFFFFF' }}><span style={{color:'#FF0000'}}>FTH:</span> {card.stats?.faith}{typeof card.stats?.faith === 'number' ? '%' : ''}</div>
            <div style={{ border: '2px solid #FF0000', padding: '4px', backgroundColor: '#FFFFCC' }}><span style={{color:'#FF0000'}}>PWR:</span> {card.powerLevel}</div>
          </div>
        </div>

        {card.rules && (
          <div style={{ marginBottom: '1.5rem', border: '4px dashed #0000FF', padding: '1rem', backgroundColor: '#e0ffff' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#FF0000', textDecoration: 'underline' }}>Pravidla (DŮLEŽITÉ)</h3>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000000', fontWeight: 'bold', fontSize: '1.1rem' }}>{card.rules}</p>
          </div>
        )}

        {card.flavor && (
          <div style={{ fontStyle: 'italic', marginBottom: '1.5rem', padding: '1rem', border: '4px inset #FF00FF', color: '#800080', whiteSpace: 'pre-wrap', backgroundColor: '#FFCCFF', fontWeight: 'bold', textAlign: 'center' }}>
            "{card.flavor}"
          </div>
        )}

        {card.lore && (
          <div style={{ marginBottom: '1.5rem', border: '4px solid #008000', padding: '1rem', backgroundColor: '#ccffcc' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#0000FF' }}>Tajemství (Lore)</h3>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#000000', fontWeight: 'bold' }}>{card.lore}</p>
          </div>
        )}

        {card.synergies && card.synergies.length > 0 && (
          <div style={{ marginBottom: '1.5rem', backgroundColor: '#FFFFCC', border: '4px outset #FF0000', padding: '1rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#FF0000' }}>SPŘÍZNĚNÉ DUŠE (Synergie)</h3>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#0000FF', fontWeight: 'bold' }}>
              {card.synergies.map(synId => (
                <li key={synId}>
                  <Link to={`/kartoteka/${synId}`}>{synId}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
