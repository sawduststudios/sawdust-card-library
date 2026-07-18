import { Link } from 'react-router-dom';
import data from '../../data/cards.json';

const images = import.meta.glob('../../images/*', { eager: true, import: 'default' });

export default function Library() {
  const cards = data.cards;

  const rarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return '#ffd700'; // gold
      case 'rare': return '#87cefa'; // lightblue
      case 'common': return '#e0e0e0';
      default: return '#f0f0f0';
    }
  };

  return (
    <div>
      <h2 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>Kartotéka</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        {cards.map((card) => (
          <Link 
            key={card.id} 
            to={`/kartoteka/${card.id}`} 
            style={{ 
              textDecoration: 'none', 
              color: 'black',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            {card.image && images[`../../${card.image}`] ? (
              <img 
                src={images[`../../${card.image}`]} 
                alt={card.name} 
                style={{ width: '100%', aspectRatio: '2.5/3.5', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem' }} 
              />
            ) : (
              <div style={{ width: '100%', aspectRatio: '2.5/3.5', backgroundColor: '#eee', borderRadius: '4px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#999', fontSize: '0.8rem' }}>Bez obrázku</span>
              </div>
            )}
            <div style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.9rem', lineHeight: '1.2' }}>{card.name}</div>
            <span style={{ 
              backgroundColor: rarityColor(card.rarity), 
              padding: '0.2rem 0.5rem', 
              borderRadius: '12px', 
              fontSize: '0.75rem',
              textTransform: 'capitalize',
              marginTop: 'auto'
            }}>
              {card.rarity}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
