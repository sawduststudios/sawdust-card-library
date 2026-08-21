import { useState } from 'react';
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

  const hasActiveFilters = selectedClasses.length > 0 || selectedRarities.length > 0 || Boolean(q);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    <div style={{ textAlign: 'left', padding: '1rem', backgroundColor: '#FFFFCC', border: '5px ridge #00FF00' }}>
      <h2 className="blink" style={{ borderBottom: '4px double #FF0000', paddingBottom: '0.5rem', marginBottom: '0.75rem', textAlign: 'center', fontSize: 'clamp(1.3rem, 5vw, 2rem)' }}>
        SAW THE DUST GAME: KARTOTÉKA SVĚTLA
      </h2>

      {/* Sort Box - Always Separate & Always Visible */}
      <div style={{ 
        backgroundColor: '#C0C0C0', 
        padding: '0.5rem 0.75rem', 
        border: '3px outset #FFFFFF', 
        marginBottom: '0.75rem', 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '0.5rem',
        color: '#000000',
        fontWeight: 'bold'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.95rem', color: '#FF0000' }}>Řadit podle:</span>
          <select 
            value={sort} 
            onChange={(e) => updateSortParam('sort', e.target.value)}
            style={{ padding: '3px 6px', border: '2px inset #FFFFFF', backgroundColor: '#FFFFFF', color: '#0000FF', fontWeight: 'bold', fontSize: '0.9rem' }}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button 
            onClick={() => updateSortParam('dir', dir === 'asc' ? 'desc' : 'asc')}
            style={{ padding: '2px 8px', border: '2px outset #FFFFFF', cursor: 'pointer', backgroundColor: '#e0e0e0', color: '#FF0000', fontWeight: 'bold', fontSize: '0.9rem' }}
            title={dir === 'asc' ? 'Vzestupně' : 'Sestupně'}
          >
            {dir === 'asc' ? '⬆' : '⬇'}
          </button>
        </div>

        <div style={{ fontWeight: 'bold', color: '#008000', fontSize: '0.95rem' }}>
          Nalezeno: {getResultLabel(sortedCards.length)}
        </div>
      </div>

      {/* Collapsible Search & Filters Toggle Button */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          style={{ 
            width: '100%', 
            padding: '0.5rem 0.75rem', 
            backgroundColor: hasActiveFilters ? '#FFCC00' : '#D4D0C8', 
            border: '3px outset #FFFFFF', 
            cursor: 'pointer', 
            color: '#0000FF', 
            fontWeight: 'bold', 
            fontSize: '0.95rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'inherit'
          }}
        >
          <span>
            🔍 Hledat a filtrovat {hasActiveFilters ? `(Aktivní filtr: ${selectedClasses.length + selectedRarities.length + (q ? 1 : 0)})` : ''}
          </span>
          <span style={{ color: '#FF0000', fontSize: '0.9rem' }}>
            {isFilterOpen ? '▲ SBALIT' : '▼ ROZBALIT'}
          </span>
        </button>

        {/* Collapsed Drawer */}
        {isFilterOpen && (
          <div style={{ backgroundColor: '#C0C0C0', padding: '1rem', border: '3px inset #FFFFFF', borderTop: 'none', color: '#000000', fontWeight: 'bold' }}>
            <input 
              type="text" 
              placeholder="Hledej kartu (jméno, pravidla, text)..." 
              value={q}
              onChange={(e) => updateSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', border: '3px inset #FFFFFF', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: '#FFFFFF', color: '#0000FF' }}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.95rem', marginBottom: '0.25rem', color: '#FF0000' }}>Třída (Class):</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {classes.map(c => (
                    <button 
                      key={c}
                      onClick={() => toggleArrayParam('class', c)}
                      style={{ 
                        padding: '3px 6px', 
                        border: selectedClasses.includes(c) ? '3px inset #FFFFFF' : '3px outset #FFFFFF', 
                        cursor: 'pointer', 
                        backgroundColor: selectedClasses.includes(c) ? '#a0a0a0' : '#e0e0e0', 
                        color: selectedClasses.includes(c) ? '#FF0000' : '#0000FF', 
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }}
                    >
                      {c.replace('-', ' ')}
                      {selectedClasses.includes(c) && <span style={{ color: '#FF0000' }}>✕</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.95rem', marginBottom: '0.25rem', color: '#FF0000' }}>Vzácnost:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {rarities.map(r => (
                    <button 
                      key={r}
                      onClick={() => toggleArrayParam('rarity', r)}
                      style={{ 
                        padding: '3px 6px', 
                        border: selectedRarities.includes(r) ? '3px inset #FFFFFF' : '3px outset #FFFFFF', 
                        cursor: 'pointer', 
                        backgroundColor: selectedRarities.includes(r) ? RARITY_COLORS[r] || '#ccc' : '#e0e0e0', 
                        color: selectedRarities.includes(r) ? '#000000' : '#0000FF', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                      }}
                    >
                      {r}
                      {selectedRarities.includes(r) && <span style={{ color: '#FF0000' }}>✕</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {hasActiveFilters && (
              <div style={{ width: '100%', marginTop: '1rem', borderTop: '2px dashed #0000FF', paddingTop: '0.75rem', textAlign: 'center' }}>
                <button 
                  onClick={clearAllFilters}
                  style={{ padding: '0.4rem 0.8rem', border: '3px outset #FF0000', cursor: 'pointer', backgroundColor: '#FFCCCC', color: '#FF0000', fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  !!! VYMAZAT VŠECHNY FILTRY !!!
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem' }}>
        {sortedCards.map((card) => (
          <Link 
            key={card.id} 
            to={`/kartoteka/${card.id}?${searchParams.toString()}`} 
            style={{ textDecoration: 'none', color: '#0000FF', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {card.image && images[`../../${card.image}`] ? (
              <img 
                src={images[`../../${card.image}`]} 
                alt={card.name} 
                style={{ width: '100%', height: 'auto', border: '4px solid #FF0000', backgroundColor: '#FFFFFF', padding: '2px' }} 
              />
            ) : (
              <div style={{ width: '100%', aspectRatio: '2.5/3.5', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #0000FF', color: '#FF0000', fontWeight: 'bold' }}>
                Bez obrázku
              </div>
            )}
            <div style={{ marginTop: '0.5rem', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>
              {card.name}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#000000', 
              backgroundColor: RARITY_COLORS[card.rarity] || '#ccc',
              padding: '2px 6px',
              border: '2px inset #FFFFFF',
              marginTop: '4px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {card.rarity}
            </div>
          </Link>
        ))}
        {sortedCards.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#FF0000', fontWeight: 'bold', fontSize: '1.5rem', border: '4px dashed #FF0000', backgroundColor: '#FFFFCC' }}>
            ŽÁDNÉ KARTY NENALEZENY. SYSTÉM VÁS Oklamal!
          </div>
        )}
      </div>
    </div>
  );
}
