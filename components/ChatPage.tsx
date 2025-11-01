import React, { useState, useRef, useEffect } from 'react';
import { Page, Personality, Message, Role, Conversation, SafetyLevel, Character } from '../types';
import { getChatResponse } from '../services/geminiService';
import useLocalStorage from '../hooks/useLocalStorage';
import ChatMessage from './ChatMessage';
import { SendIcon, DownloadIcon, PlusIcon, ChevronDownIcon, CogIcon, SparklesIcon } from './icons';

interface ChatPageProps {
  navigate: (page: Page) => void;
  character: Character | null;
  setCharacterToChat: (character: Character | null) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ navigate, character, setCharacterToChat }) => {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
  const [activeConversationId, setActiveConversationId] = useLocalStorage<string | null>('activeConversationId', null);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewChatWithCharacter = (char: Character) => {
    const newConversation: Conversation = {
      id: `conv_${char.id}_${Date.now()}`,
      title: `چت با ${char.name}`,
      messages: [],
      personality: Personality.FRIENDLY, // Set a default, but it's driven by systemPrompt now
      systemPrompt: char.systemPrompt,
      safetyLevel: SafetyLevel.DEFAULT,
      lastUpdated: new Date().toISOString(),
      characterId: char.id,
    };
    setConversations(prev => [newConversation, ...prev.filter(c => c.id !== newConversation.id)]);
    setActiveConversationId(newConversation.id);
  };
  
  useEffect(() => {
    if (character) {
      startNewChatWithCharacter(character);
      setCharacterToChat(null); // Reset character prop to prevent re-triggering
    } else if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id)
    } else if (!activeConversationId && conversations.length === 0) {
        // If there are no conversations at all, navigate back to landing
        navigate('landing');
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, activeConversationId, conversations, navigate, setCharacterToChat]);
  
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const updateConversation = (updatedConversation: Conversation) => {
    setConversations(prev => 
        prev.map(c => c.id === updatedConversation.id ? updatedConversation : c)
    );
  };

  const setMessages = (newMessages: Message[]) => {
    if (activeConversation) {
        updateConversation({...activeConversation, messages: newMessages, lastUpdated: new Date().toISOString()});
    }
  }

  const setSafetyLevel = (safetyLevel: SafetyLevel) => {
    if (activeConversation) {
        updateConversation({
            ...activeConversation,
            safetyLevel,
            lastUpdated: new Date().toISOString()
        });
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading || !activeConversation) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: Role.USER,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...activeConversation.messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getChatResponse(updatedMessages, activeConversation.systemPrompt, activeConversation.safetyLevel);
      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: Role.ASSISTANT,
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: Role.ASSISTANT,
        content: 'متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.',
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = (format: 'txt' | 'json') => {
    if (!activeConversation) return;
    let content = '';
    let MimeType = '';
    let fileExtension = '';

    if (format === 'txt') {
        content = activeConversation.messages
            .map(m => `[${new Date(m.timestamp).toLocaleString('fa-IR')}] ${m.role}:\n${m.content}`)
            .join('\n\n');
        MimeType = 'text/plain';
        fileExtension = 'txt';
    } else {
        content = JSON.stringify(activeConversation, null, 2);
        MimeType = 'application/json';
        fileExtension = 'json';
    }

    const blob = new Blob([content], { type: MimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${activeConversation.id}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleNewCharacterChat = () => {
      navigate('landing');
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-slate-800 shadow-2xl rounded-lg my-0 sm:my-4 text-slate-200">
      <header className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50 rounded-t-lg">
        <div>
          <h1 className="text-xl font-bold text-white">{activeConversation?.title || 'همراه هوش مصنوعی'}</h1>
        </div>
        <div className="flex items-center gap-2">
            <button title="شخصیت جدید" onClick={handleNewCharacterChat} className="p-2 rounded-full hover:bg-slate-700 transition">
                <PlusIcon className="w-6 h-6 text-rose-400" />
            </button>
            <div className="relative">
                <button title="خروجی گرفتن از چت" onClick={() => handleExport('txt')} className="p-2 rounded-full hover:bg-slate-700 transition">
                    <DownloadIcon className="w-6 h-6 text-rose-400" />
                </button>
            </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 bg-slate-800">
        {activeConversation?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <SparklesIcon className="w-16 h-16 text-slate-600 mb-4"/>
                <p className="text-lg">همراه هوش مصنوعی شما آماده گفتگو است.</p>
                <p>برای شروع مکالمه، یک پیام ارسال کنید!</p>
            </div>
        ) : (
            activeConversation?.messages.map(msg => <ChatMessage key={msg.id} message={msg} />)
        )}
        {isLoading && (
          <div className="flex items-start gap-3 my-4 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md bg-slate-700 text-slate-200 rounded-bl-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-lg">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="پیام خود را به فارسی تایپ کنید..."
            className="w-full pl-4 pr-12 py-3 bg-slate-700 text-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none placeholder:text-slate-400"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || input.trim() === ''}
            className="absolute right-2 p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 disabled:bg-slate-600 transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2">
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
            <CogIcon className="w-4 h-4"/>
            <span>تنظیمات پیشرفته</span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>
          {showSettings && (
             <div className="mt-2 p-4 bg-slate-800 rounded-lg border border-slate-700 animate-fade-in-down">
                <label className="block text-sm font-medium text-slate-300">سطح ایمنی</label>
                <select 
                    value={activeConversation?.safetyLevel}
                    onChange={(e) => setSafetyLevel(e.target.value as SafetyLevel)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-700 text-slate-200 border-slate-600 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md"
                >
                    {Object.values(SafetyLevel).map(level => <option key={level} value={level}>{level}</option>)}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                    میزان فیلتر شدن محتوای بالقوه مضر را کنترل می‌کند. «بدون فیلتر» ممکن است منجر به پاسخ‌های نامناسب شود.
                </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;