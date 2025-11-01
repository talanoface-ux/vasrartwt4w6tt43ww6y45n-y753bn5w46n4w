export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
}

export enum Personality {
  FRIENDLY = 'Friendly',
  PLAYFUL = 'Playful',
  CALM = 'Calm Supportive',
}

export enum SafetyLevel {
  DEFAULT = 'پیش‌فرض (توصیه می‌شود)',
  RELAXED = 'آسان‌گیر',
  NO_FILTERS = 'بدون فیلتر (با احتیاط استفاده شود)',
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  personality: Personality; // Kept for potential non-character chats
  systemPrompt: string;
  safetyLevel: SafetyLevel;
  lastUpdated: string;
  characterId?: string; // Optional link to a character
}

export interface Character {
  id: string;
  name: string;
  age: number;
  imageUrl: string;
  bio: string;
  systemPrompt: string;
}

export type Page = 'landing' | 'chat' | 'admin' | 'privacy';