import { useSearchParams, Link } from 'react-router-dom';
import data from '../../data/cards.json';

const images = import.meta.glob('../../images/*', { eager: true, import: 'default' });

function normalizeString(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const RARITY_COLORS = {
  legendary: '#ffd700',
  rare: '#87cefa',
  common: '#e0e0e0'
};

export default function Library() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') || '';
  const filterClass = searchParams.get('class') || '';
  const filterRarity = searchParams.get('rarity') || '';
  const sort = searchParams.get('sort') || 'name';
  const dir = searchParams.get('dir') || 'asc';

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
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

  const filteredCards = data.cards.filter(card => {
    if (filterClass && card.class !== filterClass) return false;
    if (filterRarity && card.rarity !== filterRarity) return false;
    
    if (q) {
      const query = normalizeString(q);
      const nameMatch = normalizeString(card.name).includes(query);
      const rulesMatch = normalizeString(card.rules).includes(query);
      const flavorMatch = normalizeString(card.flavor).includes(query);
      if (!nameMatch && !rulesMatch && !flavorMatch) return false;
    }
    return true;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    let valA, valB;
    if (['attack', 'defense', 'hp', 'range', 'faith'].includes(sort)) {
      valA = a.stats?.[sort];
      valB = b.stats?.[sort];
    } else {
      valA = a[sort];
      valB = b[sort];
    }

    const isNumA = typeof valA === 'number';
    const isNumB = typeof valB === 'number';

    if (isNumA && isNumB) {
      return dir === 'asc' ? valA - valB : valB - valA;
    } else if (isNumA && !isNumB) {
      return -1; // non-numeric always sorts last
    } else if (!isNumA && isNumB) {
      return 1;
    } else {
      const strA = String(valA || '');
      const strB = String(valB || '');
      const cmp = strA.localeCompare(strB, 'cs');
      return dir === 'asc' ? cmp : -cmp;
    }
  });

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
          onChange={(e) => updateParams('q', e.target.value)}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '1rem', boxSizing: 'border-box' }}
        />
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#555' }}>Třída (Class):</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button 
                onClick={() => updateParams('class', '')}
                style={{ padding: '0.3rem 0.6rem', borderRadius: '16px', border: '1px solid #aaa', cursor: 'pointer', backgroundColor: filterClass === '' ? '#333' : '#fff', color: filterClass === '' ? '#fff' : '#333' }}
              >
                Vše
              </button>
              {classes.map(c => (
                <button 
                  key={c}
                  onClick={() => updateParams('class', c)}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '16px', border: '1px solid #aaa', cursor: 'pointer', backgroundColor: filterClass === c ? '#333' : '#fff', color: filterClass === c ? '#fff' : '#333', textTransform: 'capitalize' }}
                >
                  {c.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#555' }}>Vzácnost:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button 
                onClick={() => updateParams('rarity', '')}
                style={{ padding: '0.3rem 0.6rem', borderRadius: '16px', border: '1px solid #aaa', cursor: 'pointer', backgroundColor: filterRarity === '' ? '#333' : '#fff', color: filterRarity === '' ? '#fff' : '#333' }}
              >
                Vše
              </button>
              {rarities.map(r => (
                <button 
                  key={r}
                  onClick={() => updateParams('rarity', r)}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '16px', border: '1px solid #aaa', cursor: 'pointer', backgroundColor: filterRarity === r ? RARITY_COLORS[r] || '#ccc' : '#fff', color: filterRarity === r ? '#000' : '#333', fontWeight: filterRarity === r ? 'bold' : 'normal', textTransform: 'capitalize' }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Řadit podle:</div>
            <select 
              value={sort} 
              onChange={(e) => updateParams('sort', e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #aaa' }}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button 
              onClick={() => updateParams('dir', dir === 'asc' ? 'desc' : 'asc')}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid #aaa', cursor: 'pointer', backgroundColor: '#fff' }}
              title={dir === 'asc' ? 'Vzestupně' : 'Sestupně'}
            >
              {dir === 'asc' ? '⬆' : '⬇'}
            </button>
          </div>
        </div>
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
