import React, { useState, useEffect, FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSound } from "./SoundContext";
import LoadingSpinner from "./LoadingSpinner";

// --- Reusable Components ---

type ChoiceButtonProps = {
  text: string;
  disabled?: boolean;
  onClick: () => void;
};

const ChoiceButton: FC<ChoiceButtonProps> = ({ text, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="glow-on-hover w-full bg-stone-900/40 hover:bg-[#f2a20d] text-[#f2a20d] hover:text-[#1a1611] font-bold py-3 px-4 rounded-lg border border-stone-800/50 transition-all duration-300 ease-in-out transform hover:scale-105"
  >
    {text}
  </button>
);

type GameEndScreenProps = {
  outcome: "success" | "failure";
  message: string;
  onRestart: () => void;
};

const GameEndScreen: FC<GameEndScreenProps> = ({ outcome, message, onRestart }) => (
  <div className="text-center p-8">
    <h2
      className={`font-newsreader text-4xl font-bold mb-4 ${
        outcome === "success" ? "text-green-400" : "text-red-400"
      }`}
    >
      {outcome === "success" ? "Victory!" : "Game Over"}
    </h2>
    <p className="text-stone-300 text-lg mb-8">{message}</p>
    <div className="flex flex-col items-center space-y-4 max-w-xs mx-auto">
        {outcome === "failure" && (
            <ChoiceButton
                text={"Restart Game"}
                onClick={onRestart}
            />
        )}
        <Link to="/" className="w-full">
            <ChoiceButton
                text={"Start New Game"}
                onClick={() => {}}
            />
        </Link>
    </div>
  </div>
);


// --- Main Game Page Component ---

const GamePage: FC = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameId, setGameId] = useState<string | null>(null);
  const { playRandomVoiceLine, playNarration } = useSound();
  const [areChoicesDisabled, setAreChoicesDisabled] = useState(false);

  useEffect(() => {
    const startGame = async () => {
      const { theme, game_id } = location.state || {};

      if (!theme || !game_id) {
        // Handle case where state is not passed correctly
        console.error("Theme or game_id data not found in location state.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("theme", theme);
      formData.append("game_id", game_id);


      // if (character.mode === "selfie") {
      //   formData.append("gender", character.gender);
      //   if (character.file) {
      //     formData.append("selfie_file", character.file);
      //   }
      // } else {
      //   formData.append("animal", character.animal);
      //   formData.append(
      //     "personalities",
      //     JSON.stringify(character.personalities)
      //   );
      //   formData.append("accessories", JSON.stringify(character.accessories));
      // }

      try {
        const response = await fetch("/api/start_game", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setCurrentStep(data.step);
        setGameId(game_id);
      } catch (error) {
        console.error("Error starting game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    startGame();
  }, [location.state]);

  useEffect(() => {
    // const playOutcomeSound = async () => {
    //   if (currentStep && currentStep.outcome) {
    //     await playRandomVoiceLine(currentStep.outcome);
    //   }
    // };
    // playOutcomeSound();

    const playNarrationSound = async () => {
      if (currentStep && currentStep.narration_audio_url) {
        setAreChoicesDisabled(true);
        await playNarration(currentStep.narration_audio_url);
        setAreChoicesDisabled(false);
      }
    };
    playNarrationSound();
  }, [currentStep, playNarration, playRandomVoiceLine]);

  const handleChoice = async (choiceIndex: number) => {
    if (!gameId || !currentStep) return;

    await playRandomVoiceLine("comment");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("game_id", gameId);
    formData.append("current_step_id", currentStep.id);
    formData.append("choice_index", choiceIndex.toString());

    try {
      const response = await fetch("/api/next_step", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setCurrentStep(data.step);
    } catch (error) {
      console.error("Error taking next step:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (!currentStep) {
      return (
        <p className="text-center text-red-500">
          Could not load game data. Please try again.
        </p>
      );
    }

    const handleGameRestart = async () => {
      if (!gameId) return;

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("game_id", gameId);

        const response = await fetch(`/api/restart_game`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setCurrentStep(data.step);
      } catch (error) {
        console.error("Error restarting game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentStep.is_ending) {
        return <GameEndScreen outcome={currentStep.outcome} message={currentStep.narration} onRestart={handleGameRestart} />
    }

    return (
      <div className="md:flex h-full">
        {/* Left Column (The Narrative) */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="font-newsreader text-2xl md:text-3xl font-bold text-[#f2a20d] mb-4 border-b-2 border-[#493b22] pb-2">
              The Story So Far
            </h2>
            <p className="text-stone-300 text-base md:text-lg leading-relaxed">
              {currentStep.narration}
            </p>
          </div>

          {currentStep.choices.length > 0 && (
            <div className="mt-8">
              <h3 className="font-newsreader text-xl text-[#f2a20d] mb-4">
                Your Choice...
              </h3>
              <div className="space-y-4">
                {currentStep.choices.map((choice: any, index: number) => (
                  <ChoiceButton
                    key={index}
                    text={choice.text}
                    disabled={areChoicesDisabled}
                    onClick={() => handleChoice(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (The Scene) */}
        <div className="w-full md:w-3/5 p-4 bg-black/30">
          <div className="aspect-[9/16] w-full max-w-md mx-auto h-full rounded-lg overflow-hidden shadow-lg shadow-black/50 border-2 border-stone-800/50">
            <img
              src={currentStep.scene_image_url}
              alt="Current game scene"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#1a1611] text-white">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gravel.png')] opacity-5"></div>
      <div className="w-full max-w-6xl min-h-[80vh] bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default GamePage;