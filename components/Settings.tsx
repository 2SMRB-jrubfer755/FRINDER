
import React, { useState } from 'react';

interface SettingsProps {
  userProfile: any;
  onUpdateProfile: (updates: any) => Promise<void>;
  t: (key: string) => string;
  onShowPremium: () => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onLogout?: () => Promise<void>;
  onBack?: () => void;
  onNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile, t, onShowPremium, theme, onThemeChange, onLogout, onBack, onNotification }) => {
  const [localName, setLocalName] = useState(userProfile.name);
  const [localDiscord, setLocalDiscord] = useState(userProfile.discord);
  const [localLang, setLocalLang] = useState(userProfile.language);
  const [localNotifs, setLocalNotifs] = useState(userProfile.notifications);
  const [localAvatar, setLocalAvatar] = useState(userProfile.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');

  const gamingAvatars = [
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer1',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer2',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer3',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer4',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer5',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer6',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer7',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=gamer8',
  ];

  const handleSave = async () => {
    // basic front-end validation
    setSaveError('');
    if (!localName.trim()) {
      setSaveError('El nombre no puede estar vacío.');
      return;
    }
    if (localDiscord && !localDiscord.includes('#')) {
      setSaveError('El discord debe incluir el símbolo "#".');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateProfile({
        name: localName,
        discord: localDiscord,
        language: localLang,
        notifications: localNotifs,
        avatar: localAvatar,
        theme: theme
      });
      onNotification?.(t('settingsSaved') || 'Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save settings', error);
      onNotification?.('No se pudieron guardar los ajustes. Inténtalo de nuevo.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 200KB para que el base64 no sea demasiado grande)
      if (file.size > 200 * 1024) {
        onNotification?.('La imagen es muy grande. Máximo 200KB. Usa una imagen más pequeña o comprimida.', 'error');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        onNotification?.('El archivo debe ser una imagen válida (JPG, PNG, GIF, WebP).', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string;
          // Validate that base64 isn't too large when encoded
          if (result.length > 1 * 1024 * 1024) {
            onNotification?.('La imagen convertida es demasiado grande. Usa una imagen más pequeña.', 'error');
            return;
          }
          setLocalAvatar(result);
        } catch (err) {
          onNotification?.('Error al procesar la imagen', 'error');
        }
      };
      reader.onerror = () => {
        alert('Error al leer el archivo');
      };
      reader.readAsDataURL(file);
    }
  };

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
                <img src={localAvatar} className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-4 border-primary shadow-2xl transition-transform group-hover:scale-105" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-accent text-secondary rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-2xl">⚡</div>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl md:text-3xl font-black text-accent-dark dark:text-accent-dark text-accent-light uppercase tracking-tight">{userProfile.name}</h4>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                   <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">LV. 42</span>
                   <span className="bg-accent/20 text-accent px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">Elite Gamer</span>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-2">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-accent-50 tracking-widest block">{t('displayName')}</label>
                <input 
                  value={localName} 
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full glass bg-white/5 border-b-2 border-accent/10 py-3 px-2 text-lg md:text-xl font-bold focus:border-primary outline-none transition-all rounded-t-xl" 
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase text-accent-50 tracking-widest block">{t('discordTag')}</label>
                <input 
                  value={localDiscord}
                  onChange={(e) => setLocalDiscord(e.target.value)}
                  className="w-full glass bg-white/5 border-b-2 border-accent/10 py-3 px-2 text-lg md:text-xl font-bold focus:border-primary outline-none transition-all rounded-t-xl" 
                />
              </div>
           </div>
        </div>
      </section>

      {/* Avatar Section */}
      <section className="space-y-5 md:space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.24em] md:tracking-[0.32em] text-primary">{t('avatar')}</h3>
        
        {/* Gaming Avatars */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase text-accent/50 tracking-widest">{t('gamingAvatars')}</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {gamingAvatars.map((av, idx) => (
              <button
                key={idx}
                onClick={() => setLocalAvatar(av)}
                className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 ${
                  localAvatar === av ? 'border-accent shadow-[0_0_20px_rgba(242,215,140,0.5)]' : 'border-accent/20 hover:border-accent/50'
                }`}
              >
                <img src={av} alt="avatar" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Photo Upload */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase text-accent/50 tracking-widest">{t('addYourOwnAvatar')}</p>
          <label className="w-full glass p-6 rounded-2xl border-2 border-dashed border-accent/30 hover:border-accent/60 transition-all cursor-pointer flex flex-col items-center justify-center space-y-3">
            <span className="text-3xl">📸</span>
            <span className="text-sm font-black text-accent uppercase tracking-wider">{t('uploadPhoto')}</span>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-5 md:space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.24em] md:tracking-[0.32em] text-primary">{t('appPrefs')}</h3>
        <div className="space-y-4 md:space-y-5">
           {/* Theme Toggle */}
           <div className="glass p-5 md:p-7 rounded-2xl md:rounded-3xl flex items-center justify-between border border-accent/5 hover:border-accent/20 transition-all shadow-xl gap-4">
              <div>
                <h5 className="font-black text-lg md:text-2xl uppercase tracking-tight">{t('theme')}</h5>
                <p className="text-xs md:text-sm text-accent-50 font-medium">{theme === 'dark' ? t('darkMode') : t('lightMode')}</p>
              </div>
              <button 
                onClick={async () => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark';
                  try {
                    await onUpdateProfile({
                      name: localName,
                      discord: localDiscord,
                      language: localLang,
                      notifications: localNotifs,
                      avatar: localAvatar,
                      theme: newTheme
                    });
                    // Only change theme after successful save
                    onThemeChange?.(newTheme);
                  } catch (error) {
                    console.error('Failed to save theme', error);
                    alert('No se pudo guardar el cambio de tema');
                  }
                }}
                className={`w-20 h-10 rounded-full p-1.5 transition-all duration-500 ${theme === 'dark' ? 'bg-primary shadow-[0_0_30px_rgba(161,24,24,0.5)]' : 'bg-gray-300'}`}
              >
                <div className={`w-7 h-7 rounded-full shadow-2xl transform transition-transform duration-500 flex items-center justify-center ${theme === 'dark' ? 'translate-x-10 bg-primary' : 'translate-x-0 bg-white'}`}>
                  <span className="text-xs">{theme === 'dark' ? '🌙' : '☀️'}</span>
                </div>
              </button>
           </div>

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
        {saveError && <p className="text-red-500 text-center text-sm">{saveError}</p>}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 md:py-5 bg-accent text-secondary font-black rounded-2xl md:rounded-[32px] uppercase tracking-[0.18em] md:tracking-[0.3em] text-sm md:text-lg shadow-2xl hover:bg-white active:scale-95 transition-all flex items-center justify-center border-4 border-transparent hover:border-accent ${isSaving ? 'opacity-50' : ''}`}
        >
          {isSaving ? <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" /> : t('saveChanges')}
        </button>
        <button 
          onClick={onLogout}
          className="w-full py-4 md:py-5 glass border-4 border-primary/20 text-primary font-black rounded-2xl md:rounded-[32px] uppercase tracking-[0.18em] md:tracking-[0.3em] text-sm md:text-lg hover:bg-primary/10 transition-all active:scale-95">
          {t('logout')}
        </button>
      </section>
    </div>
  );
};

export default Settings;
