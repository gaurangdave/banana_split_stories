import React, { useEffect, FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSound } from "./SoundContext";

const ProloguePage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playNarration } = useSound();
  // const [game_id, setGameId] = React.useState<string | null>(null);
  // const [prologue2, setPrologue] = React.useState<string>("");
  // const [prologue_image_url, setPrologueImageUrl] = React.useState<string>("");
  // const [theme, setTheme] = React.useState<string>("Default Theme");

  // console.log("ProloguePage location state:", location.state);
  // const { prologue } = location.state || {};
  // console.log("ProloguePage prologueText:", prologue, location.state.prologue,location.state);

  const {
    game_id,
    prologue_image_url,
    prologue_narration_url,
    prologue,
    theme,
  } = location.state || {};

  useEffect(() => {
    if (prologue_narration_url) {
      playNarration(prologue_narration_url);
    }
  }, [prologue_narration_url, playNarration]);

  // useEffect(() => {
  //   if(!location.state)
  //     return;

  //   const {  prologue_narration_url } = location.state;

  //   if (prologue_narration_url) {
  //     playNarration(prologue_narration_url);
  //   }

  //   setPrologue(location.state.prologue);
  //   setPrologueImageUrl(location.state.prologue_image_url);
  //   setTheme(location.state.theme);
  //   setGameId(location.state.game_id);

  //   console.log("got prologue:", location.state.prologue);
  // }, [location.state, playNarration]);

  const handleBeginAdventure = () => {
    navigate("/game", {
      state: {
        game_id: game_id,
        theme: theme,
      },
    });
  };

  if (!location.state) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Error: Game state not found. Please start a new game.</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${prologue_image_url})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>{" "}
      {/* Dark overlay */}
      <div className="relative z-10 text-white text-center max-w-3xl mx-auto bg-stone-900/70 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-stone-700">
        <h1 className="font-newsreader text-4xl md:text-5xl font-bold mb-6 text-[#f2a20d] drop-shadow-lg">
          The Adventure Begins...
        </h1>
        <p className="text-lg md:text-xl leading-relaxed mb-10 font-serif">
          {prologue}
        </p>
        <button
          onClick={handleBeginAdventure}
          className="glow-on-hover bg-[#f2a20d] text-[#1a1611] font-bold py-3 px-8 rounded-full text-xl uppercase tracking-wide transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Begin Adventure
        </button>
      </div>
    </div>
  );
};

export default ProloguePage;
