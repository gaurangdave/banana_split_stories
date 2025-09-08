
/*
  ==============================================================================
  SETUP INSTRUCTIONS
  ==============================================================================
  
  1. Create a `public/audio` directory in your React project.
  2. Place all your static MP3 files in this new directory.
  
  This component expects to find the following files:
  - /audio/background_music.mp3
  - /audio/welcome_01.mp3
  - /audio/welcome_02.mp3
  - /audio/welcome_03.mp3
  - /audio/comment_01.mp3
  - /audio/comment_02.mp3
  - /audio/comment_03.mp3
  - /audio/comment_04.mp3
  - /audio/success_01.mp3
  - /audio/success_02.mp3
  - /audio/success_03.mp3
  - /audio/failure_01.mp3
  - /audio/failure_02.mp3
  - /audio/failure_03.mp3

  Ensure these files are present for the sound features to work correctly.
  
  ==============================================================================
*/

import React, { 
  createContext, 
  useContext, 
  useRef, 
  useCallback, 
  ReactNode,
  useEffect
} from 'react';

// 1. Define TypeScript Interfaces
export type VoiceLineCategory = 'welcome' | 'comment' | 'success' | 'failure';

export interface SoundContextType {
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playRandomVoiceLine: (category: VoiceLineCategory) => void;
  playNarration: (audioUrl: string) => void;
}

// 2. Implement the Context and Provider
const SoundContext = createContext<SoundContextType | null>(null);

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

interface SoundProviderProps {
  children: ReactNode;
}

const welcomeLines = [
  '/static/audio/welcome_01.mp3',
  '/static/audio/welcome_02.mp3',
  '/static/audio/welcome_03.mp3',
];

const commentLines = [
  '/static/audio/comments_01.mp3',
  '/static/audio/comments_02.mp3',
  '/static/audio/comments_03.mp3',
  '/static/audio/comments_04.mp3',
];

const successLines = [
  '/static/audio/success_01.mp3',
  '/static/audio/success_02.mp3',
  '/static/audio/success_03.mp3',
];

const failureLines = [
  '/static/audio/failure_01.mp3',
  '/static/audio/failure_02.mp3',
  '/static/audio/failure_03.mp3',
];

const voiceLineCategories: Record<VoiceLineCategory, string[]> = {
  welcome: welcomeLines,
  comment: commentLines,
  success: successLines,
  failure: failureLines,
};

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    backgroundMusicRef.current = new Audio('/static/audio/background_music.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.1;
  }, []);

  const playBackgroundMusic = useCallback(() => {
    backgroundMusicRef.current?.play().catch(error => {
      console.error("Error playing background music:", error);
    });
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    backgroundMusicRef.current?.pause();
  }, []);

  const playRandomVoiceLine = useCallback((category: VoiceLineCategory) => {
    const lines = voiceLineCategories[category];
    if (lines && lines.length > 0) {
      const randomIndex = Math.floor(Math.random() * lines.length);
      const audio = new Audio(lines[randomIndex]);
      audio.play().catch(error => {
        console.error(`Error playing voice line for category ${category}:`, error);
      });
    }
  }, []);

  const playNarration = useCallback((audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error("Error playing narration:", error);
    });
  }, []);

  const contextValue: SoundContextType = {
    playBackgroundMusic,
    stopBackgroundMusic,
    playRandomVoiceLine,
    playNarration,
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};
