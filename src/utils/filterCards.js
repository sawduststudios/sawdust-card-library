function normalizeString(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function filterAndSortCards(cards, searchParams) {
  const q = searchParams.get('q') || '';
  const classesRaw = searchParams.get('class');
  const raritiesRaw = searchParams.get('rarity');
  
  const selectedClasses = classesRaw ? classesRaw.split(',') : [];
  const selectedRarities = raritiesRaw ? raritiesRaw.split(',') : [];

  const sort = searchParams.get('sort') || 'name';
  const dir = searchParams.get('dir') || 'asc';

  const filteredCards = cards.filter(card => {
    if (selectedClasses.length > 0 && !selectedClasses.includes(card.class)) return false;
    if (selectedRarities.length > 0 && !selectedRarities.includes(card.rarity)) return false;
    
    if (q) {
      const query = normalizeString(q);
      const nameMatch = normalizeString(card.name).includes(query);
      const rulesMatch = normalizeString(card.rules).includes(query);
      const flavorMatch = normalizeString(card.flavor).includes(query);
      if (!nameMatch && !rulesMatch && !flavorMatch) return false;
    }
    return true;
  });

  return filteredCards.sort((a, b) => {
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
}
