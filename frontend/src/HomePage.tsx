import React, { useEffect } from 'react';
import { useSound } from './SoundContext';
import { Link } from 'react-router-dom';

// Header Component
const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap bg-[#1a1611]/80 px-10 py-4 backdrop-blur-sm border-b border-solid border-b-[#493b22]">
      <div className="flex items-center gap-4">
        <div className="size-6 text-[var(--primary-color)]">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
            <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight">Banana Split Stories</h2>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link className="hover:text-white transition-colors" to="/">Home</Link>
          <Link className="hover:text-white transition-colors" to="/about">About</Link>
          {/* <Link className="hover:text-white transition-colors" to="/themes">Themes</Link>
          <Link className="hover:text-white transition-colors" to="/community">Community</Link> */}
        </nav>
        {/* <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 bg-[var(--primary-color)] text-[#1a1611] text-sm font-bold tracking-wide hover:bg-amber-400 transition-colors">
          <span className="truncate">Play Now</span>
        </button> */}
        <button className="md:hidden text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
};

// HeroSection Component
const HeroSection: React.FC = () => {
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
          style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}
        >
          Banana Split Stories
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Craft your own adventure in a world of endless possibilities.
        </p>
        <button className="mt-8 flex min-w-[84px] mx-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-[#1a1611] text-base font-bold tracking-wide hover:bg-amber-400 transition-transform duration-300 ease-in-out hover:scale-105">
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

const ThemeTile: React.FC<ThemeTileProps> = ({ themeName, description, imageUrl, theme }) => {
  return (
    <Link to="/character-creation" state={{ theme: theme }} className="group flex flex-col rounded-lg overflow-hidden border border-stone-800/50 glow-on-hover bg-stone-900/40">
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

// ThemeSelection Component
const ThemeSelection: React.FC = () => {
  const themes = [
    {
      themeName: 'Haunted Space Station',
      description: 'Explore a derelict space station haunted by unknown entities.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAW4ClLoZEgtXqLXQf4HnipH3lCUgjevAvOiK4TlkFpjCrZm4-k_ANQ1N_6XY2ddP8n-2HW5Zqeo3HKxVOtIaZw1oJ7hDJpdgJzgpdjAQVSjPn49WpmFEX7acrvdWDeQwxLhlbPguG74EUNO5uEBdJaAAM-suKFNcYfOCs5JmIUFyQy43aJVHbB3Tv0wxJI7jSnN5F3fdsMwy5qvDA-LnSGY6Qehc39nx0DVtAihDm1msaoq92aY1YKQFSWPVuNLsOKb_yP6KzZBA',
      theme: 'Haunted Space Station',
    },
    {
      themeName: 'Lost Temple of the Jungle',
      description: 'Uncover the secrets of an ancient temple hidden in the jungle.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDipurnS1MRdW5pJ1SHNPCStyTsTRVmRZOIcA5t9srnOMBwXKxuzeBDP4Xa3EjiWMS6uPKIFrvV1G26z9hMcB2Hx9J8C7B0N-VgUeFtDPA8RbzXZA6rcm7KNyWyfu47AYDUs2MzSLvGVzHM5R73j6Oxgp6duNg_XzL8W6PfU5f9DiWRGksjGAJ2UYY7GMEnyRl9fiFm5ecOOA5SP10rgV7q7Ulaq1Vz0f7-oJ2DdBTvPwgTyNYueMzxG88HDaxUt3QyPlwOd7b-xJc',
      theme: 'Lost Temple of the Jungle',
    },
    {
      themeName: 'Cyberpunk Underworld',
      description: 'Navigate the gritty underworld of a futuristic city.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFFSAMkvxsVQy9uJRHrOdBIrsJ6LNXLOQ8_oMimCnShoBqP9Q-a_5KBWTadJ6ZOhDPs1gvKPADUR_rl4myaqk5C-FqSu5eLJm1n9YT2rUp6ho9gu8jAf1imC8RSjaLgvR4qEZbjbosTnY2mHWDPUDRX2mR-RyuISLRJJ0skBFbGl6343-Igw0isVETkDHzLDcZ9imW6CruZDsu9-k7LgGjBNTapoHMzNQ5jaOOkU2eV78ZOd2aA3_fEeeQvMEfJsvOqGqfSWwYPJk',
      theme: 'Cyberpunk Underworld',
    },
    {
      themeName: 'Curse of the Banana King',
      description: 'Embark on a quest to break the curse of the Banana King.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABcRV32kyCoyvVJ5KL1djQaQw3VO5Fveog2s4gDwWtCdZ0_UMvBmDutwBlpij_gf_2SC-JrxjgiyGZLmkK4I2Wq5HBo-aEkJPF71J6cFk1aksQexfWj1whrWrgG1NDdQHagYU_lDSHp0DcJBqNtpGUEqRvFtyBUKPkQTbl4ZRcekeca6LaxOKAtJy8Peg3bN5ChzaRTlPUziJVw8O5xxJGfKihmnHGK5mXIpMronA_SprJw1OrLWPL81wbJsa6p8_2cHbsTnWxvWw',
      theme: 'Curse of the Banana King',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
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
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14110d] border-t border-solid border-b-[#493b22]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
            <Link className="text-stone-400 hover:text-white transition-colors text-sm" to="/terms">Terms of Service</Link>
            <Link className="text-stone-400 hover:text-white transition-colors text-sm" to="/privacy">Privacy Policy</Link>
            <Link className="text-stone-400 hover:text-white transition-colors text-sm" to="/contact">Contact Us</Link>
          </div>
          <div className="flex justify-center space-x-6">
            <a className="text-stone-400 hover:text-white transition-colors" href="#">
              <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.49-1.74.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.54-.18-6.69-1.87-8.8-4.46-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.7-.02-1.36-.21-1.94-.53v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.13 2.94 4.02 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.58 1.93 7.89 0 12.21-6.54 12.21-12.21 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.22z"></path>
              </svg>
            </a>
            <a className="text-stone-400 hover:text-white transition-colors" href="#">
              <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.087-.636-.034-1.445.14-2.123.194-.74.194-1.474.194-2.213 0-.322.049-.633.14-.925.13-.437.33-.837.597-1.21.31-.437.71-.812 1.198-1.125.56-.375 1.256-.562 2.053-.562 1.463 0 2.65.787 2.65 2.188 0 1.281-.787 2.375-1.875 2.375-.688 0-1.219-.594-1.031-1.344.25-.969.75-2.031 1-2.562.281-.562.531-.812.531-1.156 0-.5-.188-.938-.531-1.281-.406-.406-.969-.625-1.562-.625-1.438 0-2.625 1.25-2.625 3.031 0 .812.25 1.469.625 1.969.063.094.063.156.031.25-.031.125-.156.562-.188.688-.062.219-.25.281-.469.188-1.188-.531-1.938-1.938-1.938-3.469 0-2.469 1.844-4.656 5.031-4.656 2.75 0 4.719 1.875 4.719 4.438 0 2.781-1.562 4.938-3.906 4.938-1.25 0-2.219-.969-1.938-2.125.312-1.281 1.031-2.656 1.031-3.5 0-.781-.375-1.438-1.156-1.438-.906 0-1.656.938-1.656 2.125 0 .656.219 1.188.5 1.562.031.062.031.125.031.188s-.031.156-.062.219c-.062.188-.125.344-.156.469a.839.839 0 0 1-.25.438c-.5.562-1.156.938-1.156 1.75 0 1.156.844 2.094 1.938 2.094.312 0 .625-.062.906-.187.219-.094.406-.219.562-.375l.094-.094.031-.031c1.281-1.094 1.938-2.75 2.125-4 .062-.5.094-1 .094-1.531 0-2.906-2.25-5.344-5.969-5.344C7.052 4.125 4.875 6.312 4.875 9c0 2.25 1.25 4.281 3.156 5.25.125.062.188.188.125.312-.031.094-.062.188-.094.281-.094.344-.156.625-.156.875 0 .75.031 1.5.188 2.219.156.719.219 1.469.125 2.125C5.037 19.954 2.875 16.54 2.875 12.5 2.875 7.25 6.937 3.125 12 3.125S21.125 7.25 21.125 12.5c0 4.04-2.156 7.454-5.281 9.312.063-.656.094-1.375.094-2.062 0-1.156-.094-2.281-.281-3.156-.156-.719-.344-1.406-.594-2.031-.25-.656-.562-1.25-.938-1.75-.406-.531-.875-.969-1.438-1.281-.594-.344-1.312-.5-2.094-.5-1.219 0-2.188.656-2.188 1.875 0 1.094.719 1.969 1.625 1.969.75 0 1.344-.562 1.156-1.469-.219-.938-.719-1.938-.938-2.438-.281-.562-.281-1.062-.281-1.062s.312 1.812.312 1.812z" fillRule="evenodd"></path>
              </svg>
            </a>
            <a className="text-stone-400 hover:text-white transition-colors" href="#">
              <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path>
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
  const { playBackgroundMusic, playRandomVoiceLine } = useSound();

  useEffect(() => {
    playBackgroundMusic();
    playRandomVoiceLine('welcome');
  }, [playBackgroundMusic, playRandomVoiceLine]);

  return (
    <div className="bg-[#1a1611] text-white" style={{ fontFamily: "Newsreader, 'Noto Sans', sans-serif" }}>
      <div className="relative flex size-full min-h-screen flex-col dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* <Header /> */}
          <main className="flex-1">
            <HeroSection />
            <ThemeSelection />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;