
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
  useEffect,
  useState
} from 'react';

// 1. Define TypeScript Interfaces
export type VoiceLineCategory = 'welcome' | 'comment' | 'success' | 'failure';

export interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playRandomVoiceLine: (category: VoiceLineCategory) => Promise<void>;
  playNarration: (audioUrl: string) => Promise<void>;
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
  '/audio/welcome_01.mp3',
  '/audio/welcome_02.mp3',
  '/audio/welcome_03.mp3',
];

const commentLines = [
  '/audio/comments_01.mp3',
  '/audio/comments_02.mp3',
  '/audio/comments_03.mp3',
  '/audio/comments_04.mp3',
];

const successLines = [
  '/audio/success_01.mp3',
  '/audio/success_02.mp3',
  '/audio/success_03.mp3',
];

const failureLines = [
  '/audio/failure_01.mp3',
  '/audio/failure_02.mp3',
  '/audio/failure_03.mp3',
];

const voiceLineCategories: Record<VoiceLineCategory, string[]> = {
  welcome: welcomeLines,
  comment: commentLines,
  success: successLines,
  failure: failureLines,
};

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    backgroundMusicRef.current = new Audio('/audio/background_music.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.1;
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prevMuted => {
      const newMuted = !prevMuted;
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.muted = newMuted;
      }
      return newMuted;
    });
  }, []);

  const playBackgroundMusic = useCallback(() => {
    if (isMuted) return;
    backgroundMusicRef.current?.play().catch(error => {
      console.error("Error playing background music:", error);
    });
  }, [isMuted]);

  const stopBackgroundMusic = useCallback(() => {
    backgroundMusicRef.current?.pause();
  }, []);

  const playRandomVoiceLine = useCallback(async (category: VoiceLineCategory): Promise<void> => {
    if (isMuted) return Promise.resolve();
    const lines = voiceLineCategories[category];
    if (lines && lines.length > 0) {
      const randomIndex = Math.floor(Math.random() * lines.length);
      const audio = new Audio(lines[randomIndex]);
      return new Promise((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = (e) => {
          console.error(`Error playing voice line for category ${category}:`, e);
          reject(e);
        };
        audio.play().catch(error => {
          console.error(`Error playing voice line for category ${category}:`, error);
          reject(error);
        });
      });
    }
    return Promise.resolve();
  }, [isMuted]);

  const playNarration = useCallback(async (audioUrl: string): Promise<void> => {
    if (isMuted) return Promise.resolve();
    const audio = new Audio(audioUrl);
    return new Promise((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = (e) => {
        console.error("Error playing narration:", e);
        reject(e);
      };
      audio.play().catch(error => {
        console.error("Error playing narration:", error);
        reject(error);
      });
    });
  }, [isMuted]);

  const contextValue: SoundContextType = {
    isMuted,
    toggleMute,
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
