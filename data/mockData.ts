
import { User, Gender, GameType, Tournament, Group } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Elena "Nova"',
    age: 24,
    gender: Gender.FEMALE,
    distance: 5,
    bio: 'Looking for a duo to climb rank in Valorant. I main Sage but can flex. No toxic vibes please! 🎮✨ Let\'s win some RR.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    favoriteGames: ['Valorant', 'League of Legends', 'Overwatch 2'],
    gameTypes: [GameType.FPS, GameType.MOBA],
    isOnline: true,
    personality: 'Friendly, competitive, tactical',
    languages: ['Spanish', 'English'],
    discord: 'nova#0001'
  },
  {
    id: '2',
    name: 'Marcus "Shadow"',
    age: 27,
    gender: Gender.MALE,
    distance: 12,
    bio: 'Old school RPG lover. Currently lost in Elden Ring. Let’s talk lore or help each other with bosses. Souls-like veteran.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    favoriteGames: ['Elden Ring', 'Dark Souls', 'The Witcher 3'],
    gameTypes: [GameType.RPG],
    isOnline: false,
    personality: 'Chill, patient, deep thinker',
    languages: ['English', 'German'],
    discord: 'shadow_m#1337'
  },
  {
    id: '3',
    name: 'Sofia "Bibi"',
    age: 21,
    gender: Gender.FEMALE,
    distance: 2,
    bio: 'CS2 is life. Looking for a full stack to play tournaments. I play entry fragger. 💣 Don\'t peek me.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    favoriteGames: ['Counter-Strike 2', 'Apex Legends'],
    gameTypes: [GameType.FPS],
    isOnline: true,
    personality: 'Aggressive player, funny, high energy',
    languages: ['Spanish', 'French'],
    discord: 'bibi_cs#4444'
  },
  {
    id: '4',
    name: 'Liam "Tank"',
    age: 30,
    gender: Gender.MALE,
    distance: 45,
    bio: 'Casual gamer. Enjoying FIFA and Rocket League after work. Let’s have some fun matches! Weekend warrior.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    favoriteGames: ['FC 24', 'Rocket League', 'NBA 2K'],
    gameTypes: [GameType.SPORTS],
    isOnline: true,
    personality: 'Relaxed, sports fan, social',
    languages: ['English'],
    discord: 'liam_tank#9999'
  },
  {
    id: '5',
    name: 'Jade "Vibe"',
    age: 23,
    gender: Gender.FEMALE,
    distance: 8,
    bio: 'Cozy games only. Stardew Valley and Animal Crossing are my therapy. Building a discord for chill gamers. 🌿',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    favoriteGames: ['Stardew Valley', 'Animal Crossing', 'Minecraft'],
    gameTypes: [GameType.INDIE],
    isOnline: false,
    personality: 'Cozy, creative, kind',
    languages: ['English', 'Japanese'],
    discord: 'jade_vibe#7777'
  },
  {
    id: '6',
    name: 'Alex "Glitch"',
    age: 19,
    gender: Gender.OTHER,
    distance: 15,
    bio: 'Speedrunning indie platformers. I like things fast. Talk to me about Celeste or Hollow Knight! 🦋',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
    favoriteGames: ['Celeste', 'Hollow Knight', 'Dead Cells'],
    gameTypes: [GameType.INDIE],
    isOnline: true,
    personality: 'Fast-paced, eccentric, supportive',
    languages: ['English', 'Spanish'],
    discord: 'glitch_zero#0000'
  }
];

export const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Spanish Valo Queens',
    description: 'Comunidad para chicas que juegan Valorant en España. Buscamos toxicidad 0 y muchas risas.',
    members: ['1', '3', '5'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    game: 'Valorant',
    isPrivate: false
  },
  {
    id: 'g2',
    name: 'Souls Veterans',
    description: 'Praise the sun! Helping each other with boss fights and builds.',
    members: ['2', '4'],
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80',
    game: 'Elden Ring',
    isPrivate: false
  }
];

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Valorant Community Clash',
    game: 'Valorant',
    prizePool: '$5,000 + FRINDER Tokens',
    date: 'Next Saturday, 6:00 PM',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    partner: 'Riot Games'
  },
  {
    id: 't2',
    title: 'Rocket League 2v2 Pro',
    game: 'Rocket League',
    prizePool: 'Logitech G-Pro Keyboards',
    date: 'Dec 15, 8:00 PM',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80',
    partner: 'Logitech'
  },
  {
    id: 't3',
    title: 'CS2 Global Elite Draft',
    game: 'Counter-Strike 2',
    prizePool: '$10,000 + Skins',
    date: 'Jan 2, 4:00 PM',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
    partner: 'Steam'
  }
];
