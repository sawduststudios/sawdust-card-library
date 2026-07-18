import { Link } from 'react-router-dom';
import songs from '../../data/songs.json';

export default function Lyrics() {
  return (
    <div>
      <h2 style={{ borderBottom: '2px solid black', paddingBottom: '0.5rem' }}>Posvátné Texty</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {songs.map((song) => (
          <li key={song.id} style={{ margin: '1rem 0' }}>
            <Link to={`/texty/${song.id}`} style={{ fontSize: '1.2rem', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
              📜 {song.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
