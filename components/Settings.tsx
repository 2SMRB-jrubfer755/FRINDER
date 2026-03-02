
import React, { useState } from 'react';

interface SettingsProps {
  userProfile: any;
  onUpdateProfile: (updates: any) => Promise<void>;
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile({
        name: localName,
        discord: localDiscord,
        language: localLang,
        notifications: localNotifs
      });
      alert(t('settingsSaved') || 'Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('No se pudieron guardar los ajustes. Inténtalo de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  const avatars = [
    'https://i.pravatar.cc/400?u=1',
    'https://i.pravatar.cc/400?u=2',
    'https://i.pravatar.cc/400?u=3',
    'https://i.pravatar.cc/400?u=4',
    'https://i.pravatar.cc/400?u=5',
  ];

  return (
    <div className="space-y-8 md:space-y-10 pb-16 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <header className="flex items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="w-14 h-14 glass rounded-full flex items-center justify-center text-2xl md:hidden">←</button>
          )}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-accent mb-2 tracking-tight italic text-glow uppercase">{t('config')}</h2>
            <p className="text-accent/60 text-xs sm:text-sm md:text-base uppercase font-bold tracking-[0.14em] md:tracking-[0.2em]">{t('configSub')}</p>
          </div>
        </div>
        {!userProfile.isPremium && (
          <button onClick={onShowPremium} className="hidden md:block px-6 py-2.5 bg-accent text-secondary font-black rounded-full animate-bounce shadow-xl uppercase tracking-tight text-xs">GO GOLD</button>
        )}
      </header>

      {/* Account Section */}
      <section className="space-y-5 md:space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.24em] md:tracking-[0.32em] text-primary">{t('profileDetails')}</h3>
        <div className="glass p-5 sm:p-7 md:p-8 rounded-3xl md:rounded-[40px] border border-accent/10 space-y-6 md:space-y-8 shadow-2xl">
           <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative group">
                <img src={userProfile.avatar} className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-4 border-primary shadow-2xl transition-transform group-hover:scale-105" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-accent text-secondary rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-2xl">⚡</div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{userProfile.name}</h4>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                   <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">LV. 42</span>
                   <span className="bg-accent/20 text-accent px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">Elite Gamer</span>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-2">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest block">{t('displayName')}</label>
                <input 
                  value={localName} 
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full glass bg-white/5 border-b-2 border-accent/10 py-3 px-2 text-lg md:text-xl font-bold focus:border-primary outline-none transition-all rounded-t-xl" 
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest block">{t('discordTag')}</label>
                <input 
                  value={localDiscord}
                  onChange={(e) => setLocalDiscord(e.target.value)}
                  className="w-full glass bg-white/5 border-b-2 border-accent/10 py-3 px-2 text-lg md:text-xl font-bold focus:border-primary outline-none transition-all rounded-t-xl" 
                />
              </div>
           </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-5 md:space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.24em] md:tracking-[0.32em] text-primary">{t('appPrefs')}</h3>
        <div className="space-y-4 md:space-y-5">
           <div className="glass p-5 md:p-7 rounded-2xl md:rounded-3xl flex items-center justify-between border border-accent/5 hover:border-accent/20 transition-all shadow-xl gap-4">
              <div>
                <h5 className="font-black text-lg md:text-2xl uppercase tracking-tight">{t('appLanguage')}</h5>
                <p className="text-xs md:text-sm text-accent/50 font-medium">{t('langSub')}</p>
              </div>
              <select 
                value={localLang} 
                onChange={(e) => setLocalLang(e.target.value)}
                className="bg-secondary text-accent font-black px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border-2 border-accent/20 outline-none cursor-pointer hover:border-primary transition-all text-sm md:text-base shadow-lg"
              >
                <option value="English">ENGLISH</option>
                <option value="Spanish">ESPAÑOL</option>
                <option value="French">FRANÇAIS</option>
                <option value="Japanese">日本語</option>
              </select>
           </div>

           <div className="glass p-5 md:p-7 rounded-2xl md:rounded-3xl flex items-center justify-between border border-accent/5 hover:border-accent/20 transition-all shadow-xl gap-4">
              <div>
                <h5 className="font-black text-lg md:text-2xl uppercase tracking-tight">{t('pushNotifs')}</h5>
                <p className="text-xs md:text-sm text-accent/50 font-medium">{t('notifSub')}</p>
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

      <section className="pt-6 md:pt-10 flex flex-col space-y-4 md:space-y-6 max-w-2xl mx-auto">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 md:py-5 bg-accent text-secondary font-black rounded-2xl md:rounded-[32px] uppercase tracking-[0.18em] md:tracking-[0.3em] text-sm md:text-lg shadow-2xl hover:bg-white active:scale-95 transition-all flex items-center justify-center border-4 border-transparent hover:border-accent ${isSaving ? 'opacity-50' : ''}`}
        >
          {isSaving ? <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" /> : t('saveChanges')}
        </button>
        <button onClick={() => window.location.reload()} className="w-full py-4 md:py-5 glass border-4 border-primary/20 text-primary font-black rounded-2xl md:rounded-[32px] uppercase tracking-[0.18em] md:tracking-[0.3em] text-sm md:text-lg hover:bg-primary/10 transition-all active:scale-95">
          {t('logout')}
        </button>
      </section>
    </div>
  );
};

export default Settings;
