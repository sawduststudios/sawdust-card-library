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
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={backLink} style={{ textDecoration: 'none', color: '#666' }}>← Zpět do Kartotéky</Link>
        <div style={{ fontSize: '0.9rem', color: '#999' }}>
          {currentIndex !== -1 ? `${currentIndex + 1} / ${sortedCards.length}` : 'Mimo filtr'}
        </div>
      </div>
      
      <div className="card-image-container">
        {prevCard && (
          <Link to={`/kartoteka/${prevCard.id}?${searchParams.toString()}`} className="nav-arrow left" title="Předchozí karta">
            ←
          </Link>
        )}
        
        {card.image && images[`../../${card.image}`] && (
          <img 
            src={images[`../../${card.image}`]} 
            alt={card.name} 
            style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          />
        )}

        {nextCard && (
          <Link to={`/kartoteka/${nextCard.id}?${searchParams.toString()}`} className="nav-arrow right" title="Další karta">
            →
          </Link>
        )}
      </div>

      <div className="swipe-hint">
        ← Potažením listujte →
      </div>
      
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        {card.name}
        <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#555', textTransform: 'capitalize' }}>
          {card.rarity} • {card.class.replace('-', ' ')}
        </span>
      </h1>

      {card.printCount !== null && (
        <div style={{ fontStyle: 'italic', color: '#888', marginBottom: '1rem' }}>
          Vytištěno pouze {card.printCount} kusů
        </div>
      )}

      {card.releaseDate && (
        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Vydáno: {new Date(card.releaseDate).toLocaleDateString('cs-CZ')}
        </div>
      )}

      <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>Statistiky</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
          <div><strong>ATK:</strong> {card.stats?.attack ?? '-'}</div>
          <div><strong>DEF:</strong> {card.stats?.defense ?? '-'}</div>
          <div><strong>HP:</strong> {card.stats?.hp ?? '-'}</div>
          <div><strong>RNG:</strong> {card.stats?.range ?? '-'}</div>
          <div><strong>FTH:</strong> {card.stats?.faith}{typeof card.stats?.faith === 'number' ? '%' : ''}</div>
          <div><strong>PWR:</strong> {card.powerLevel}</div>
        </div>
      </div>

      {card.rules && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Pravidla</h3>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{card.rules}</p>
        </div>
      )}

      {card.flavor && (
        <div style={{ fontStyle: 'italic', marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '4px solid #ddd', color: '#555', whiteSpace: 'pre-wrap' }}>
          {card.flavor}
        </div>
      )}

      {card.lore && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Lore</h3>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{card.lore}</p>
        </div>
      )}

      {card.synergies && card.synergies.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Synergie</h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {card.synergies.map(synId => (
              <li key={synId}>
                <Link to={`/kartoteka/${synId}`}>{synId}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
