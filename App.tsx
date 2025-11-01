import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import ChatPage from './components/ChatPage';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPage from './components/PrivacyPage';
import { Page, Character } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { characters as defaultCharacters } from './data/characters';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAdmin, setIsAdmin] = useState(false);
  const [characterToChat, setCharacterToChat] = useState<Character | null>(null);
  const [characters, setCharacters] = useLocalStorage<Character[]>('ai-characters', defaultCharacters);


  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleCharacterSelect = (character: Character) => {
    setCharacterToChat(character);
    navigate('chat');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onCharacterSelect={handleCharacterSelect} characters={characters} navigate={navigate} />;
      case 'chat':
        return <ChatPage navigate={navigate} character={characterToChat} setCharacterToChat={setCharacterToChat} />;
      case 'admin':
        return <AdminDashboard navigate={navigate} setIsAdmin={setIsAdmin} isAdmin={isAdmin} characters={characters} setCharacters={setCharacters} />;
      case 'privacy':
        return <PrivacyPage navigate={navigate} />;
      default:
        return <LandingPage onCharacterSelect={handleCharacterSelect} characters={characters} navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {renderPage()}
    </div>
  );
};

export default App;