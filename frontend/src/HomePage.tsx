import React, { useEffect, useRef } from "react";
import { useSound } from "./SoundContext";
import { Link } from "react-router-dom";

// HeroSection Component
const HeroSection: React.FC<{ onBeginClick: () => void }> = ({
  onBeginClick,
}) => {
  return (
    <section
      className="relative flex min-h-[60vh] md:min-h-[80vh] items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(
          to top,
          rgba(26, 22, 17, 1) 0%,
          rgba(26, 22, 17, 0.3) 50%,
          rgba(26, 22, 17, 1) 100%
        ),
        url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVxzxOqg-IZ5yi1-yKZJdaXMdl_8RGtit2Iy3Aiyx7rNquoRp5eylcUrce3IMHBaEG6d4pwMZvm8nLFKUTYfVfQUqn3nrjiA7378WQ6L7R_l1xPh1mYQu04iH1eEhJEkB6786ND_YyDsSwgcABb97K8Nk_S18kPpL_zdR5iDQjSlImFoqtYEfCQsvscSC3hUr7izYLON0KIDK0jVhqT9vAeRtC17SfGdMmYDGhUVX8qzcV0Y-Y0MhOtkFDfy2kJtpjeP5JP6cjPhA')`,
      }}
    >
      <div className="text-center px-4">
        <h1
          className="text-5xl md:text-7xl font-black tracking-tighter"
          style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)" }}
        >
          Banana Split Stories
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Craft your own adventure in a world of endless possibilities.
        </p>
        <button
          onClick={onBeginClick}
          className="mt-8 flex min-w-[84px] mx-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-[#1a1611] text-base font-bold tracking-wide hover:bg-amber-400 transition-transform duration-300 ease-in-out hover:scale-105"
        >
          <span className="truncate">Begin Your Journey</span>
        </button>
      </div>
    </section>
  );
};

// ThemeTile Component
interface ThemeTileProps {
  themeName: string;
  description: string;
  imageUrl: string;
  theme: string;
}

const ThemeTile: React.FC<ThemeTileProps> = ({
  themeName,
  description,
  imageUrl,
  theme,
}) => {
  return (
    <Link
      to="/character-creation"
      state={{ theme: theme }}
      className="group flex flex-col rounded-lg overflow-hidden border border-stone-800/50 glow-on-hover bg-stone-900/40"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          alt={themeName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          src={imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold leading-tight">{themeName}</h3>
          <p className="text-stone-400 text-sm mt-2">{description}</p>
        </div>
      </div>
    </Link>
  );
};

// ThemeSection Component
const ThemeSection = React.forwardRef<HTMLElement>((props, ref) => {
  const themes = [
    {
      themeName: "Haunted Space Station",
      description:
        "Explore a derelict space station haunted by unknown entities.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDAW4ClLoZEgtXqLXQf4HnipH3lCUgjevAvOiK4TlkFpjCrZm4-k_ANQ1N_6XY2ddP8n-2HW5Zqeo3HKxVOtIaZw1oJ7hDJpdgJzgpdjAQVSjPn49WpmFEX7acrvdWDeQwxLhlbPguG74EUNO5uEBdJaAAM-suKFNcYfOCs5JmIUFyQy43aJVHbB3Tv0wxJI7jSnN5F3fdsMwy5qvDA-LnSGY6Qehc39nx0DVtAihDm1msaoq92aY1YKQFSWPVuNLsOKb_yP6KzZBA",
      theme: "Haunted Space Station",
    },
    {
      themeName: "Lost Temple of the Jungle",
      description:
        "Uncover the secrets of an ancient temple hidden in the jungle.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDipurnS1MRdW5pJ1SHNPCStyTsTRVmRZOIcA5t9srnOMBwXKxuzeBDP4Xa3EjiWMS6uPKIFrvV1G26z9hMcB2Hx9J8C7B0N-VgUeFtDPA8RbzXZA6rcm7KNyWyfu47AYDUs2MzSLvGVzHM5R73j6Oxgp6duNg_XzL8W6PfU5f9DiWRGksjGAJ2UYY7GMEnyRl9fiFm5ecOOA5SP10rgV7q7Ulaq1Vz0f7-oJ2DdBTvPwgTyNYueMzxG88HDaxUt3QyPlwOd7b-xJc",
      theme: "Lost Temple of the Jungle",
    },
    {
      themeName: "Cyberpunk Underworld",
      description: "Navigate the gritty underworld of a futuristic city.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAFFSAMkvxsVQy9uJRHrOdBIrsJ6LNXLOQ8_oMimCnShoBqP9Q-a_5KBWTadJ6ZOhDPs1gvKPADUR_rl4myaqk5C-FqSu5eLJm1n9YT2rUp6ho9gu8jAf1imC8RSjaLgvR4qEZbjbosTnY2mHWDPUDRX2mR-RyuISLRJJ0skBFbGl6343-Igw0isVETkDHzLDcZ9imW6CruZDsu9-k7LgGjBNTapoHMzNQ5jaOOkU2eV78ZOd2aA3_fEeeQvMEfJsvOqGqfSWwYPJk",
      theme: "Cyberpunk Underworld",
    },
    {
      themeName: "Curse of the Banana King",
      description: "Embark on a quest to break the curse of the Banana King.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuABcRV32kyCoyvVJ5KL1djQaQw3VO5Fveog2s4gDwWtCdZ0_UMvBmDutwBlpij_gf_2SC-JrxjgiyGZLmkK4I2Wq5HBo-aEkJPF71J6cFk1aksQexfWj1whrWrgG1NDdQHagYU_lDSHp0DcJBqNtpGUEqRvFtyBUKPkQTbl4ZRcekeca6LaxOKAtJy8Peg3bN5ChzaRTlPUziJVw8O5xxJGfKihmnHGK5mXIpMronA_SprJw1OrLWPL81wbJsa6p8_2cHbsTnWxvWw",
      theme: "Curse of the Banana King",
    },
  ];

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">
          Choose Your Adventure
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {themes.map((theme) => (
            <ThemeTile
              key={theme.themeName}
              themeName={theme.themeName}
              description={theme.description}
              imageUrl={theme.imageUrl}
              theme={theme.theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14110d] border-t border-solid border-b-[#493b22]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
            <Link
              className="text-stone-400 hover:text-white transition-colors text-sm"
              to="/terms"
            >
              Terms of Service
            </Link>
            <Link
              className="text-stone-400 hover:text-white transition-colors text-sm"
              to="/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-stone-400 hover:text-white transition-colors text-sm"
              to="/contact"
            >
              Contact Us
            </Link>
          </div>
          <div className="flex justify-center space-x-6">
            <a
              className="text-stone-400 hover:text-white transition-colors"
              href="#"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.49-1.74.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.54-.18-6.69-1.87-8.8-4.46-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.7-.02-1.36-.21-1.94-.53v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.13 2.94 4.02 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.58 1.93 7.89 0 12.21-6.54 12.21-12.21 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.22z"></path>
              </svg>
            </a>
            <a
              className="text-stone-400 hover:text-white transition-colors"
              href="#"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.087-.636-.034-1.445.14-2.123.194-.74.194-1.474.194-2.213 0-.322.049-.633.14-.925.13-.437.33-.837.597-1.21.31-.437.71-.812 1.198-1.125.56-.375 1.256-.562 2.053-.562 1.463 0 2.65.787 2.65 2.188 0 1.281-.787 2.375-1.875 2.375-.688 0-1.219-.594-1.031-1.344.25-.969.75-2.031 1-2.562.281-.562.531-.812.531-1.156 0-.5-.188-.938-.531-1.281-.406-.406-.969-.625-1.562-.625-1.438 0-2.625 1.25-2.625 3.031 0 .812.25 1.469.625 1.969.063.094.063.156.031.25-.031.125-.156.562-.188.688-.062.219-.25.281-.469.188-1.188-.531-1.938-1.938-1.938-3.469 0-2.469 1.844-4.656 5.031-4.656 2.75 0 4.719 1.875 4.719 4.438 0 2.781-1.562 4.938-3.906 4.938-1.25 0-2.219-.969-1.938-2.125.312-1.281 1.031-2.656 1.031-3.5 0-.781-.375-1.438-1.156-1.438-.906 0-1.656.938-1.656 2.125 0 .656.219 1.188.5 1.562.031.062.031.125.031.188s-.031.156-.062.219c-.062.188-.125.344-.156.469a.839.839 0 0 1-.25.438c-.5.562-1.156.938-1.156 1.75 0 1.156.844 2.094 1.938 2.094.312 0 .625-.062.906-.187.219-.094.406-.219.562-.375l.094-.094.031-.031c1.281-1.094 1.938-2.75 2.125-4 .062-.5.094-1 .094-1.531 0-2.906-2.25-5.344-5.969-5.344C7.052 4.125 4.875 6.312 4.875 9c0 2.25 1.25 4.281 3.156 5.25.125.062.188.188.125.312-.031.094-.062.188-.094.281-.094.344-.156.625-.156.875 0 .75.031 1.5.188 2.219.156.719.219 1.469.125 2.125C5.037 19.954 2.875 16.54 2.875 12.5 2.875 7.25 6.937 3.125 12 3.125S21.125 7.25 21.125 12.5c0 4.04-2.156 7.454-5.281 9.312.063-.656.094-1.375.094-2.062 0-1.156-.094-2.281-.281-3.156-.156-.719-.344-1.406-.594-2.031-.25-.656-.562-1.25-.938-1.75-.406-.531-.875-.969-1.438-1.281-.594-.344-1.312-.5-2.094-.5-1.219 0-2.188.656-2.188 1.875 0 1.094.719 1.969 1.625 1.969.75 0 1.344-.562 1.156-1.469-.219-.938-.719-1.938-.938-2.438-.281-.562-.281-1.062-.281-1.062s.312 1.812.312 1.812z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
            <a
              className="text-stone-400 hover:text-white transition-colors"
              href="#"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  clipRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
          <p className="text-center text-xs text-stone-500">
            © 2024 Banana Split Stories. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};


// HomePage Component
const HomePage: React.FC = () => {
  const { playBackgroundMusic, playRandomVoiceLine, isMuted } = useSound();
  const themeSectionRef = useRef<HTMLElement>(null);

  const handleBeginClick = () => {
    themeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isMuted) return;
    playBackgroundMusic();
    playRandomVoiceLine("welcome");
  }, [isMuted, playBackgroundMusic, playRandomVoiceLine]);

  return (
    <div
      className="bg-[#1a1611] text-white"
      style={{ fontFamily: "Newsreader, 'Noto Sans', sans-serif" }}
    >
      <div className="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* <Header /> */}
          <main className="flex-1">
            <HeroSection onBeginClick={handleBeginClick} />
            <ThemeSection ref={themeSectionRef} />
          </main>
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};


export default HomePage;
