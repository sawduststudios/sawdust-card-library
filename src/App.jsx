import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Library from './pages/Library';
import Lyrics from './pages/Lyrics';
import Song from './pages/Song';
import Card from './pages/Card';
import Layout from './components/Layout';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/kartoteka" element={<Library />} />
          <Route path="/kartoteka/:id" element={<Card />} />
          <Route path="/texty" element={<Lyrics />} />
          <Route path="/texty/:id" element={<Song />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
