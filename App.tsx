
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
    onboardingSub: 'Register to find your perfect team',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    avatar: 'Avatar',
    uploadPhoto: 'Upload Photo',
    addYourOwnAvatar: 'Add Your Own Avatar',
    gamingAvatars: 'Gaming Avatars'
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
    onboardingSub: 'Regístrate para encontrar tu equipo',
    theme: 'Tema',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    avatar: 'Avatar',
    uploadPhoto: 'Subir Foto',
    addYourOwnAvatar: 'Añade Tu Propio Avatar',
    gamingAvatars: 'Avatares Gaming'
  }
};

const App: React.FC = () => {
  const defaultProfile = {
    name: 'Player One',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer1',
    discord: 'gamer#0001',
    language: 'Spanish',
    notifications: true,
    isPremium: false,
    theme: 'dark' as 'light' | 'dark',
    preferences: {
      ageRange: [18, 30] as [number, number],
      distanceMax: 50,
      interestedIn: [],
      favoriteGames: []
    } as UserPreferences
  };

  const [appState, setAppState] = useState<'splash' | 'landing' | 'onboarding' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState('discover');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showPremium, setShowPremium] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info'}>>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const [userProfile, setUserProfile] = useState(defaultProfile);

  // Validate session on app mount and fetch user profile if valid
  useEffect(() => {
    const validateSession = async () => {
      try {
        const session = await api.session.getCurrent();
        if (session && session.userId) {
          setCurrentUserId(session.userId);
          // get profile from backend
          try {
            const profile = await api.users.getById(session.userId);
            setUserProfile(prev => ({
              ...prev,
              name: profile.name || prev.name,
              avatar: profile.avatar || prev.avatar,
              discord: profile.discord || prev.discord,
              language: profile.language || prev.language,
              notifications: typeof profile.notifications === 'boolean' ? profile.notifications : prev.notifications,
              theme: profile.theme || prev.theme,
              isPremium: profile.isPremium || prev.isPremium,
              preferences: {
                ...prev.preferences,
                ageRange: [profile.preferences?.minAge || prev.preferences.ageRange[0], profile.preferences?.maxAge || prev.preferences.ageRange[1]],
                distanceMax: profile.preferences?.distanceMax || prev.preferences.distanceMax,
                favoriteGames: profile.preferences?.favoriteGames || prev.preferences.favoriteGames,
              }
            }));
          } catch (profileErr) {
            console.error('Failed to fetch user profile after session validation', profileErr);
          }
          setAppState('main');
        } else {
          setAppState('landing');
        }
      } catch (err) {
        console.log('No valid session, showing landing page');
        setAppState('landing');
      }
    };

    // Initial splash delay before validating session
    const timer = setTimeout(() => {
      validateSession();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply theme from userProfile to document
    if (typeof document !== 'undefined') {
      if (userProfile.theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    }
  }, [userProfile.theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await api.users.getAll();
        setUsers(fetchedUsers);

        const fetchedGroups = await api.groups.getAll();
        setGroups(fetchedGroups);

        if (currentUserId) {
          const fetchedChats = await api.chats.getByUserId(currentUserId);
          setChats(fetchedChats);
        } else {
          setChats([]);
        }
      } catch (error) {
        console.error("Failed to fetch data from backend", error);
        // Do not fallback to local mocks - keep empty arrays so data is consistent with backend
      }
    };

    if (appState === 'main') {
      fetchData();
    }
  }, [appState, currentUserId]);

  const t = (key: string) => {
    const lang = userProfile.language || 'English';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['English'];
    return dict[key] || TRANSLATIONS['English'][key] || key;
  };

  const handleRequestEntrance = async (groupId: string) => {
    if (!currentUserId) return addNotification('Please login to request entrance', 'error');
    try {
      const updatedGroup = await api.groups.join(groupId);
      setGroups(prev => prev.map(g => g._id === updatedGroup._id ? updatedGroup : g));
      addNotification('Entrance request processed', 'success');
    } catch (err) {
      console.error('Failed to request entrance', err);
      addNotification('No se pudo solicitar entrada. Inténtalo de nuevo.', 'error');
    }
  };

  const handlePurchasePremium = async () => {
    if (!currentUserId) return addNotification('Please login to purchase premium', 'error');
    try {
      const updatedUser = await api.users.purchasePremium(currentUserId);
      setUserProfile(prev => ({ ...prev, isPremium: true }));
      addNotification('Gracias por comprar Frinder Gold', 'success');
      setShowPremium(false);
    } catch (err) {
      console.error('Failed to purchase premium', err);
      addNotification('No se pudo completar la compra. Inténtalo de nuevo.', 'error');
    }
  };

  const handleCompleteOnboarding = async (data: any) => {
    if (data.isLoginMode) {
      try {
        const loggedUser = await api.users.login({
          email: data.email,
          password: data.password,
        });

        const loggedUserId = loggedUser.id || loggedUser._id;
        if (loggedUserId) {
          // Create session after successful login
          await api.session.create(loggedUserId);
          setCurrentUserId(loggedUserId);
        }

        setUserProfile(prev => ({
          ...prev,
          name: loggedUser.name || prev.name,
          avatar: loggedUser.avatar || prev.avatar,
          discord: loggedUser.discord || prev.discord,
          language: loggedUser.language || prev.language,
          notifications: typeof loggedUser.notifications === 'boolean' ? loggedUser.notifications : prev.notifications,
          theme: loggedUser.theme || prev.theme,
          isPremium: loggedUser.isPremium || prev.isPremium,
          preferences: {
            ...prev.preferences,
            ageRange: [loggedUser.preferences?.minAge || prev.preferences.ageRange[0], loggedUser.preferences?.maxAge || prev.preferences.ageRange[1]],
            distanceMax: loggedUser.preferences?.distanceMax || prev.preferences.distanceMax,
            favoriteGames: loggedUser.preferences?.favoriteGames || prev.preferences.favoriteGames,
          },
        }));

        setAppState('main');
      } catch (err: any) {
        console.error('Failed to login existing user', err);
        addNotification(err?.message || 'No se pudo iniciar sesión. Revisa email y contraseña.', 'error');
      }
      return;
    }

    // Map onboarding data to User model
    const safeName = (data.name || data.email?.split('@')?.[0] || 'Player One').trim();
    const newUserHelper: Partial<User> = {
      name: safeName,
      age: data.age || 20,
      gender: 'Other' as any, // Default
      distance: data.distance || 25,
      bio: "Ready to play!",
      avatar: data.avatar,
      favoriteGames: data.games || [],
      gameTypes: [], // Default
      isOnline: true,
      personality: data.skills ? data.skills.join(', ') : 'Gamer',
      languages: ['Spanish'],
      discord: safeName.replace(/\s/g, '').toLowerCase() + '#0000',
      email: data.email,
      password: data.password,
      language: 'Spanish',
      notifications: true,
      preferences: {
        minAge: data.minAge || 18,
        maxAge: data.maxAge || 99,
        distanceMax: data.distance || 100,
        favoriteGames: data.games || [],
        skills: data.skills || []
      }
    };

    try {
      const createdUser = await api.users.create(newUserHelper);
      console.log("User created:", createdUser);
      const createdUserId = createdUser.id || createdUser._id;
      if (createdUserId) {
        // Create session after successful registration
        await api.session.create(createdUserId);
        setCurrentUserId(createdUserId);
      }

      setUserProfile(prev => ({
        ...prev,
        name: createdUser.name,
        avatar: createdUser.avatar,
        theme: createdUser.theme || prev.theme,
        isPremium: createdUser.isPremium || prev.isPremium,
        preferences: {
          ...prev.preferences,
          ageRange: [data.minAge || 18, data.maxAge || 99],
          distanceMax: data.distance || 100,
          favoriteGames: data.games || []
        }
      }));
      setAppState('main');
    } catch (err: any) {
      console.error("Failed to create user in backend", err);
      addNotification(err?.message || 'Hubo un error al crear el usuario.', 'error');
      // do not proceed without DB
    }
  };

  const handleMatch = async (user: User) => {
    try {
      const existingChat = chats.find(c => c.participants.includes(user.id));
      if (!existingChat) {
        const savedChat = await api.chats.sendMessage({
          participants: [currentUserId || 'me', user.id],
          message: null
        });
        setChats(prev => [savedChat, ...prev]);
        setActiveChatId((savedChat as any)._id || (savedChat as any).id);
      }
      setActiveTab('chat');
    } catch (err: any) {
      console.error('Failed to create chat in backend', err);
      addNotification('No se pudo iniciar chat.', 'error');
    }
  };

  const handleSendMessage = (chatId: string, message: Message, updatedChat?: Chat) => {
    setChats(prev => prev.map(chat => {
      if ((chat as any)._id === chatId || (chat as any).id === chatId) {
        if (updatedChat) {
          return updatedChat;
        }
        return { ...chat, messages: [...chat.messages, message] };
      }
      return chat;
    }));
  };

  const handleAddGroup = async (group: Group) => {
    try {
      const newGroup = await api.groups.create(group);
      setGroups(prev => [newGroup, ...prev]);
    } catch (err: any) {
      console.error("Failed to create group", err);
      addNotification(err?.message || 'No se pudo crear el grupo.', 'error');
      // do not add locally, require DB
    }
  };

  const handleUpdateProfile = async (updates: any) => {
    if (!currentUserId) {
      setUserProfile(prev => ({ ...prev, ...updates }));
      return;
    }

    const payload = {
      name: updates.name,
      discord: updates.discord,
      language: updates.language,
      notifications: updates.notifications,
      avatar: updates.avatar,
      theme: updates.theme || userProfile.theme
    };

    try {
      const updatedUser = await api.users.update(currentUserId, payload);
      setUserProfile(prev => ({
        ...prev,
        name: updatedUser.name || prev.name,
        avatar: updatedUser.avatar || prev.avatar,
        discord: updatedUser.discord || prev.discord,
        language: updatedUser.language || prev.language,
        notifications: typeof updatedUser.notifications === 'boolean' ? updatedUser.notifications : prev.notifications,
        theme: updatedUser.theme || prev.theme,
        isPremium: updatedUser.isPremium || prev.isPremium
      }));
    } catch (error) {
      console.error('Failed to update profile', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await api.session.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setCurrentUserId(null);
    setUserProfile(defaultProfile);
    setAppState('landing');
    setActiveTab('discover');
  };

  if (appState === 'splash') {
    return (
      <div className="h-screen w-screen bg-secondary flex items-center justify-center animate-pulse">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-accent italic text-glow tracking-tight text-center">FRINDER</h1>
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
      const chat = chats.find(c => c.id === activeChatId || (c._id && c._id === activeChatId));
      const participantId = chat?.participants?.find(p => p !== (currentUserId || 'me')) || chat?.participants?.[0];
      const user = users.find(u => u.id === participantId || u._id === participantId);
      if (chat && user) {
        return <ChatDetail chat={chat} user={user} currentUserId={currentUserId} onSendMessage={handleSendMessage} onBack={() => setActiveChatId(null)} onNotification={addNotification} />;
      }
    }

    switch (activeTab) {
      case 'discover': return <Discover onMatch={handleMatch} preferences={userProfile.preferences} users={users} currentUserId={currentUserId} onNotification={addNotification} />;
      case 'chat': return <ChatList users={users} chats={chats} currentUserId={currentUserId} onSelectChat={setActiveChatId} onNotification={addNotification} />;
      case 'groups': return <Groups groups={groups} users={users} currentUserId={currentUserId} onAddGroup={handleAddGroup} onRequestEntrance={handleRequestEntrance} t={t} onNotification={addNotification} />;
      case 'rewards': return <Rewards currentUserId={currentUserId} onNotification={addNotification} />;
      case 'settings': return <Settings userProfile={userProfile} onUpdateProfile={handleUpdateProfile} t={t} onShowPremium={() => setShowPremium(true)} theme={userProfile.theme} onThemeChange={(newTheme) => setUserProfile(prev => ({ ...prev, theme: newTheme }))} onLogout={handleLogout} onBack={() => setActiveTab('discover')} onNotification={addNotification} />;
      default: return <Discover onMatch={handleMatch} preferences={userProfile.preferences} users={users} currentUserId={currentUserId} />;
    }
  };

  return (
    <div className="relative overflow-hidden h-screen w-screen">
      <Layout activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setActiveChatId(null); }} t={t}>
        {renderScreen()}
      </Layout>
      {showPremium && <PremiumOverlay onClose={() => setShowPremium(false)} t={t} currentUserId={currentUserId} onPurchase={handlePurchasePremium} />}
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-in slide-in-from-right duration-300 ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
