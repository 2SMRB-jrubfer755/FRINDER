
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Discover from './components/Discover';
import ChatList from './components/ChatList';
import ChatDetail from './components/ChatDetail';
import Rewards from './components/Rewards';
import Groups from './components/Groups';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import PremiumOverlay from './components/PremiumOverlay';
import { User, Chat, Message, Group, UserPreferences } from './types';
import { MOCK_USERS, MOCK_GROUPS } from './data/mockData';

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
  const [appState, setAppState] = useState<'splash' | 'onboarding' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState('discover');
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
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
    const timer = setTimeout(() => setAppState('onboarding'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const t = (key: string) => {
    const lang = userProfile.language || 'English';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['English'];
    return dict[key] || TRANSLATIONS['English'][key] || key;
  };

  const handleCompleteOnboarding = (data: any) => {
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
    }
    setActiveTab('chat');
  };

  const handleSendMessage = (chatId: string, message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) return { ...chat, messages: [...chat.messages, message] };
      return chat;
    }));
  };

  if (appState === 'splash') {
    return (
      <div className="h-screen w-screen bg-secondary flex items-center justify-center animate-pulse">
        <h1 className="text-8xl font-display font-bold text-accent italic text-glow tracking-tighter text-center">FRINDER</h1>
      </div>
    );
  }

  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleCompleteOnboarding} t={t} />;
  }

  const renderScreen = () => {
    if (activeChatId) {
      const chat = chats.find(c => c.id === activeChatId);
      const user = MOCK_USERS.find(u => u.id === (chat?.participants[0]));
      if (chat && user) {
        return <ChatDetail chat={chat} user={user} onSendMessage={handleSendMessage} onBack={() => setActiveChatId(null)} />;
      }
    }

    switch (activeTab) {
      case 'discover': return <Discover onMatch={handleMatch} preferences={userProfile.preferences} />;
      case 'chat': return <ChatList users={MOCK_USERS} chats={chats} onSelectChat={setActiveChatId} />;
      case 'groups': return <Groups groups={groups} onAddGroup={(g) => setGroups(prev => [g, ...prev])} t={t} />;
      case 'rewards': return <Rewards />;
      case 'settings': return <Settings userProfile={userProfile} onUpdateProfile={(u) => setUserProfile(p => ({...p, ...u}))} t={t} onShowPremium={() => setShowPremium(true)} />;
      default: return <Discover onMatch={handleMatch} preferences={userProfile.preferences} />;
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
