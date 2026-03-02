
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum GameType {
  FPS = 'FPS',
  MOBA = 'MOBA',
  RPG = 'RPG',
  SPORTS = 'Sports',
  MMO = 'MMO',
  INDIE = 'Indie'
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  distance: number;
  bio: string;
  avatar: string;
  favoriteGames: string[];
  gameTypes: GameType[];
  isOnline: boolean;
  personality: string;
  languages: string[];
  discord?: string;
  skills?: string[];
  email?: string;
  password?: string;
  language?: string;
  notifications?: boolean;
  preferences?: {
    minAge?: number;
    maxAge?: number;
    distanceMax?: number;
    favoriteGames?: string[];
    skills?: string[];
  };
}

export interface UserPreferences {
  ageRange: [number, number];
  distanceMax: number;
  interestedIn: Gender[];
  favoriteGames: string[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isAi?: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[]; 
  image: string;
  game: string;
  isPrivate: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  prizePool: string;
  date: string;
  image: string;
  partner: string;
}
