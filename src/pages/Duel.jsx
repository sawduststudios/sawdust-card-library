import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import data from '../../data/cards.json';
import './Duel.css';

const images = import.meta.glob('../../images/*', { eager: true, import: 'default' });

const CardBackStyle = {
  width: '350px',
  aspectRatio: '2.5/3.5',
  background: 'radial-gradient(circle at center, #FFFDE7 0%, #FFD54F 50%, #FFB300 100%)',
  border: '10px solid #FFF',
  borderRadius: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 40px #FFD700',
  position: 'relative',
  overflow: 'hidden'
};

const CardBackContent = () => (
  <>
    <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.5) 0deg 15deg, transparent 15deg 30deg)', animation: 'spin 20s linear infinite' }}></div>
    <div style={{ fontSize: '8rem', zIndex: 1, filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))', marginTop: '2rem' }}>🪵</div>
    <div style={{ zIndex: 1, color: '#FFF', fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', textShadow: '2px 2px 4px #000', marginTop: 'auto', marginBottom: '2rem' }}>
      Powered by <span style={{ fontFamily: 'Impact, sans-serif', fontSize: '2.8rem' }}>FAITH</span>
    </div>
  </>
);

export default function Duel() {
  const [gameState, setGameState] = useState('setup'); // setup, duel, cutscene, end
  const [targetScore, setTargetScore] = useState(3);
  const [playerScore, setPlayerScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [winner, setWinner] = useState(null);
  const [cardKey, setCardKey] = useState(0); 
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [screenEffect, setScreenEffect] = useState(null); 

  const activeDragX = useMotionValue(0);
  const bgColor = useTransform(
    activeDragX,
    [-200, 0, 200],
    ['#FF0000', 'transparent', '#00FF00'] 
  );

  useEffect(() => {
    if (gameState === 'cutscene') {
      const timer = setTimeout(() => {
        setGameState('end');
      }, 3500); 
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const drawNextCard = () => {
    setIsDrawing(true);
    setTimeout(() => {
      const randomCard = data.cards[Math.floor(Math.random() * data.cards.length)];
      setCurrentCard(randomCard);
      setCardKey(prev => prev + 1);
      setIsDrawing(false);
    }, 1500); 
  };

  const startDuel = () => {
    setGameState('duel');
  };

  const handleSwipe = (direction) => {
    activeDragX.set(0);
    
    if (direction === 'right') {
      const newScore = playerScore + 1;
      setPlayerScore(newScore);
      setScreenEffect('godRays');
      if (newScore >= targetScore) {
        setWinner('TY');
        setTimeout(() => setGameState('cutscene'), 200);
        return;
      }
    } else if (direction === 'left') {
      const newScore = enemyScore + 1;
      setEnemyScore(newScore);
      setScreenEffect('shake');
      if (newScore >= targetScore) {
        setWinner('TVŮJ NEPŘÍTEL');
        setTimeout(() => setGameState('cutscene'), 200);
        return;
      }
    }
    
    setCurrentCard(null); 
    
    setTimeout(() => {
      setScreenEffect(null);
    }, 1200); 
  };

  if (gameState === 'setup') {
    return (
      <div className="duel-container">
        <div className="duel-bg" />
        <Link to="/" style={{ position: 'absolute', top: 10, left: 10, color: '#00FF00', fontSize: '1.5rem', zIndex: 100, textShadow: '2px 2px 0 #000', fontWeight: 'bold' }}>🔙 Zpět do bezpečí</Link>
        <h1 className="saloon-title blink">CHRÁM PILIN</h1>
        <div className="duel-setup-box">
          <h2 style={{ color: '#FF00FF', margin: 0, fontSize: '2.5rem', fontFamily: 'Impact', textShadow: '2px 2px #000' }}>VÍTEJ VE SVATYNI, HŘÍŠNÍKU.</h2>
          <p style={{ color: '#0000FF', fontWeight: 'bold', fontSize: '1.5rem', marginTop: '1rem', backgroundColor: '#FFFF00' }}>
            S kým si jdeš vyřizovat účty? Na pravidlech zkoušky víry se domluvte předem.
          </p>
          <div style={{ margin: '2rem 0' }}>
            <label style={{ color: '#FF0000', fontWeight: '900', fontSize: '2rem', display: 'block', marginBottom: '1rem', textShadow: '2px 2px #FFF' }}>KOLIK MODLITEB DO SPASENÍ?</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setTargetScore(Math.max(1, targetScore - 1))}
                style={{ fontSize: '2.5rem', width: '60px', height: '60px', backgroundColor: '#FF0000', color: '#FFFF00', border: '5px outset #FF00FF', cursor: 'pointer', fontWeight: '900' }}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                max="99" 
                value={targetScore} 
                onChange={(e) => setTargetScore(parseInt(e.target.value) || 1)} 
                className="duel-input"
                style={{ margin: 0, width: '80px' }}
              />
              <button 
                onClick={() => setTargetScore(Math.min(99, targetScore + 1))}
                style={{ fontSize: '2.5rem', width: '60px', height: '60px', backgroundColor: '#00FF00', color: '#FF00FF', border: '5px outset #FFFF00', cursor: 'pointer', fontWeight: '900' }}
              >
                +
              </button>
            </div>
          </div>
          <button className="draw-weapon-btn" onClick={startDuel}>ZJEV PRAVDU!</button>
        </div>
      </div>
    );
  }

  if (gameState === 'cutscene') {
    const isPlayerWin = winner === 'TY';
    
    return (
      <motion.div 
        initial={{ scale: 0.1, rotate: 180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className={`duel-container ${isPlayerWin ? 'deepfried-win' : 'deepfried-lose'}`} 
        style={{ justifyContent: 'center' }}
      >
        {isPlayerWin ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', top: '10%', left: '10%', fontSize: '5rem' }}>🔥</motion.div>
            <motion.div animate={{ scale: [1, 2, 1] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ position: 'absolute', bottom: '20%', right: '10%', fontSize: '6rem' }}>💯</motion.div>
            <motion.div animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }} transition={{ duration: 0.2, repeat: Infinity }} style={{ position: 'absolute', top: '30%', right: '20%', fontSize: '8rem' }}>😂</motion.div>
            
            <h1 className="mlg-text pulse-fast">MOM GET THE CAMERA!</h1>
            <h2 className="mlg-text blink" style={{ fontSize: '4rem', marginTop: '1rem', color: '#ff0', textShadow: '3px 3px #000' }}>
              EZ WIN
            </h2>
            
            <div style={{ fontSize: '8rem', margin: '2rem 0' }} className="spin-fast">🔫😎🚬</div>
          </>
        ) : (
          <>
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.2, repeat: Infinity }} style={{ position: 'absolute', top: '20%', left: '15%', fontSize: '5rem' }}>💀</motion.div>
            <motion.div animate={{ rotate: [-20, 20, -20] }} transition={{ duration: 0.1, repeat: Infinity }} style={{ position: 'absolute', bottom: '10%', right: '20%', fontSize: '6rem' }}>😭</motion.div>
            
            <h1 className="sad-text blink">SKILL ISSUE</h1>
            <h2 className="sad-text" style={{ fontSize: '3rem', marginTop: '1rem', animation: 'shake 0.1s infinite' }}>L + RATIO + YOU FELL OFF</h2>
            
            <div style={{ fontSize: '8rem', margin: '2rem 0', filter: 'grayscale(100%)' }}>🤡</div>
          </>
        )}
      </motion.div>
    );
  }

  if (gameState === 'end') {
    const isPlayerWin = winner === 'TY';
    return (
      <motion.div 
        initial={{ y: '-100vh', scale: 0.5, rotate: 15 }}
        animate={{ y: 0, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.6, duration: 0.8 }}
        className="duel-container" 
        style={{ justifyContent: 'center' }}
      >
        <div className="duel-bg" />
        <div className="duel-setup-box" style={{ backgroundColor: '#00FFFF', border: '15px dashed #FF00FF', padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)', margin: 0, color: isPlayerWin ? '#00FF00' : '#FF0000', textShadow: '4px 4px 0 #000', wordBreak: 'break-word', fontFamily: 'Impact' }}>
            {isPlayerWin ? 'VÍTĚZSTVÍ!' : 'PORÁŽKA!'}
          </h1>
          <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: '#FF00FF', margin: '1rem 0 2rem 0', backgroundColor: '#FFFF00', display: 'inline-block', padding: '0.5rem' }}>
            SKÓRE:<br/>{playerScore} - {enemyScore}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <button className="draw-weapon-btn" onClick={() => {
              setPlayerScore(0);
              setEnemyScore(0);
              setWinner(null);
              setCurrentCard(null);
              setScreenEffect(null);
              setGameState('setup');
            }} style={{ width: '100%', fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', border: '10px outset #00FF00', animation: 'none' }}>
              NOVÁ ZKOUŠKA VÍRY
            </button>
            
            <Link to="/" style={{ 
              display: 'inline-block', 
              width: '100%', 
              backgroundColor: '#0000FF', 
              color: '#FFFF00', 
              textDecoration: 'none', 
              padding: '1rem 2rem', 
              fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', 
              fontWeight: '900', 
              border: '10px outset #FF0000',
              textAlign: 'center' 
            }}>
              ZPĚT DO KNIHOVNY
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`duel-container ${screenEffect === 'shake' ? 'shake-hard' : ''}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="duel-bg" />
      
      {screenEffect === 'godRays' && <div className="god-rays"></div>}

      <Link to="/" style={{ position: 'absolute', top: 10, left: 10, color: '#00FF00', fontSize: '1.5rem', zIndex: 100, fontWeight: 'bold', textShadow: '2px 2px 0 #000' }} className="no-print">🔙 Zpět</Link>
      
      <div className="scoreboard no-print" style={{ marginTop: '3rem' }}>
        <div className="score-player">
          <span>TY</span>
          <span className="score-number">{playerScore}</span>
        </div>
        <div style={{ fontSize: '1.5rem', alignSelf: 'center', color: '#FFD700' }}>VS</div>
        <div className="score-enemy">
          <span>NEPŘÍTEL</span>
          <span className="score-number">{enemyScore}</span>
        </div>
      </div>

      <div className="duel-arena no-print" style={{ perspective: 1000 }}>
        {isDrawing && (
          <>
            <motion.div animate={{ rotate: 360, scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ position: 'absolute', left: '10%', top: '20%', fontSize: '4rem', zIndex: 5 }}>🤠</motion.div>
            <motion.div animate={{ rotate: -360, scale: [1.5, 1, 1.5] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ position: 'absolute', right: '10%', top: '40%', fontSize: '4rem', zIndex: 5 }}>🔫</motion.div>
            <motion.div animate={{ rotate: 360, x: [-20, 20, -20] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ position: 'absolute', left: '20%', bottom: '20%', fontSize: '4rem', zIndex: 5 }}>🔥</motion.div>
            <motion.div animate={{ rotate: -360, y: [-20, 20, -20] }} transition={{ duration: 0.3, repeat: Infinity }} style={{ position: 'absolute', right: '20%', bottom: '10%', fontSize: '4rem', zIndex: 5 }}>😂</motion.div>
          </>
        )}
        {isDrawing ? (
          <motion.div 
            animate={{ 
              x: [-10, 10, -15, 15, -10, 10, -5, 5, 0],
              y: [-5, 5, -10, 10, -5, 5, -10, 10, 0],
              rotateZ: [-5, 5, -8, 8, -5, 5, -3, 3, 0],
              scale: [1, 1.05, 1.1, 1.15, 1.2, 1.15, 1.1, 1.05, 1],
              rotateY: [0, 0, 0, 0, 0, 0, 0, 0, 90]
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={CardBackStyle}
          >
            <CardBackContent />
          </motion.div>
        ) : currentCard ? (
          <DuelSwipeCard 
            key={cardKey} 
            card={currentCard} 
            dragX={activeDragX}
            onSwipe={handleSwipe} 
          />
        ) : (
          <motion.div 
            initial={{ scale: 0, rotateY: -90 }}
            animate={{ scale: 1, rotateY: 0 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px #FFF' }}
            whileTap={{ scale: 0.95 }}
            onClick={drawNextCard}
            style={{ ...CardBackStyle, cursor: 'pointer' }}
          >
            <CardBackContent />
          </motion.div>
        )}
      </div>

      <div className="no-print" style={{ position: 'absolute', bottom: '20px', color: '#FFF', opacity: 0.8, fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: '0.5rem' }}>
        SWIPE VPRAVO = Bod pro TEBE.<br/> SWIPE VLEVO = Bod pro NEPŘÍTELE.
      </div>
    </motion.div>
  );
}

function DuelSwipeCard({ card, dragX, onSwipe }) {
  const localX = useMotionValue(0);
  const x = dragX || localX;
  const controls = useAnimation();

  // Stronger rotation for dramatic effect
  const rotate = useTransform(x, [-200, 200], [-45, 45]);
  
  // Smoothly fade in stamps as you drag
  const winStampOpacity = useTransform(x, [20, 150], [0, 1]);
  const loseStampOpacity = useTransform(x, [-20, -150], [0, 1]);

  const handleDragEnd = async (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 100;

    if (offset > swipeThreshold || velocity > 500) {
      await controls.start({ x: 600, opacity: 0, rotate: 45, transition: { duration: 0.3 } });
      onSwipe('right');
    } else if (offset < -swipeThreshold || velocity < -500) {
      await controls.start({ x: -600, opacity: 0, rotate: -45, transition: { duration: 0.3 } });
      onSwipe('left');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      className="duel-card-wrapper"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="duel-card"
        initial={{ rotateY: -90 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.2 }}
      >
        {card.image && images[`../../${card.image}`] ? (
           <img 
             src={images[`../../${card.image}`]} 
             alt={card.name} 
             draggable="false"
             style={{ width: '100%', height: '100%', display: 'block' }} 
           />
        ) : (
           <div style={{ width: '100%', aspectRatio: '2.5/3.5', backgroundColor: '#000', color: '#FF0000', border: '4px solid #000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
             BEZ OBRÁZKU
             <div style={{ marginTop: '1rem', color: '#FFF' }}>{card.name.toUpperCase()}</div>
           </div>
        )}

        <motion.div className="duel-stamp stamp-win" style={{ opacity: winStampOpacity, transform: 'translate(-50%, -50%) rotate(-15deg) scale(1.2)' }}>BOD PRO TEBE!</motion.div>
        <motion.div className="duel-stamp stamp-lose" style={{ opacity: loseStampOpacity, transform: 'translate(-50%, -50%) rotate(15deg) scale(1.2)' }}>ZÁSAH NEPŘÍTELE!</motion.div>
      </motion.div>
    </motion.div>
  );
}
