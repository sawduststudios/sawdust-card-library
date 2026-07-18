import { useSearchParams, Link } from 'react-router-dom';
import WiggleLink from '../components/WiggleLink';
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
    <div style={{ textAlign: 'left', padding: '1rem', backgroundColor: '#FFFFCC', border: '5px ridge #00FF00' }}>
      <h2 className="blink" style={{ borderBottom: '4px double #FF0000', paddingBottom: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>KARTOTÉKA SVĚTLA</h2>
      
      {/* Sub-features accessible from library */}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <WiggleLink to="/vyvolat" baseRot={-2} style={{ 
          display: 'inline-block',
          padding: '0.5rem 1rem', 
          backgroundColor: '#FF00FF', 
          border: '4px dotted #FFFF00', 
          textDecoration: 'none', 
          color: '#000',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          boxShadow: '4px 4px 0px #000',
          maxWidth: '90vw',
          boxSizing: 'border-box'
        }}>
          🎲 Vyvolat kartu
        </WiggleLink>

        <WiggleLink to="/seznamka" baseRot={2} style={{ 
          display: 'inline-block',
          padding: '0.6rem 1rem', 
          backgroundColor: '#000', 
          border: '3px solid #00FF00', 
          textDecoration: 'underline wavy #FF0000', 
          color: '#00FF00',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          textShadow: '1px 1px #FF0000',
          maxWidth: '90vw',
          boxSizing: 'border-box'
        }}>
          🧪 Zakázané zboží
        </WiggleLink>

        <WiggleLink to="/duel" baseRot={-4} style={{ 
          display: 'inline-block',
          padding: '0.6rem 1rem', 
          backgroundColor: '#FF0000', 
          border: '4px ridge #000000', 
          textDecoration: 'none', 
          color: '#FFFF00',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          textShadow: '2px 2px #000000',
          boxShadow: 'inset 0 0 5px #000',
          maxWidth: '90vw',
          boxSizing: 'border-box'
        }}>
          🤠 Krvavý duel
        </WiggleLink>
      </div>

      {/* Search & Filters */}
      <div style={{ backgroundColor: '#C0C0C0', padding: '1rem', border: '4px outset #FFFFFF', marginBottom: '1.5rem', color: '#000000', fontWeight: 'bold' }}>
        <input 
          type="text" 
          placeholder="Zadej hledané slovo (duše, aura, flavor)..." 
          value={q}
          onChange={(e) => updateSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', border: '3px inset #FFFFFF', marginBottom: '1rem', boxSizing: 'border-box', backgroundColor: '#FFFFFF', color: '#0000FF' }}
        />
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#FF0000' }}>Třída (Class):</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {classes.map(c => (
                <button 
                  key={c}
                  onClick={() => toggleArrayParam('class', c)}
                  style={{ 
                    padding: '4px 8px', 
                    border: selectedClasses.includes(c) ? '3px inset #FFFFFF' : '3px outset #FFFFFF', 
                    cursor: 'pointer', 
                    backgroundColor: selectedClasses.includes(c) ? '#a0a0a0' : '#e0e0e0', 
                    color: selectedClasses.includes(c) ? '#FF0000' : '#0000FF', 
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 'bold',
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
            <div style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#FF0000' }}>Vzácnost:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {rarities.map(r => (
                <button 
                  key={r}
                  onClick={() => toggleArrayParam('rarity', r)}
                  style={{ 
                    padding: '4px 8px', 
                    border: selectedRarities.includes(r) ? '3px inset #FFFFFF' : '3px outset #FFFFFF', 
                    cursor: 'pointer', 
                    backgroundColor: selectedRarities.includes(r) ? RARITY_COLORS[r] || '#ccc' : '#e0e0e0', 
                    color: selectedRarities.includes(r) ? '#000000' : '#0000FF', 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'inherit'
                  }}
                >
                  {r}
                  {selectedRarities.includes(r) && <span style={{ color: '#FF0000' }}>✕</span>}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
            <div style={{ fontSize: '1rem', color: '#FF0000' }}>Řadit podle:</div>
            <select 
              value={sort} 
              onChange={(e) => updateSortParam('sort', e.target.value)}
              style={{ padding: '4px', border: '3px inset #FFFFFF', backgroundColor: '#FFFFFF', color: '#0000FF', fontWeight: 'bold' }}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button 
              onClick={() => updateSortParam('dir', dir === 'asc' ? 'desc' : 'asc')}
              style={{ padding: '4px 8px', border: '3px outset #FFFFFF', cursor: 'pointer', backgroundColor: '#e0e0e0', color: '#FF0000', fontWeight: 'bold' }}
              title={dir === 'asc' ? 'Vzestupně' : 'Sestupně'}
            >
              {dir === 'asc' ? '⬆' : '⬇'}
            </button>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div style={{ width: '100%', marginTop: '1rem', borderTop: '2px dashed #0000FF', paddingTop: '0.75rem', textAlign: 'center' }}>
            <button 
              onClick={clearAllFilters}
              style={{ padding: '0.5rem 1rem', border: '4px outset #FF0000', cursor: 'pointer', backgroundColor: '#FFCCCC', color: '#FF0000', fontSize: '1rem', fontWeight: 'bold' }}
            >
              !!! VYMAZAT VŠECHNY FILTRY !!!
            </button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#008000', textAlign: 'center', fontSize: '1.2rem' }}>
        Nalezeno: {getResultLabel(sortedCards.length)}
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
