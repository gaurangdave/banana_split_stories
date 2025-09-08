import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CharacterCreationPage from './CharacterCreationPage';
import GamePage from './GamePage';
import ProloguePage from './ProloguePage'; // Import the new ProloguePage
import { SoundProvider } from './SoundContext';
import SoundToggleButton from './SoundToggleButton';

function App() {
  return (
    <SoundProvider>
      <SoundToggleButton />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character-creation" element={<CharacterCreationPage />} />
          <Route path="/prologue" element={<ProloguePage />} /> {/* Add the new route */}
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </SoundProvider>
  );
}

export default App;
