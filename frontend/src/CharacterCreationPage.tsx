import React, { useState, useMemo, FC, ChangeEvent, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

// Reusable Button Components
type TabButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const TabButton: FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`tab-btn p-4 font-bold text-lg transition-colors ${
      isActive ? "bg-[#f2a20d] text-[#1a1611]" : "bg-transparent text-white"
    } border-r border-stone-800/50 last:border-r-0`}
  >
    {label}
  </button>
);

type ChoiceButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  py?: string;
};

const ChoiceButton: FC<ChoiceButtonProps> = ({
  label,
  isSelected,
  onClick,
  py = "py-3",
}) => (
  <button
    onClick={onClick}
    className={`glow-on-hover font-bold ${py} px-4 rounded-lg border transition-colors ${
      isSelected
        ? "bg-[#f2a20d] text-[#1a1611] border-[#f2a20d]"
        : "bg-stone-900/40 text-[#f2a20d] border-stone-800/50"
    }`}
  >
    {label}
  </button>
);

// Flow-specific Components
type SelfieFlowProps = {
  gender: string | null;
  setGender: (gender: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
};

const SelfieFlow: FC<SelfieFlowProps> = ({
  gender,
  setGender,
  file,
  setFile,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent));
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-newsreader text-xl text-stone-300 mb-4">
          Choose Your Form
        </h2>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <ChoiceButton
            label="Male"
            isSelected={gender === "male"}
            onClick={() => setGender("male")}
          />
          <ChoiceButton
            label="Female"
            isSelected={gender === "female"}
            onClick={() => setGender("female")}
          />
        </div>
      </div>
      <div className="mb-8">
        <h2 className="font-newsreader text-xl text-stone-300 mb-4">
          Imprint Your Visage
        </h2>
        <div className="flex flex-col items-center space-y-4">
            <label
              htmlFor="selfie-upload"
              className="file-input-label cursor-pointer w-full h-48 border-2 border-dashed border-stone-700 rounded-lg flex flex-col items-center justify-center transition-colors hover:border-[#f2a20d] hover:bg-opacity-10"
            >
              <svg
                className="w-12 h-12 text-stone-500 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className={`text-stone-400 ${file ? "text-[#f2a20d]" : ""}`}>
                {file
                  ? `File: ${file.name}`
                  : "Upload Your Selfie to Become the Hero"}
              </span>
              <span className="text-xs text-stone-500 mt-1">
                Your likeness will be preserved, your destiny transformed.
              </span>
            </label>
            <input
              type="file"
              id="selfie-upload"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            {isMobile && (
                <>
                    <input
                        type="file"
                        id="selfie-camera-upload"
                        className="hidden"
                        accept="image/*"
                        capture="user"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="selfie-camera-upload" className="w-full glow-on-hover font-bold py-4 px-4 rounded-lg border transition-colors bg-stone-900/40 text-[#f2a20d] border-stone-800/50 cursor-pointer">
                        Take a Selfie
                    </label>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

type FictionalFlowProps = {
  animal: string | null;
  setAnimal: (animal: string) => void;
  personalities: Set<string>;
  togglePersonality: (p: string) => void;
  accessories: Set<string>;
  toggleAccessory: (a: string) => void;
};

const FictionalFlow: FC<FictionalFlowProps> = ({
  animal,
  setAnimal,
  personalities,
  togglePersonality,
  accessories,
  toggleAccessory,
}) => {
  const animalOptions = ["Wolf", "Raven", "Bear", "Fox", "Dragon"];
  const personalityOptions = [
    "Brave",
    "Cunning",
    "Wise",
    "Mysterious",
    "Jovial",
  ];
  const accessoryOptions = [
    "Glowing Amulet",
    "Worn Leather Pouch",
    "Ornate Dagger",
    "Ancient Tome",
    "Shoulder Pauldron",
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-newsreader text-xl text-stone-300 mb-4">
          Choose Your Spirit Animal
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {animalOptions.map((opt) => (
            <ChoiceButton
              key={opt}
              label={opt}
              isSelected={animal === opt}
              onClick={() => setAnimal(opt)}
              py="py-2"
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="font-newsreader text-xl text-stone-300 mb-4">
          Select Personality (Choose 2)
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {personalityOptions.map((opt) => (
            <ChoiceButton
              key={opt}
              label={opt}
              isSelected={personalities.has(opt)}
              onClick={() => togglePersonality(opt)}
              py="py-2"
            />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="font-newsreader text-xl text-stone-300 mb-4">
          Select Accessories (Choose 2)
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {accessoryOptions.map((opt) => (
            <ChoiceButton
              key={opt}
              label={opt}
              isSelected={accessories.has(opt)}
              onClick={() => toggleAccessory(opt)}
              py="py-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const CharacterCreationPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = location.state?.theme || "Default Theme";

  const [activeTab, setActiveTab] = useState<"selfie" | "fictional">("selfie");

  // Selfie State
  const [selfieGender, setSelfieGender] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  // Fictional State
  const [fictionalAnimal, setFictionalAnimal] = useState<string | null>(null);
  const [personalities, setPersonalities] = useState<Set<string>>(new Set());
  const [accessories, setAccessories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const toggleMultiSelect = (
    item: string,
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    const newSet = new Set(set);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else if (newSet.size < 2) {
      newSet.add(item);
    }
    setter(newSet);
  };

  const isAdventureReady = useMemo(() => {
    if (activeTab === "selfie") {
      return selfieGender !== null && selfieFile !== null;
    }
    if (activeTab === "fictional") {
      return (
        fictionalAnimal !== null &&
        personalities.size === 2 &&
        accessories.size === 2
      );
    }
    return false;
  }, [
    activeTab,
    selfieGender,
    selfieFile,
    fictionalAnimal,
    personalities,
    accessories,
  ]);

  const handleBeginAdventure = async () => {
    // Make it async
    if (!isAdventureReady) return;

    const formData = new FormData();
    formData.append("theme", theme);

    if (activeTab === "selfie") {
      formData.append("gender", selfieGender || "");
      if (selfieFile) {
        formData.append("selfie_file", selfieFile);
      }
    } else {
      formData.append("animal", fictionalAnimal || "");
      formData.append(
        "personalities",
        JSON.stringify(Array.from(personalities))
      );
      formData.append("accessories", JSON.stringify(Array.from(accessories)));
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/prologue", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json();

      if (response.ok) {
        navigate("/prologue", { state: responseData }); // Navigate to prologue with full response
      } else {
        console.error("Error starting game:", responseData);
        alert("Failed to start game. Please try again.");
      }
    } catch (error) {
      console.error("Network error starting game:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#1a1611] text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gravel.png')] opacity-5"></div>
          <div className="w-full max-w-6xl min-h-[80vh] bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
      );
    }

    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 py-10 bg-[#1a1611] text-white selection:bg-[#f2a20d] selection:text-[#1a1611]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gravel.png')] opacity-5"></div>

        <div className="w-full max-w-3xl bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden text-center">
          <div className="p-8">
            <h1 className="font-newsreader text-4xl md:text-5xl font-bold text-[#f2a20d] mb-4">
              Forge Your Hero
            </h1>
            <p className="text-stone-400 mb-8">
              Your journey begins now. Choose your path to create a hero worthy
              of legend.
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-b border-stone-800/50">
            <TabButton
              label="Become the Hero"
              isActive={activeTab === "selfie"}
              onClick={() => setActiveTab("selfie")}
            />
            <TabButton
              label="Create a Character"
              isActive={activeTab === "fictional"}
              onClick={() => setActiveTab("fictional")}
            />
          </div>

          <div className="p-8">
            {activeTab === "selfie" ? (
              <SelfieFlow
                gender={selfieGender}
                setGender={setSelfieGender}
                file={selfieFile}
                setFile={setSelfieFile}
              />
            ) : (
              <FictionalFlow
                animal={fictionalAnimal}
                setAnimal={setFictionalAnimal}
                personalities={personalities}
                togglePersonality={(p) =>
                  toggleMultiSelect(p, personalities, setPersonalities)
                }
                accessories={accessories}
                toggleAccessory={(a) =>
                  toggleMultiSelect(a, accessories, setAccessories)
                }
              />
            )}

            <button
              onClick={handleBeginAdventure}
              disabled={!isAdventureReady}
              className="w-full max-w-sm mx-auto bg-[#f2a20d] text-[#1a1611] text-lg font-bold tracking-wide h-12 px-5 rounded-md hover:bg-amber-400 transition-colors disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed"
            >
              Begin My Adventure
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    // <div className="relative min-h-screen flex items-center justify-center p-4 py-10 bg-[#1a1611] text-white selection:bg-[#f2a20d] selection:text-[#1a1611]">
    //   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gravel.png')] opacity-5"></div>

    //   <div className="w-full max-w-3xl bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden text-center">
    //     {renderContent()}
    //   </div>
    // </div>
    renderContent()
  );
};

export default CharacterCreationPage;