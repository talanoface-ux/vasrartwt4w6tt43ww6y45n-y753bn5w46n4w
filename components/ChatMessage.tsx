import React from 'react';
import { Message, Role } from '../types';
import { UserCircleIcon, SparklesIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-rose-400" />
        </div>
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-lg'
            : 'bg-slate-700 text-slate-200 rounded-bl-lg'
        }`}
      >
        <p>{message.content}</p>
      </div>
      {isUser && (
         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <UserCircleIcon className="w-5 h-5 text-sky-400" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;