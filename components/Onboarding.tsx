
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: (data: any) => void;
  t: (key: string) => string;
  onBack?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, t, onBack }) => {
  const [step, setStep] = useState(1); // Start directly at account form if chosen from landing
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: 20,
    minAge: 18,
    maxAge: 35,
    distance: 25,
    avatar: 'https://i.pravatar.cc/300?u=1',
    games: [] as string[],
    skills: [] as string[]
  });

  const gamesList = ['Valorant', 'CS2', 'LoL', 'Elden Ring', 'Fifa 24', 'Minecraft', 'Rocket League', 'Apex Legends', 'Dota 2', 'Fortnite'];
  const skillsList = ['Support 🛡️', 'Sniper 🎯', 'Leader 👑', 'Funny 😂', 'Strategic 🧠', 'Tryhard 🔥', 'Chilled 🌊', 'Carry ⚔️', 'Noob 🦆'];
  
  const avatars = [
    'https://i.pravatar.cc/300?u=1',
    'https://i.pravatar.cc/300?u=2',
    'https://i.pravatar.cc/300?u=3',
    'https://i.pravatar.cc/300?u=4',
    'https://i.pravatar.cc/300?u=5',
    'https://i.pravatar.cc/300?u=6',
    'https://i.pravatar.cc/300?u=7',
    'https://i.pravatar.cc/300?u=8',
    'https://i.pravatar.cc/300?u=9',
  ];

  const toggleSelection = (item: string, field: 'games' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
      if (step === 1 && onBack) {
          onBack();
      } else {
          setStep(prev => prev - 1);
      }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Form Info
        return (
          <div className="space-y-10 animate-in slide-in-from-right duration-500 flex flex-col items-center w-full">
            <h2 className="text-5xl font-black text-center text-accent uppercase tracking-tighter italic">{isLoginMode ? 'BIENVENIDO DE VUELTA' : 'NUEVO JUGADOR'}</h2>
            <div className="w-full space-y-6">
              {!isLoginMode && (
                <input 
                  type="text" 
                  placeholder="Nombre de Gamer" 
                  className="w-full glass bg-transparent border-b-2 border-accent/20 p-5 text-xl outline-none focus:border-primary transition-all text-center placeholder:text-accent/20"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              )}
              <input 
                type="email" 
                placeholder="Email de Contacto" 
                className="w-full glass bg-transparent border-b-2 border-accent/20 p-5 text-xl outline-none focus:border-primary transition-all text-center placeholder:text-accent/20"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="Contraseña" 
                className="w-full glass bg-transparent border-b-2 border-accent/20 p-5 text-xl outline-none focus:border-primary transition-all text-center placeholder:text-accent/20"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="flex gap-4 w-full">
                <button onClick={handleBack} className="flex-1 py-6 glass border border-accent/20 text-accent font-black text-xl rounded-[35px] active:scale-95 transition-all">VOLVER</button>
                <button 
                  onClick={isLoginMode ? () => onComplete(formData) : handleNext}
                  disabled={(!isLoginMode && !formData.name) || !formData.email || !formData.password}
                  className="flex-[2] py-6 bg-primary text-white font-black text-xl rounded-[35px] shadow-2xl active:scale-95 transition-all uppercase tracking-widest"
                >
                  {isLoginMode ? 'ENTRAR' : 'CONTINUAR'}
                </button>
            </div>
            <button 
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-accent/40 font-bold uppercase tracking-widest text-xs hover:text-accent"
            >
                {isLoginMode ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        );
      case 2: // Avatar Selection
        return (
          <div className="space-y-10 animate-in slide-in-from-right duration-500 w-full">
            <h2 className="text-4xl font-black text-center text-accent uppercase tracking-widest flex items-center justify-center gap-3 italic">
               <span>📸</span> TU IMAGEN
            </h2>
            <div className="grid grid-cols-3 gap-4 md:gap-6">
                {avatars.map(url => (
                    <button 
                        key={url}
                        onClick={() => setFormData({...formData, avatar: url})}
                        className={`aspect-square rounded-[35px] overflow-hidden border-4 transition-all hover:scale-105 ${formData.avatar === url ? 'border-primary shadow-[0_0_30px_rgba(161,24,24,0.5)] scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    >
                        <img src={url} className="w-full h-full object-cover" alt="avatar" />
                    </button>
                ))}
            </div>
            <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-6 glass border border-accent/20 text-accent font-black text-xl rounded-[35px] active:scale-95 transition-all">ATRÁS</button>
                <button onClick={handleNext} className="flex-[2] py-6 bg-accent text-secondary font-black text-xl rounded-[35px] shadow-2xl active:scale-95 transition-all">CONTINUAR</button>
            </div>
          </div>
        );
      case 3: // Tastes and Skills
        return (
          <div className="space-y-10 animate-in slide-in-from-right duration-500 w-full">
            <h2 className="text-4xl font-black text-center text-accent uppercase tracking-widest flex items-center justify-center gap-3 italic">
               <span>🧬</span> ADN GAMER
            </h2>
            <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
              <div>
                <p className="text-[10px] font-black text-accent/50 uppercase mb-4 tracking-[0.4em]">Títulos Favoritos 🎮</p>
                <div className="flex flex-wrap gap-3">
                  {gamesList.map(g => (
                    <button 
                      key={g}
                      onClick={() => toggleSelection(g, 'games')}
                      className={`px-6 py-2.5 rounded-2xl border-2 font-bold text-sm transition-all ${formData.games.includes(g) ? 'bg-accent text-secondary border-accent shadow-lg shadow-accent/20' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-accent/50 uppercase mb-4 tracking-[0.4em]">Habilidades ⚔️</p>
                <div className="flex flex-wrap gap-3">
                  {skillsList.map(s => (
                    <button 
                      key={s}
                      onClick={() => toggleSelection(s, 'skills')}
                      className={`px-6 py-2.5 rounded-2xl border-2 font-bold text-sm transition-all ${formData.skills.includes(s) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-6 glass border border-accent/20 text-accent font-black text-xl rounded-[35px] active:scale-95 transition-all">ATRÁS</button>
                <button onClick={handleNext} className="flex-[2] py-6 bg-accent text-secondary font-black text-xl rounded-[35px] shadow-2xl active:scale-95 transition-all">¡BUENA PINTA!</button>
            </div>
          </div>
        );
      case 4: // Range and Preferences
        return (
          <div className="space-y-10 animate-in slide-in-from-right duration-500 w-full">
            <h2 className="text-4xl font-black text-center text-accent uppercase tracking-widest flex items-center justify-center gap-3 italic">
               <span>🎯</span> PREFERENCIAS
            </h2>
            <div className="space-y-10">
              <div className="glass p-8 rounded-[40px] border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xs font-black text-accent/50 uppercase tracking-[0.3em]">Distancia Máxima 📍</p>
                  <span className="text-3xl font-black text-accent">{formData.distance} <span className="text-sm opacity-50">KM</span></span>
                </div>
                <input 
                  type="range" min="1" max="100" 
                  className="w-full accent-primary h-3 bg-white/10 rounded-full appearance-none cursor-pointer" 
                  value={formData.distance}
                  onChange={e => setFormData({...formData, distance: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="glass p-8 rounded-[40px] border border-white/5 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xs font-black text-accent/50 uppercase tracking-[0.3em]">Rango de Edad ⏳</p>
                  <span className="text-3xl font-black text-accent">{formData.minAge}-{formData.maxAge} <span className="text-sm opacity-50">AÑOS</span></span>
                </div>
                <div className="flex gap-6">
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-black text-white/30 text-center uppercase">Min</p>
                    <input 
                      type="number" 
                      className="w-full glass p-5 text-center text-2xl font-black rounded-2xl border-2 border-white/5 outline-none focus:border-primary transition-all" 
                      value={formData.minAge}
                      onChange={e => setFormData({...formData, minAge: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] font-black text-white/30 text-center uppercase">Max</p>
                    <input 
                      type="number" 
                      className="w-full glass p-5 text-center text-2xl font-black rounded-2xl border-2 border-white/5 outline-none focus:border-primary transition-all" 
                      value={formData.maxAge}
                      onChange={e => setFormData({...formData, maxAge: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-6 glass border border-accent/20 text-accent font-black text-xl rounded-[35px] active:scale-95 transition-all">ATRÁS</button>
                <button 
                  onClick={() => onComplete(formData)}
                  className="flex-[2] py-6 bg-primary text-white font-black text-2xl rounded-[35px] shadow-[0_20px_50px_rgba(161,24,24,0.4)] active:scale-95 transition-all uppercase tracking-widest"
                >
                  ¡LISTO!
                </button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-secondary flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-xl w-full py-10 flex flex-col items-center">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
