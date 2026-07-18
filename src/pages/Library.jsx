import { useSearchParams, Link } from 'react-router-dom';
import data from '../../data/cards.json';
import { filterAndSortCards } from '../utils/filterCards';

const images = import.meta.glob('../../images/*', { eager: true, import: 'default' });

const RARITY_COLORS = {
  legendary: '#ffd700',
  rare: '#87cefa',
  common: '#e0e0e0'
};

export default function Library() {
  const [searchParams, setSearchParams] = useSearchParams();

  const classesRaw = searchParams.get('class');
  const raritiesRaw = searchParams.get('rarity');
  const selectedClasses = classesRaw ? classesRaw.split(',') : [];
  const selectedRarities = raritiesRaw ? raritiesRaw.split(',') : [];

  const sort = searchParams.get('sort') || 'name';
  const dir = searchParams.get('dir') || 'asc';
  const q = searchParams.get('q') || '';

  const updateSortParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const updateSearchQuery = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('q', value);
    else newParams.delete('q');
    setSearchParams(newParams);
  };

  const toggleArrayParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    const currentRaw = newParams.get(key);
    let current = currentRaw ? currentRaw.split(',') : [];
    
    if (current.includes(value)) {
      current = current.filter(c => c !== value);
    } else {
      current.push(value);
    }
    
    if (current.length > 0) {
      newParams.set(key, current.join(','));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('class');
    newParams.delete('rarity');
    newParams.delete('q');
    setSearchParams(newParams);
  };

  const hasActiveFilters = selectedClasses.length > 0 || selectedRarities.length > 0 || q;

  const classes = [...new Set(data.cards.map(c => c.class))].filter(Boolean).sort();
  const rarities = [...new Set(data.cards.map(c => c.rarity))].filter(Boolean).sort();
  
  const sortOptions = [
    { value: 'name', label: 'Jméno' },
    { value: 'releaseDate', label: 'Datum vydání' },
    { value: 'powerLevel', label: 'Power Level' },
    { value: 'attack', label: 'Útok' },
    { value: 'defense', label: 'Obrana' },
    { value: 'hp', label: 'Životy' },
    { value: 'range', label: 'Dosah' },
    { value: 'faith', label: 'Víra' }
  ];

  const sortedCards = filterAndSortCards(data.cards, searchParams);

  const getResultLabel = (count) => {
    if (count === 1) return '1 karta';
    if (count >= 2 && count <= 4) return `${count} karty`;
    return `${count} karet`;
  };

  return (
    <div>
      <h2 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Kartotéka</h2>
      
      {/* Search & Filters */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ddd' }}>
        <input 
          type="text" 
          placeholder="Hledej v archivech (jméno, pravidla, flavor)..." 
          value={q}
          onChange={(e) => updateSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '1rem', boxSizing: 'border-box' }}
        />
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#555' }}>Třída (Class):</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {classes.map(c => (
                <button 
                  key={c}
                  onClick={() => toggleArrayParam('class', c)}
                  style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '16px', 
                    border: '1px solid #aaa', 
                    cursor: 'pointer', 
                    backgroundColor: selectedClasses.includes(c) ? '#333' : '#fff', 
                    color: selectedClasses.includes(c) ? '#fff' : '#333', 
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {c.replace('-', ' ')}
                  {selectedClasses.includes(c) && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>✕</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#555' }}>Vzácnost:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {rarities.map(r => (
                <button 
                  key={r}
                  onClick={() => toggleArrayParam('rarity', r)}
                  style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '16px', 
                    border: '1px solid #aaa', 
                    cursor: 'pointer', 
                    backgroundColor: selectedRarities.includes(r) ? RARITY_COLORS[r] || '#ccc' : '#fff', 
                    color: selectedRarities.includes(r) ? '#000' : '#333', 
                    fontWeight: selectedRarities.includes(r) ? 'bold' : 'normal', 
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {r}
                  {selectedRarities.includes(r) && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>✕</span>}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Řadit podle:</div>
            <select 
              value={sort} 
              onChange={(e) => updateSortParam('sort', e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #aaa' }}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button 
              onClick={() => updateSortParam('dir', dir === 'asc' ? 'desc' : 'asc')}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #aaa', cursor: 'pointer', backgroundColor: '#fff' }}
              title={dir === 'asc' ? 'Vzestupně' : 'Sestupně'}
            >
              {dir === 'asc' ? '⬆' : '⬇'}
            </button>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div style={{ width: '100%', marginTop: '1rem', borderTop: '1px dashed #ccc', paddingTop: '0.75rem' }}>
            <button 
              onClick={clearAllFilters}
              style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', border: '1px solid #d9534f', cursor: 'pointer', backgroundColor: '#fff', color: '#d9534f', fontSize: '0.85rem' }}
            >
              ✖ Vymazat všechny filtry
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#444' }}>
        Nalezeno: {getResultLabel(sortedCards.length)}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
        gap: '1rem'
      }}>
        {sortedCards.map((card) => (
          <Link 
            key={card.id} 
            to={`/kartoteka/${card.id}?${searchParams.toString()}`} 
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
              backgroundColor: RARITY_COLORS[card.rarity] || '#f0f0f0', 
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
        {sortedCards.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#777' }}>
            Žádná karta nenalezena. Kacířství!
          </div>
        )}
      </div>
    </div>
  );
}
