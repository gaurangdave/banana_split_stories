import React from 'react';
import { useSound } from './SoundContext';

const SoundToggleButton: React.FC = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <span className="material-symbols-outlined">volume_off</span>
      ) : (
        <span className="material-symbols-outlined">volume_up</span>
      )}
    </button>
  );
};

export default SoundToggleButton;
