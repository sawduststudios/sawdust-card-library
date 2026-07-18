import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import data from '../../data/cards.json';
import tinderConfig from '../config/tinderConfig.json';
import './Tinder.css';

const images = import.meta.glob('../../images/*', { eager: true, import: 'default' });

const PROPHECIES = {
  holy: [
    "Nebeské síly se spojily. Zítra najdeš na zemi zlatou minci, ale ztratíš klíče od domu.",
    "Tvůj astrální kanál byl vyčištěn. Dnes se ti vyhnou revizoři.",
    "Bohové pilin ti žehnají. Zítřejší ranní káva bude mít ideální teplotu."
  ],
  heretic: [
    "Tvá duše je zkažená. Dnes v noci tě navštíví stín a nabídne ti slevu na piliny.",
    "Vesmírná rovnováha byla narušena. Tvé heslo k wifi bude prozrazeno.",
    "Démoni z páté dimenze tě sledují. Nejez dnes žlutý sníh."
  ],
  monster: [
    "Zvířecí instinkty se probouzí. Zítra dostaneš neodolatelnou chuť na syrové maso.",
    "Tvůj vnitřní netvor má hlad. Někdo ti dnes ukradne svačinu.",
    "Pozor na úplněk. Můžeš se proměnit ve vysavač."
  ],
  pleb: [
    "Jsi obyčejný smrtelník. Tvá budoucnost je průměrná, ale aspoň tě dnes nikdo nesežere.",
    "Osud ti přichystal průměrný den. Nečekej nic víc, nic míň.",
    "Tvá astrální stopa je neviditelná. Dnes zapomeneš, pro co jsi šel do kuchyně."
  ],
  artifact: [
    "Tvé tělo se stává nástrojem. Brzy zjistíš, že máš schopnost otevírat pivo pouhým pohledem.",
    "Vesmírná energie proudí tvými žilami. Dnes tě kopne statická elektřina víc než obvykle.",
    "Kov a maso se spojují. Tvůj telefon se dnes nevybije, ale ty ztratíš pojem o čase."
  ],
  default: [
    "Hvězdy mlčí. Tvá budoucnost je nejistá, ale karta tě bude chránit.",
    "Vesmírní lidé mají výpadek signálu. Zkus to znovu zítra.",
    "Aštar Šeran tě zablokoval na Facebooku. Osud je krutý."
  ]
};

const generateProphecy = (card) => {
  const category = card.class?.toLowerCase() || 'default';
  const pool = PROPHECIES[category] || PROPHECIES.default;
  return pool[Math.floor(Math.random() * pool.length)];
};

export default function Tinder() {
  const [cards, setCards] = useState([]);
  const [matchedCard, setMatchedCard] = useState(null);
  const [prophecy, setProphecy] = useState('');
  
  const activeDragX = useMotionValue(0);
  const topCardRef = useRef(null);
  
  const bgColor = useTransform(
    activeDragX,
    [-200, 0, 200],
    ['#4a0000', '#111111', '#004a00']
  );

  useEffect(() => {
    const shuffled = [...data.cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleSwipe = (direction, cardObj) => {
    activeDragX.set(0); 
    
    // Check for Match on right swipe
    if (direction === 'right' && Math.random() <= tinderConfig.matchProbability) {
      setMatchedCard(cardObj);
      setProphecy(generateProphecy(cardObj));
    }
    
    setCards((prev) => prev.slice(1));
  };

  const handleRestart = () => {
    const shuffled = [...data.cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleProgrammaticSwipe = (direction) => {
    if (topCardRef.current && cards.length > 0) {
      topCardRef.current.swipeOut(direction);
    }
  };

  if (matchedCard) {
    return (
      <MatchOverlay 
        card={matchedCard} 
        prophecy={prophecy} 
        onDismiss={() => setMatchedCard(null)} 
      />
    );
  }

  return (
    <motion.div className="tinder-container" style={{ backgroundColor: bgColor }}>
      <Link to="/" className="tinder-back-btn">⬅ ZPĚT DO SVATYNĚ</Link>

      <div className="tinder-header">
        <h1>ZAKÁZANÉ ZBOŽÍ</h1>
        <p>Psst... poutníku. Hledáš něco speciálního?</p>
      </div>

      <div className="card-stack">
        {cards.length === 0 ? (
          <div className="tinder-end">
            <h2>JSI ÚPLNĚ SÁM.</h2>
            <p>Prošel jsi celý vesmír a nikoho nenašel. Tvá existence je prázdná a tvá duše navždy zůstane opuštěná. Už nikdy nepoznáš štěstí.</p>
            <Link to="/">
              <button>HLEDAT SPÁSU VE SVATYNI</button>
            </Link>
          </div>
        ) : (
          cards.map((card, index) => {
            const isTop = index === 0;
            if (index > 1) return null;

            return (
              <SwipeableCard 
                key={card.name + index} 
                card={card} 
                isTop={isTop} 
                onSwipe={(dir) => handleSwipe(dir, card)}
                dragX={isTop ? activeDragX : null} 
                ref={isTop ? topCardRef : null}
              />
            );
          }).reverse() 
        )}
      </div>

      {cards.length > 0 && (
        <div className="tinder-controls">
          <button className="tinder-btn btn-nope" onClick={() => handleProgrammaticSwipe('left')}>❌</button>
          <button className="tinder-btn btn-like" onClick={() => handleProgrammaticSwipe('right')}>💚</button>
        </div>
      )}
    </motion.div>
  );
}

const SwipeableCard = forwardRef(({ card, isTop, onSwipe, dragX }, ref) => {
  const localX = useMotionValue(0);
  const x = dragX || localX;
  const controls = useAnimation();

  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);

  useImperativeHandle(ref, () => ({
    swipeOut: async (direction) => {
      if (direction === 'left') {
        await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
        onSwipe('left');
      } else if (direction === 'right') {
        await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
        onSwipe('right');
      }
    }
  }));

  const handleDragEnd = async (event, info) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    
    const isSwipeLeft = info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold;
    const isSwipeRight = info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold;

    if (isSwipeLeft) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe('left');
    } else if (isSwipeRight) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe('right');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div 
      className="swipe-card"
      style={{ 
        x, 
        rotate,
        zIndex: isTop ? 2 : 1,
        scale: isTop ? 1 : 0.95,
        opacity: isTop ? 1 : 0.8,
        pointerEvents: isTop ? 'auto' : 'none'
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      <motion.div className="stamp nope" style={{ opacity: nopeOpacity }}>
        HNUS!
      </motion.div>
      <motion.div className="stamp like" style={{ opacity: likeOpacity }}>
        BERU!
      </motion.div>

      {card.image && images[`../../${card.image}`] ? (
        <img 
          src={images[`../../${card.image}`]} 
          alt={card.name} 
          draggable="false"
        />
      ) : (
        <div style={{ width: '100%', height: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          BEZ OBRÁZKU
        </div>
      )}
      
      <div className="swipe-card-info">
        <div className="swipe-card-title">{card.name}</div>
        <div style={{ fontSize: '1rem', color: '#00FF00' }}>
          PWR: {card.powerLevel} | ATK: {card.stats?.attack ?? '-'} | DEF: {card.stats?.defense ?? '-'}
        </div>
      </div>
    </motion.div>
  );
});

function MatchOverlay({ card, prophecy, onDismiss }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Můj astrální partner!',
        text: `Vesmír promluvil! Můj astrální partner je ${card.name}. Proroctví: ${prophecy}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Tento prohlížeč neumí sdílet vesmírnou energii (Web Share API není podporováno).");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      className="match-overlay"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <h1 className="match-header">OSUDOVÉ SETKÁNÍ!</h1>
      
      <div className="prophecy-box">
        <div className="prophecy-text">{prophecy}</div>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '1rem', border: '8px solid #FF00FF', color: '#000', textAlign: 'center', marginBottom: '2rem' }}>
        {card.image && images[`../../${card.image}`] && (
          <img 
            src={images[`../../${card.image}`]} 
            alt={card.name} 
            style={{ width: '100%', border: '4px solid #000' }} 
          />
        )}
        <h2 style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#FF00FF', textTransform: 'uppercase' }}>{card.name}</h2>
        <div style={{ backgroundColor: '#ccc', padding: '0.2rem 0.5rem', display: 'inline-block', fontWeight: 'bold', marginBottom: '1rem' }}>
          {card.rarity} • {card.class}
        </div>
        <p style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{card.lore}"</p>
        <div style={{ backgroundColor: '#ffff00', padding: '0.5rem', border: '4px solid #000', fontWeight: 'bold' }}>
          ATK: {card.stats?.attack ?? '-'} | DEF: {card.stats?.defense ?? '-'} | HP: {card.stats?.hp ?? '-'} | PWR: {card.powerLevel}
        </div>
      </div>

      <div className="match-actions">
        <button className="match-btn btn-share" onClick={handleShare}>📲 SDÍLET SVŮJ OSUD</button>
        <button className="match-btn btn-print no-print" onClick={handlePrint}>🖨️ UCHOVAT V REALITĚ (Tisk)</button>
        <button className="match-btn btn-continue" onClick={onDismiss}>🚀 POKRAČOVAT V HLEDÁNÍ</button>
      </div>
    </motion.div>
  );
}
