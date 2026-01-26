
import React, { useState } from 'react';

interface SettingsProps {
  userProfile: any;
  onUpdateProfile: (updates: any) => void;
  t: (key: string) => string;
  onShowPremium: () => void;
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile, t, onShowPremium, onBack }) => {
  const [localName, setLocalName] = useState(userProfile.name);
  const [localDiscord, setLocalDiscord] = useState(userProfile.discord);
  const [localLang, setLocalLang] = useState(userProfile.language);
  const [localNotifs, setLocalNotifs] = useState(userProfile.notifications);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile({
        name: localName,
        discord: localDiscord,
        language: localLang,
        notifications: localNotifs
      });
      setIsSaving(false);
      alert(t('settingsSaved') || 'Settings saved successfully!');
    }, 1000);
  };

  const avatars = [
    'https://i.pravatar.cc/400?u=1',
    'https://i.pravatar.cc/400?u=2',
    'https://i.pravatar.cc/400?u=3',
    'https://i.pravatar.cc/400?u=4',
    'https://i.pravatar.cc/400?u=5',
  ];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="w-14 h-14 glass rounded-full flex items-center justify-center text-2xl md:hidden">←</button>
          )}
          <div>
            <h2 className="text-7xl font-display font-bold text-accent mb-3 tracking-tighter italic text-glow uppercase">{t('config')}</h2>
            <p className="text-accent/60 text-xl uppercase font-bold tracking-widest">{t('configSub')}</p>
          </div>
        </div>
        {!userProfile.isPremium && (
          <button onClick={onShowPremium} className="hidden md:block px-8 py-3 bg-accent text-secondary font-black rounded-full animate-bounce shadow-xl uppercase tracking-tighter text-sm">GO GOLD</button>
        )}
      </header>

      {/* Account Section */}
      <section className="space-y-8">
        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary">{t('profileDetails')}</h3>
        <div className="glass p-10 rounded-[50px] border border-accent/10 space-y-10 shadow-2xl">
           <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative group">
                <img src={userProfile.avatar} className="w-32 h-32 rounded-[40px] object-cover border-4 border-primary shadow-2xl transition-transform group-hover:scale-105" />
                <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-accent text-secondary rounded-2xl flex items-center justify-center text-3xl shadow-2xl">⚡</div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-4xl font-black text-white uppercase tracking-tighter">{userProfile.name}</h4>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                   <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">LV. 42</span>
                   <span className="bg-accent/20 text-accent px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">Elite Gamer</span>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest block">{t('displayName')}</label>
                <input 
                  value={localName} 
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full glass bg-white/5 border-b-4 border-accent/10 py-4 px-2 text-2xl font-bold focus:border-primary outline-none transition-all rounded-t-2xl" 
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest block">{t('discordTag')}</label>
                <input 
                  value={localDiscord}
                  onChange={(e) => setLocalDiscord(e.target.value)}
                  className="w-full glass bg-white/5 border-b-4 border-accent/10 py-4 px-2 text-2xl font-bold focus:border-primary outline-none transition-all rounded-t-2xl" 
                />
              </div>
           </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-8">
        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary">{t('appPrefs')}</h3>
        <div className="space-y-6">
           <div className="glass p-10 rounded-[40px] flex items-center justify-between border border-accent/5 hover:border-accent/20 transition-all shadow-xl">
              <div>
                <h5 className="font-black text-3xl uppercase tracking-tighter">{t('appLanguage')}</h5>
                <p className="text-base text-accent/50 font-medium">{t('langSub')}</p>
              </div>
              <select 
                value={localLang} 
                onChange={(e) => setLocalLang(e.target.value)}
                className="bg-secondary text-accent font-black px-8 py-4 rounded-[25px] border-4 border-accent/20 outline-none cursor-pointer hover:border-primary transition-all text-xl shadow-lg"
              >
                <option value="English">ENGLISH</option>
                <option value="Spanish">ESPAÑOL</option>
                <option value="French">FRANÇAIS</option>
                <option value="Japanese">日本語</option>
              </select>
           </div>

           <div className="glass p-10 rounded-[40px] flex items-center justify-between border border-accent/5 hover:border-accent/20 transition-all shadow-xl">
              <div>
                <h5 className="font-black text-3xl uppercase tracking-tighter">{t('pushNotifs')}</h5>
                <p className="text-base text-accent/50 font-medium">{t('notifSub')}</p>
              </div>
              <button 
                onClick={() => setLocalNotifs(!localNotifs)}
                className={`w-20 h-10 rounded-full p-1.5 transition-all duration-500 ${localNotifs ? 'bg-primary shadow-[0_0_30px_rgba(161,24,24,0.5)]' : 'bg-white/10'}`}
              >
                <div className={`w-7 h-7 bg-white rounded-full shadow-2xl transform transition-transform duration-500 ${localNotifs ? 'translate-x-10' : 'translate-x-0'}`} />
              </button>
           </div>
        </div>
      </section>

      <section className="pt-16 flex flex-col space-y-8 max-w-2xl mx-auto">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-8 bg-accent text-secondary font-black rounded-[45px] uppercase tracking-[0.4em] text-2xl shadow-2xl hover:bg-white active:scale-95 transition-all flex items-center justify-center border-4 border-transparent hover:border-accent ${isSaving ? 'opacity-50' : ''}`}
        >
          {isSaving ? <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" /> : t('saveChanges')}
        </button>
        <button onClick={() => window.location.reload()} className="w-full py-8 glass border-4 border-primary/20 text-primary font-black rounded-[45px] uppercase tracking-[0.4em] text-2xl hover:bg-primary/10 transition-all active:scale-95">
          {t('logout')}
        </button>
      </section>
    </div>
  );
};

export default Settings;
