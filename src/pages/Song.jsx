import { useParams, Link } from 'react-router-dom';
import songs from '../../data/songs.json';

const images = import.meta.glob('../../images/*', { eager: true, import: 'default' });

export default function Song() {
  const { id } = useParams();
  const song = songs.find((s) => s.id === id);

  if (!song) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <h2>Heretický text nenalezen! (404)</h2>
        <p>Tato píseň neexistuje ve svatých spisech.</p>
        <Link to="/texty">Zpět na texty</Link>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/texty" style={{ textDecoration: 'none', color: '#666' }}>← Zpět na seznam</Link>
      </div>
      
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{song.title}</h1>
      
      {song.image && images[`../../images/${song.image}`] && (
        <img 
          src={images[`../../images/${song.image}`]} 
          alt={song.title} 
          style={{ width: '100%', height: 'auto', marginBottom: '2rem', border: '1px solid #ccc' }} 
        />
      )}
      
      <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: '1.1rem', lineHeight: '1.6' }}>
        {song.lyrics}
      </div>
    </article>
  );
}
