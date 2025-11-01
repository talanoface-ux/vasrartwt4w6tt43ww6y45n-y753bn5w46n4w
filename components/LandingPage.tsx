import React from 'react';
import { Character, Page } from '../types';

interface LandingPageProps {
  onCharacterSelect: (character: Character) => void;
  characters: Character[];
  navigate: (page: Page) => void;
}

const CharacterCard: React.FC<{ 
  character: Character; 
  onSelect: () => void;
}> = ({ character, onSelect }) => {
  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-lg group aspect-[2/3] cursor-pointer"
      onClick={onSelect}
    >
      <img
        src={character.imageUrl}
        alt={character.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      />
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-xl font-bold">{character.name}, {character.age}</h3>
        <p className="text-sm opacity-80 mt-1 line-clamp-2">{character.bio}</p>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onCharacterSelect, characters, navigate }) => {
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            همراه هوش مصنوعی خود را انتخاب کنید
          </h1>
          <p className="mt-2 text-lg text-slate-400">یک شخصیت را برای شروع گفتگو انتخاب کنید.</p>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto">
          {characters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onSelect={() => onCharacterSelect(char)}
            />
          ))}
        </div>
      </main>
      <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>تمام شخصیت‌ها توسط هوش مصنوعی ساخته شده و صرفاً برای سرگرمی هستند.</p>
        <p>این یک برنامه آزمایشی است.</p>
        <div className="mt-4">
          <button onClick={() => navigate('admin')} className="hover:text-rose-400 transition-colors">
            ورود به پنل ادمین
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;