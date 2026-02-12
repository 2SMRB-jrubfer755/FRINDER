
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Discover from './components/Discover';
import ChatList from './components/ChatList';
import ChatDetail from './components/ChatDetail';
import Rewards from './components/Rewards';
import Groups from './components/Groups';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';
import PremiumOverlay from './components/PremiumOverlay';
import { User, Chat, Message, Group, UserPreferences } from './types';
import { api } from './services/api';

const TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    discover: 'Discover',
    squads: 'Squads',
    chats: 'Chats',
    trophies: 'Trophies',
    settings: 'Settings',
    config: 'Config',
    configSub: 'Customize your gaming experience',
    profileDetails: 'Profile Details',
    appPrefs: 'App Preferences',
    appLanguage: 'App Language',
    langSub: 'Interface and translations',
    pushNotifs: 'Push Notifications',
    notifSub: 'Match alerts and squad updates',
    displayName: 'Display Name',
    discordTag: 'Discord Tag',
    saveChanges: 'Save Changes',
    logout: 'Logout',
    settingsSaved: 'Settings saved successfully!',
    squadsSub: 'Join organized teams and communities',
    me: 'Me',
    premiumTitle: 'Frinder Gold',
    premiumSub: 'Unlock your true potential',
    onboardingTitle: 'Level Up Your Life',
    onboardingSub: 'Register to find your perfect team'
  },
  Spanish: {
    discover: 'Descubrir',
    squads: 'Escuadrones',
    chats: 'Chats',
    trophies: 'Trofeos',
    settings: 'Ajustes',
    config: 'Configuración',
    configSub: 'Personaliza tu experiencia gamer',
    profileDetails: 'Detalles del Perfil',
    appPrefs: 'Preferencias de App',
    appLanguage: 'Idioma de la App',
    langSub: 'Interfaz y traducciones',
    pushNotifs: 'Notificaciones Push',
    notifSub: 'Alertas de match y actualizaciones',
    displayName: 'Nombre Visible',
    discordTag: 'Tag de Discord',
    saveChanges: 'Guardar Cambios',
    logout: 'Cerrar Sesión',
    settingsSaved: '¡Ajustes guardados con éxito!',
    squadsSub: 'Únete a equipos y comunidades',
    me: 'Yo',
    premiumTitle: 'Frinder Gold',
    premiumSub: 'Desbloquea tu potencial real',
    onboardingTitle: 'Sube de Nivel',
    onboardingSub: 'Regístrate para encontrar tu equipo'
  }
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<'splash' | 'landing' | 'onboarding' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState('discover');
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showPremium, setShowPremium] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'Player One',
    avatar: 'https://i.pravatar.cc/300?u=1',
    discord: 'gamer#0001',
    language: 'Spanish',
    notifications: true,
    isPremium: false,
    preferences: {
      ageRange: [18, 30] as [number, number],
      distanceMax: 50,
      interestedIn: [],
      favoriteGames: []
    } as UserPreferences
  });

  useEffect(() => {
    // Initial splash delay
    const timer = setTimeout(() => setAppState('landing'), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await api.users.getAll();
        setUsers(fetchedUsers);

        const fetchedGroups = await api.groups.getAll();
        setGroups(fetchedGroups);

        const fetchedChats = await api.chats.getByUserId('me');
        setChats(fetchedChats);
      } catch (error) {
        console.error("Failed to fetch data, falling back to empty or mock if implemented", error);
        // Fallback for demo purposes if server is not running
        import('./data/mockData').then(module => {
          setUsers(module.MOCK_USERS);
          setGroups(module.MOCK_GROUPS);
        });
      }
    };

    if (appState === 'main') {
      fetchData();
    }
  }, [appState]);

  const t = (key: string) => {
    const lang = userProfile.language || 'English';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['English'];
    return dict[key] || TRANSLATIONS['English'][key] || key;
  };

  const handleCompleteOnboarding = async (data: any) => {
    // Map onboarding data to User model
    const newUserHelper: Partial<User> = {
      name: data.name,
      age: 20, // Default as not in form
      gender: 'Other' as any, // Default
      distance: 0,
      bio: "Ready to play!",
      avatar: data.avatar,
      favoriteGames: data.games || [],
      gameTypes: [], // Default
      isOnline: true,
      personality: data.skills ? data.skills.join(', ') : 'Gamer',
      languages: ['Spanish'],
      discord: data.name.replace(/\s/g, '').toLowerCase() + '#0000',
    };

    try {
      const createdUser = await api.users.create(newUserHelper);
      console.log("User created:", createdUser);

      setUserProfile(prev => ({
        ...prev,
        name: createdUser.name,
        avatar: createdUser.avatar,
        preferences: {
          ...prev.preferences,
          ageRange: [data.minAge || 18, data.maxAge || 99],
          distanceMax: data.distance || 100,
          favoriteGames: data.games || []
        }
      }));
      setAppState('main');
    } catch (err) {
      console.error("Failed to create user in backend, falling back to local state", err);
      // Fallback
      setUserProfile(prev => ({
        ...prev,
        name: data.name || prev.name,
        avatar: data.avatar || prev.avatar,
        preferences: {
          ...prev.preferences,
          ageRange: [data.minAge || 18, data.maxAge || 99],
          distanceMax: data.distance || 100,
          favoriteGames: data.games || []
        }
      }));
      setAppState('main');
    }
  };

  const handleMatch = (user: User) => {
    const existingChat = chats.find(c => c.participants.includes(user.id));
    if (!existingChat) {
      const newChat: Chat = {
        id: `chat_${user.id}`,
        participants: [user.id],
        messages: []
      };
      setChats(prev => [newChat, ...prev]);

      // Persist match/chat
      api.chats.sendMessage({
        participants: ['me', user.id],
        message: null
      }).catch(err => console.error("Failed to create chat in backend", err));
    }
    setActiveTab('chat');
  };

  const handleSendMessage = (chatId: string, message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) return { ...chat, messages: [...chat.messages, message] };
      return chat;
    }));

    // Persist message
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      api.chats.sendMessage({
        chatId: chat.id,
        participants: chat.participants,
        message: message
      }).catch(err => console.error("Failed to send message to backend", err));
    }
  };

  const handleAddGroup = async (group: Group) => {
    try {
      const newGroup = await api.groups.create(group);
      setGroups(prev => [newGroup, ...prev]);
    } catch (err) {
      console.error("Failed to create group", err);
      // Optimistic update
      setGroups(prev => [group, ...prev]);
    }
  };

  if (appState === 'splash') {
    return (
      <div className="h-screen w-screen bg-secondary flex items-center justify-center animate-pulse">
        <h1 className="text-8xl font-display font-bold text-accent italic text-glow tracking-tighter text-center">FRINDER</h1>
      </div>
    );
  }

  if (appState === 'landing') {
    return <LandingPage onEnterApp={() => setAppState('onboarding')} />;
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleCompleteOnboarding} t={t} onBack={() => setAppState('landing')} />;
  }

  const renderScreen = () => {
    if (activeChatId) {
      const chat = chats.find(c => c.id === activeChatId);
      const user = users.find(u => u.id === (chat?.participants[0]));
      if (chat && user) {
        return <ChatDetail chat={chat} user={user} onSendMessage={handleSendMessage} onBack={() => setActiveChatId(null)} />;
      }
    }

    switch (activeTab) {
      case 'discover': return <Discover onMatch={handleMatch} preferences={userProfile.preferences} users={users} />;
      case 'chat': return <ChatList users={users} chats={chats} onSelectChat={setActiveChatId} />;
      case 'groups': return <Groups groups={groups} users={users} onAddGroup={handleAddGroup} t={t} />;
      case 'rewards': return <Rewards />;
      case 'settings': return <Settings userProfile={userProfile} onUpdateProfile={(u) => setUserProfile(p => ({ ...p, ...u }))} t={t} onShowPremium={() => setShowPremium(true)} />;
      default: return <Discover onMatch={handleMatch} preferences={userProfile.preferences} users={users} />;
    }
  };

  return (
    <div className="relative overflow-hidden h-screen w-screen">
      <Layout activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setActiveChatId(null); }} t={t}>
        {renderScreen()}
      </Layout>
      {showPremium && <PremiumOverlay onClose={() => setShowPremium(false)} t={t} />}
    </div>
  );
};

export default App;
