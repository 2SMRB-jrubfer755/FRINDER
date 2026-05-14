
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
  level?: number;
  xp?: number;
  frins?: number;
  wins?: number;
  losses?: number;
  matchesPlayed?: number;
  reputation?: number;
  achievements?: string[];
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

export interface Attachment {
  type: 'image' | 'video' | 'file';
  url: string;
  name?: string;
  size?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isAi?: boolean;
  attachments?: Attachment[];
  isEdited?: boolean;
  editedAt?: number;
}

export interface Call {
  id: string;
  initiatorId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  accepted: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: number;
  chatName?: string;
  isPrivate?: boolean;
  mutedBy?: string[];
  calls?: Call[];
  unreadBy?: { userId: string; count: number }[];
}

export interface Group {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  members: string[];
  leader: string;
  image: string;
  game: string;
  isPrivate: boolean;
  level?: number;
  minLevel?: number;
  maxMembers?: number;
  tags?: string[];
  activities?: GroupActivity[];
  announcements?: Announcement[];
  createdAt?: number;
  updatedAt?: number;
}

export interface GroupActivity {
  id: string;
  type: 'match' | 'tournament' | 'practice' | 'event';
  title: string;
  description: string;
  scheduledTime: number;
  participants: string[];
  result?: string;
}

export interface Announcement {
  id: string;
  author: string;
  content: string;
  createdAt: number;
  pinned?: boolean;
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
