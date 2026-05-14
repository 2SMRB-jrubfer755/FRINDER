import React, { useState } from 'react';
import { User, UserPreferences } from '../types';
import { api } from '../services/api';

interface DiscoverProps {
  users: User[];
  onMatch: (user: User) => void;
  preferences: UserPreferences;
  currentUserId?: string | null;
  onUpdateFavorites?: (favorites: string[]) => void;
  onNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Discover: React.FC<DiscoverProps> = ({ users, onMatch, preferences, currentUserId, onUpdateFavorites, onNotification }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());

  // Filter users based on preferences and blocked list
  const filteredUsers = users.filter(u => {
    const userId = u.id || u._id;
    return (
      u.age >= preferences.ageRange[0] &&
      u.age <= preferences.ageRange[1] &&
      u.distance <= preferences.distanceMax &&
      !skipped.has(userId) &&
      !blockedUsers.has(userId)
    );
  });

  const currentUser = filteredUsers[currentIndex] || users[0];
  const currentUserId_str = currentUser ? (currentUser.id || currentUser._id) : null;
  const isFavorite = currentUserId_str ? favorites.has(currentUserId_str) : false;

  // ✅ BOTÓN 1: 👎 PASS/SKIP - Descarta usuario
  const handlePass = async () => {
    setShowDetails(false);
    try {
      if (currentUserId && currentUserId_str && currentUser) {
        await api.users.skipUser(currentUserId, currentUserId_str);
        await api.users.addXP(currentUserId, 10, 'skipped_user');
        setSkipped(prev => new Set(prev).add(currentUserId_str));
        onNotification?.(`Pasaste a ${currentUser.name.split(' ')[0]} 👎`, 'info');
      }
    } catch (err) {
      console.error('Failed to skip user', err);
      onNotification?.('Error al pasar usuario', 'error');
    }
    
    if (currentIndex < filteredUsers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // ✅ BOTÓN 2: 🔥 MATCH - Crea chat y matchea
  const handleMatch = async () => {
    if (!currentUserId) {
      onNotification?.('Por favor, inicia sesión para hacer match', 'error');
      return;
    }

    try {
      // Agregar a favoritos al hacer match
      if (currentUserId_str && currentUser) {
        await api.users.addFavorite(currentUserId, currentUserId_str);
        await api.users.addXP(currentUserId, 25, 'matched_player');
        
        setFavorites(prev => new Set(prev).add(currentUserId_str));
        
        onNotification?.(`¡MATCH CON ${currentUser.name.toUpperCase()}! 🔥🔥`, 'success');
        onMatch(currentUser); // Crea el chat
        
        // Skip automático después del match
        setTimeout(() => handlePass(), 800);
      }
    } catch (err) {
      console.error('Failed to match user', err);
      onNotification?.('Error al hacer match', 'error');
    }
  };

  // ✅ BOTÓN 3: ⭐ SAVE/FAVORITE - Guarda para después
  const handleFavorite = async () => {
    if (!currentUserId) {
      onNotification?.('Por favor, inicia sesión para guardar favoritos', 'error');
      return;
    }

    try {
      if (isFavorite && currentUserId_str) {
        // Remover de favoritos
        await api.users.removeFavorite(currentUserId, currentUserId_str);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentUserId_str);
          return newSet;
        });
        onNotification?.(`Removido de favoritos ⭐`, 'info');
      } else if (currentUserId_str && currentUser) {
        // Agregar a favoritos (sin hacer match)
        await api.users.addFavorite(currentUserId, currentUserId_str);
        await api.users.addXP(currentUserId, 15, 'favorited_player');
        setFavorites(prev => new Set(prev).add(currentUserId_str));
        onNotification?.(`Guardado en favoritos ⭐ ${currentUser.name.split(' ')[0]}`, 'success');
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      onNotification?.('Error al guardar favorito', 'error');
    }
  };

  if (!currentUser || !currentUserId_str) return (
    <div className="flex flex-col items-center justify-center py-24 opacity-20">
      <span className="text-6xl md:text-8xl mb-6">🎮</span>
      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-center">No more players in range</h2>
    </div>
  );

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="relative w-full max-w-md md:max-w-xl aspect-[4/5] rounded-[36px] md:rounded-[48px] overflow-hidden card-depth group bg-secondary-dark dark:bg-secondary-dark bg-secondary-light border border-accent/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)]">
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
        {!showDetails && <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark dark:from-secondary-dark from-secondary-light via-transparent to-transparent opacity-90" />}

        {/* Basic Info */}
        {!showDetails && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pt-12 md:pt-20">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <h2 className="text-3xl md:text-5xl font-black text-accent-dark dark:text-accent-dark text-accent-light tracking-tight">
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

            <p className="text-accent-50/80 line-clamp-2 mb-6 md:mb-8 text-base md:text-xl font-medium italic leading-snug">
              "{currentUser.bio}"
            </p>

            <div className="flex items-center justify-between px-1 md:px-3">
              {/* BOTÓN 1: PASS */}
              <button 
                onClick={handlePass}
                title="Pasar a este usuario"
                className="w-14 h-14 md:w-18 md:h-18 rounded-full glass border-2 border-accent/40 flex items-center justify-center text-3xl md:text-4xl hover:bg-accent/20 transition-all hover:scale-110 shadow-2xl active:scale-95 group"
              >
                <span className="group-hover:animate-bounce">👎</span>
              </button>

              {/* BOTÓN 2: MATCH (Centro, más grande) */}
              <button 
                onClick={handleMatch}
                title="¡HACER MATCH!"
                className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center text-5xl md:text-6xl shadow-[0_20px_60px_rgba(161,24,24,0.8)] hover:scale-110 transition-all active:scale-95 border-4 border-white/20 animate-pulse group relative"
              >
                <span className="group-hover:animate-spin">🔥</span>
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-75"></div>
              </button>

              {/* BOTÓN 3: FAVORITE */}
              <button 
                onClick={handleFavorite}
                title={isFavorite ? "Remover de favoritos" : "Guardar para después"}
                className={`w-14 h-14 md:w-18 md:h-18 rounded-full glass border-2 flex items-center justify-center text-3xl md:text-4xl transition-all hover:scale-110 shadow-2xl active:scale-95 group ${
                  isFavorite 
                    ? 'border-yellow-400/60 bg-yellow-400/20' 
                    : 'border-accent/40 hover:bg-yellow-500/20'
                }`}
              >
                <span className={isFavorite ? 'animate-pulse' : ''}>⭐</span>
              </button>
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

              {/* Competitive Stats */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="glass p-3 md:p-4 rounded-2xl border border-accent/10 text-center">
                  <p className="text-2xl md:text-3xl font-black text-primary">{(currentUser as any).wins || 0}W</p>
                  <p className="text-[10px] text-accent/50 uppercase font-bold">Wins</p>
                </div>
                <div className="glass p-3 md:p-4 rounded-2xl border border-accent/10 text-center">
                  <p className="text-2xl md:text-3xl font-black text-accent">Lv.{(currentUser as any).level || 1}</p>
                  <p className="text-[10px] text-accent/50 uppercase font-bold">Level</p>
                </div>
                <div className="glass p-3 md:p-4 rounded-2xl border border-accent/10 text-center">
                  <p className="text-2xl md:text-3xl font-black text-green-400">{(currentUser as any).frins || 0}</p>
                  <p className="text-[10px] text-accent/50 uppercase font-bold">Frins</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 md:gap-4 pt-4">
                <button 
                  onClick={() => setShowDetails(false)}
                  className="flex-1 py-3 md:py-4 glass text-accent border-2 border-accent/20 rounded-2xl font-black uppercase tracking-[0.14em] text-[10px] md:text-xs hover:bg-accent/10 transition-all"
                >
                  Volver
                </button>
                <button 
                  onClick={handleMatch}
                  className="flex-1 py-3 md:py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.14em] text-[10px] md:text-xs shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all border-2 border-white/10"
                >
                  ¡MATCH AHORA! 🔥
                </button>
              </div>
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
