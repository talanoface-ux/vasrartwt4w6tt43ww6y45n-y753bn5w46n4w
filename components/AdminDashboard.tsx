import React, { useState, useMemo } from 'react';
import { Page, Conversation, Character } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import CharacterEditorModal from './CharacterEditorModal';
import { PencilIcon, TrashIcon, PlusIcon } from './icons';


interface AdminDashboardProps {
  navigate: (page: Page) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
}

const ADMIN_PASSWORD = 'supersecretpassword';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, isAdmin, setIsAdmin, characters, setCharacters }) => {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', []);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'characters'>('conversations');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState<Character | null>(null);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [conversations]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setError('');
    } else {
      setError('رمز عبور نادرست است.');
    }
    setPassword('');
  };
  
  const handleDeleteConversation = (id: string) => {
    if (window.confirm('آیا از حذف این مکالمه مطمئن هستید؟')) {
      setConversations(prev => prev.filter(c => c.id !== id));
      if (selectedConversation?.id === id) {
        setSelectedConversation(null);
      }
    }
  };
  
  const exportToCSV = () => {
    const headers = ['conversationId', 'messageId', 'timestamp', 'role', 'content'];
    const rows = conversations.flatMap(conv => 
      conv.messages.map(msg => [
        conv.id,
        msg.id,
        msg.timestamp,
        msg.role,
        `"${msg.content.replace(/"/g, '""')}"`
      ])
    );
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n' 
      + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "conversations_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleOpenModal = (character: Character | null = null) => {
    setCharacterToEdit(character);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCharacterToEdit(null);
  };

  const handleSaveCharacter = (character: Character) => {
    if (characterToEdit) {
      setCharacters(prev => prev.map(c => c.id === character.id ? character : c));
    } else {
      setCharacters(prev => [...prev, character]);
    }
    handleCloseModal();
  };
  
  const handleDeleteCharacter = (id: string) => {
    if (window.confirm('آیا از حذف این شخصیت مطمئن هستید؟')) {
      setCharacters(prev => prev.filter(c => c.id !== id));
    }
  };


  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-white">ورود ادمین</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password-admin" className="text-sm font-medium text-slate-300">رمز عبور</label>
              <input
                id="password-admin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 bg-slate-700 text-white border border-slate-600 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="w-full py-2 px-4 font-semibold text-white bg-rose-600 rounded-md hover:bg-rose-700">
              ورود
            </button>
            <button onClick={() => navigate('landing')} type="button" className="w-full py-2 mt-2 text-center text-slate-300 hover:text-rose-400">
              بازگشت به صفحه اصلی
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-900 text-slate-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">داشبورد ادمین</h1>
          <button onClick={() => navigate('landing')} className="px-4 py-2 font-semibold text-slate-200 bg-slate-700 border-slate-600 border rounded-md hover:bg-slate-600">
            خروج از پنل ادمین
          </button>
        </div>
        
        <div className="mb-4 border-b border-slate-700">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs" dir="rtl">
                <button
                    onClick={() => setActiveTab('conversations')}
                    className={`${activeTab === 'conversations' ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    مدیریت مکالمات
                </button>
                <button
                    onClick={() => setActiveTab('characters')}
                    className={`${activeTab === 'characters' ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    مدیریت شخصیت‌ها
                </button>
            </nav>
        </div>

        {activeTab === 'conversations' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1 bg-slate-800 p-4 rounded-lg shadow">
               <h2 className="text-xl font-semibold mb-2 text-white">مکالمات ({conversations.length})</h2>
               <ul className="h-[75vh] overflow-y-auto divide-y divide-slate-700">
                 {sortedConversations.map(conv => (
                   <li key={conv.id} onClick={() => setSelectedConversation(conv)} className={`p-3 cursor-pointer hover:bg-slate-700/50 ${selectedConversation?.id === conv.id ? 'bg-slate-700' : ''}`}>
                     <div className="flex justify-between items-start">
                       <div>
                         <p className="font-semibold">{conv.title}</p>
                         <p className="text-sm text-slate-400">{conv.messages.length} پیام</p>
                         <p className="text-xs text-slate-500">آخرین بروزرسانی: {new Date(conv.lastUpdated).toLocaleString('fa-IR')}</p>
                       </div>
                       <button onClick={(e) => { e.stopPropagation(); handleDeleteConversation(conv.id); }} className="text-red-500 hover:text-red-400 p-1 text-xs">حذف</button>
                     </div>
                   </li>
                 ))}
               </ul>
             </div>
             <div className="md:col-span-2 bg-slate-800 p-4 rounded-lg shadow">
               <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-semibold text-white">گزارش پیام‌ها</h2>
                 <button onClick={exportToCSV} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
                   خروجی CSV از همه
                 </button>
               </div>
               <div className="h-[75vh] overflow-y-auto bg-slate-900 p-3 rounded">
                 {selectedConversation ? (
                   <div>
                     {selectedConversation.messages.map(msg => (
                       <div key={msg.id} className={`p-3 my-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-900/50' : 'bg-slate-700/50'}`}>
                         <p className="text-sm font-bold capitalize text-white">{msg.role}</p>
                         <p className="text-sm text-slate-400">{new Date(msg.timestamp).toLocaleString('fa-IR')}</p>
                         <p className="mt-1 whitespace-pre-wrap text-slate-300">{msg.content}</p>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-slate-500 text-center pt-10">یک مکالمه را برای دیدن پیام‌ها انتخاب کنید.</p>
                 )}
               </div>
             </div>
           </div>
        )}
        
        {activeTab === 'characters' && (
          <div className="bg-slate-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">شخصیت‌ها ({characters.length})</h2>
              <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition"
              >
                <PlusIcon className="w-5 h-5" />
                <span>ساخت شخصیت جدید</span>
              </button>
            </div>
            <div className="h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {characters.map((char) => (
                  <div key={char.id} className="relative rounded-lg overflow-hidden shadow-lg group aspect-[2/3]">
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button onClick={() => handleOpenModal(char)} className="p-2 bg-slate-700/80 rounded-full text-white hover:bg-slate-600">
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCharacter(char.id)} className="p-2 bg-red-600/80 rounded-full text-white hover:bg-red-500">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-lg font-bold">{char.name}, {char.age}</h3>
                        <p className="text-sm opacity-80 mt-1 line-clamp-2">{char.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CharacterEditorModal
          character={characterToEdit}
          onSave={handleSaveCharacter}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;