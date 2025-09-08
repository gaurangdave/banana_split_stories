import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CharacterCreationPage from './CharacterCreationPage';
import GamePage from './GamePage';
import { SoundProvider } from './SoundContext';

function App() {
  return (
    <SoundProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character-creation" element={<CharacterCreationPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </Router>
    </SoundProvider>
  );
}

export default App;
