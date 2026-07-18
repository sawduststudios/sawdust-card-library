import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Library from './pages/Library';
import Lyrics from './pages/Lyrics';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter basename="/sawdust-card-library">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/kartoteka" element={<Library />} />
          <Route path="/texty" element={<Lyrics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
