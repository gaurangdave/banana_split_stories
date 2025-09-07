import React from 'react';
import { useLocation } from 'react-router-dom';

const GamePage: React.FC = () => {
  const location = useLocation();
  const { theme, character } = location.state || {};

  return (
    <div className="bg-[#1a1611] text-white min-h-screen p-8">
      <h1 className="font-newsreader text-4xl md:text-5xl font-bold text-[#f2a20d] mb-4">Game Page</h1>
      <div className="bg-stone-900/40 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Character Details</h2>
        <p><span className="font-bold">Theme:</span> {theme}</p>
        {character && (
          <div>
            <p><span className="font-bold">Mode:</span> {character.mode}</p>
            {character.mode === 'selfie' ? (
              <div>
                <p><span className="font-bold">Gender:</span> {character.gender}</p>
                <p><span className="font-bold">File Name:</span> {character.file?.name}</p>
              </div>
            ) : (
              <div>
                <p><span className="font-bold">Animal:</span> {character.animal}</p>
                <p><span className="font-bold">Personalities:</span> {character.personalities?.join(', ')}</p>
                <p><span className="font-bold">Accessories:</span> {character.accessories?.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;