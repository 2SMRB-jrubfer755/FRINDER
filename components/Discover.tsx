
import React, { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { User, UserPreferences } from '../types';

interface DiscoverProps {
  onMatch: (user: User) => void;
  preferences: UserPreferences;
}

const Discover: React.FC<DiscoverProps> = ({ onMatch, preferences }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Filter users based on preferences (simplified for demo)
  const filteredUsers = MOCK_USERS.filter(u => 
    u.age >= preferences.ageRange[0] && 
    u.age <= preferences.ageRange[1] &&
    u.distance <= preferences.distanceMax
  );

  const currentUser = filteredUsers[currentIndex] || MOCK_USERS[0];

  const handleNext = () => {
    setShowDetails(false);
    if (currentIndex < filteredUsers.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleLike = () => {
    onMatch(currentUser);
    handleNext();
  };

  if (!currentUser) return (
    <div className="flex flex-col items-center justify-center py-40 opacity-20">
      <span className="text-9xl mb-10">🎮</span>
      <h2 className="text-4xl font-black uppercase tracking-widest text-center">No more players in range</h2>
    </div>
  );

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="relative w-full max-w-xl aspect-[4/5] rounded-[60px] overflow-hidden card-depth group bg-secondary border border-accent/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
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
          <div className="absolute bottom-0 left-0 right-0 p-12 pt-24">
            <div className="flex items-center space-x-4 mb-6">
              <h2 className="text-6xl font-black text-white tracking-tighter">
                {currentUser.name.split(' ')[0]}, {currentUser.age}
              </h2>
              {currentUser.isOnline && (
                <div className="flex items-center bg-green-500/20 px-4 py-1.5 rounded-full border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                   <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse mr-2" />
                   <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Live</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {currentUser.favoriteGames.slice(0, 3).map(game => (
                <span key={game} className="px-5 py-2 glass text-accent text-xs font-black rounded-2xl uppercase tracking-[0.2em] border border-accent/20">
                  {game}
                </span>
              ))}
              <button 
                onClick={() => setShowDetails(true)}
                className="px-5 py-2 glass text-white text-xs font-black rounded-2xl uppercase tracking-[0.2em] border border-white/20 hover:bg-white hover:text-secondary transition-all"
              >
                INFO+
              </button>
            </div>

            <p className="text-white/80 line-clamp-2 mb-10 text-2xl font-medium italic leading-tight">
              "{currentUser.bio}"
            </p>

            <div className="flex items-center justify-between px-4">
              <button onClick={handleNext} className="w-20 h-20 rounded-full glass border-accent/20 flex items-center justify-center text-5xl hover:bg-primary/30 transition-all hover:scale-110 shadow-2xl active:scale-95">👎</button>
              <button onClick={handleLike} className="w-28 h-28 rounded-full bg-primary flex items-center justify-center text-6xl shadow-[0_20px_60px_rgba(161,24,24,0.6)] hover:scale-110 transition-all active:scale-95 border-4 border-white/10">🔥</button>
              <button className="w-20 h-20 rounded-full glass border-accent/20 flex items-center justify-center text-5xl hover:bg-yellow-500/30 transition-all hover:scale-110 shadow-2xl active:scale-95">⭐</button>
            </div>
          </div>
        )}

        {/* Extended Info */}
        {showDetails && (
          <div className="absolute inset-0 z-20 p-12 flex flex-col justify-center animate-in fade-in zoom-in duration-300">
             <button onClick={() => setShowDetails(false)} className="absolute top-12 right-12 w-14 h-14 glass rounded-full flex items-center justify-center text-3xl font-bold">✕</button>
             <div className="space-y-10">
               <div className="text-center">
                 <h3 className="text-5xl font-black text-accent mb-3 uppercase tracking-tighter">{currentUser.name}</h3>
                 <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">Vibe: {currentUser.personality}</p>
               </div>
               <div className="space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-[0.5em] text-accent/30">Player Bio</h4>
                 <p className="text-2xl leading-snug italic font-medium">"{currentUser.bio}"</p>
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="glass p-6 rounded-[35px] border border-white/5">
                   <p className="text-[10px] font-black text-accent/30 uppercase tracking-widest mb-3">Languages</p>
                   <div className="flex flex-wrap gap-2">
                     {currentUser.languages.map(l => <span key={l} className="text-sm font-bold text-white">{l}</span>)}
                   </div>
                 </div>
                 <div className="glass p-6 rounded-[35px] border border-white/5">
                   <p className="text-[10px] font-black text-accent/30 uppercase tracking-widest mb-3">Discord</p>
                   <p className="text-sm font-bold text-white truncate">{currentUser.discord || 'Hidden'}</p>
                 </div>
               </div>
               <button onClick={handleLike} className="w-full py-6 bg-primary rounded-[40px] font-black text-2xl uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 active:scale-95 transition-all border-2 border-white/10">MATCH NOW</button>
             </div>
          </div>
        )}

        {/* Distance Badge */}
        <div className="absolute top-10 right-10 glass px-6 py-3 rounded-full font-black text-xs uppercase tracking-[0.4em] border border-white/10 shadow-2xl">
          📍 {currentUser.distance} KM
        </div>
      </div>
    </div>
  );
};

export default Discover;
