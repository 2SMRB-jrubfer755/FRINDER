import React, { useState } from 'react';
import { User, UserPreferences } from '../types';
import { api } from '../services/api';

interface DiscoverProps {
  users: User[];
  onMatch: (user: User) => void;
  preferences: UserPreferences;
  currentUserId?: string | null;
  onUpdateFavorites?: (favorites: string[]) => void;
}

const Discover: React.FC<DiscoverProps> = ({ users, onMatch, preferences, currentUserId, onUpdateFavorites }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());

  // Filter users based on preferences (simplified for demo)
  const filteredUsers = users.filter(u =>
    u.age >= preferences.ageRange[0] &&
    u.age <= preferences.ageRange[1] &&
    u.distance <= preferences.distanceMax &&
    !skipped.has(u.id || u._id)
  );

  const currentUser = filteredUsers[currentIndex] || users[0];

  const handleNext = async () => {
    setShowDetails(false);
    // Skip this user
    try {
      if (currentUserId && currentUser.id) {
        await api.users.skipUser(currentUserId, currentUser.id);
        setSkipped(prev => new Set(prev).add(currentUser.id));
      }
    } catch (err) {
      console.error('Failed to skip user', err);
    }
    
    if (currentIndex < filteredUsers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleLike = async () => {
    // Add to favorites when liking
    if (currentUserId && currentUser.id) {
      try {
        await api.users.addFavorite(currentUserId, currentUser.id);
      } catch (err) {
        console.error('Failed to add to favorites', err);
      }
    }
    onMatch(currentUser);
    handleNext();
  };

  if (!currentUser) return (
    <div className="flex flex-col items-center justify-center py-24 opacity-20">
      <span className="text-6xl md:text-8xl mb-6">🎮</span>
      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-center">No more players in range</h2>
    </div>
  );

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="relative w-full max-w-md md:max-w-xl aspect-[4/5] rounded-[36px] md:rounded-[48px] overflow-hidden card-depth group bg-secondary border border-accent/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)]">
        {/* Background Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-125 transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url(${currentUser.avatar})` }}
        />

        {/* Real Profile Photo */}
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${showDetails ? 'scale-110 blur-sm brightness-50' : 'group-hover:scale-105'}`}
        />

        {/* Overlay Content */}
        {!showDetails && <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-90" />}

        {/* Basic Info */}
        {!showDetails && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pt-12 md:pt-20">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {currentUser.name.split(' ')[0]}, {currentUser.age}
              </h2>
              {currentUser.isOnline && (
                <div className="flex items-center bg-green-500/20 px-4 py-1.5 rounded-full border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse mr-2" />
                  <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Live</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5 mb-5 md:mb-7">
              {currentUser.favoriteGames.slice(0, 3).map(game => (
                <span key={game} className="px-3 md:px-4 py-1.5 md:py-2 glass text-accent text-[10px] md:text-xs font-black rounded-xl md:rounded-2xl uppercase tracking-[0.14em] md:tracking-[0.2em] border border-accent/20">
                  {game}
                </span>
              ))}
              <button
                onClick={() => setShowDetails(true)}
                className="px-3 md:px-4 py-1.5 md:py-2 glass text-white text-[10px] md:text-xs font-black rounded-xl md:rounded-2xl uppercase tracking-[0.14em] md:tracking-[0.2em] border border-white/20 hover:bg-white hover:text-secondary transition-all"
              >
                INFO+
              </button>
            </div>

            <p className="text-white/80 line-clamp-2 mb-6 md:mb-8 text-base md:text-xl font-medium italic leading-snug">
              "{currentUser.bio}"
            </p>

            <div className="flex items-center justify-between px-1 md:px-3">
              <button onClick={handleNext} className="w-14 h-14 md:w-18 md:h-18 rounded-full glass border-accent/20 flex items-center justify-center text-3xl md:text-4xl hover:bg-primary/30 transition-all hover:scale-110 shadow-2xl active:scale-95">👎</button>
              <button onClick={handleLike} className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center text-4xl md:text-5xl shadow-[0_20px_60px_rgba(161,24,24,0.6)] hover:scale-110 transition-all active:scale-95 border-4 border-white/10">🔥</button>
              <button onClick={() => {
                if (!currentUserId) {
                  alert('Por favor, inicia sesión para añadir favoritos');
                  return;
                }
                const isFavorite = currentUser.id && (currentUser as any).favoritedBy?.includes(currentUserId);
                if (isFavorite) {
                  api.users.removeFavorite(currentUserId, currentUser.id).catch(err => console.error('Failed to remove favorite', err));
                } else {
                  api.users.addFavorite(currentUserId, currentUser.id).catch(err => console.error('Failed to add favorite', err));
                }
              }} className={`w-14 h-14 md:w-18 md:h-18 rounded-full glass border-accent/20 flex items-center justify-center text-3xl md:text-4xl hover:bg-yellow-500/30 transition-all hover:scale-110 shadow-2xl active:scale-95 ${(currentUser as any).favoritedBy?.includes(currentUserId) ? 'bg-yellow-400/30' : ''}`}>⭐</button>
            </div>
          </div>
        )}

        {/* Extended Info */}
        {showDetails && (
          <div className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-center animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowDetails(false)} className="absolute top-6 md:top-10 right-6 md:right-10 w-11 h-11 md:w-12 md:h-12 glass rounded-full flex items-center justify-center text-xl md:text-2xl font-bold">✕</button>
            <div className="space-y-6 md:space-y-8">
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-black text-accent mb-2 uppercase tracking-tight">{currentUser.name}</h3>
                <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">Vibe: {currentUser.personality}</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-[0.5em] text-accent/30">Player Bio</h4>
                <p className="text-base md:text-lg leading-snug italic font-medium">"{currentUser.bio}"</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-5">
                <div className="glass p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-accent/30 uppercase tracking-widest mb-3">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.languages.map(l => <span key={l} className="text-sm font-bold text-white">{l}</span>)}
                  </div>
                </div>
                <div className="glass p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-accent/30 uppercase tracking-widest mb-3">Discord</p>
                  <p className="text-sm font-bold text-white truncate">{currentUser.discord || 'Hidden'}</p>
                </div>
              </div>
              <button onClick={handleLike} className="w-full py-4 md:py-5 bg-primary rounded-2xl md:rounded-3xl font-black text-base md:text-xl uppercase tracking-[0.18em] md:tracking-[0.26em] shadow-2xl shadow-primary/40 active:scale-95 transition-all border-2 border-white/10">MATCH NOW</button>
            </div>
          </div>
        )}

        {/* Distance Badge */}
        <div className="absolute top-5 md:top-8 right-5 md:right-8 glass px-3 md:px-5 py-1.5 md:py-2 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] border border-white/10 shadow-2xl">
          📍 {currentUser.distance} KM
        </div>
      </div>
    </div>
  );
};

export default Discover;
