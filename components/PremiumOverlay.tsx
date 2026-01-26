
import React from 'react';

interface PremiumOverlayProps {
  onClose: () => void;
  t: (key: string) => string;
}

const PremiumOverlay: React.FC<PremiumOverlayProps> = ({ onClose, t }) => {
  const perks = [
    { title: 'Unlimited Matches', sub: 'Swipe as much as you want, no limits. Find your squad faster.', icon: '⚡' },
    { title: 'Global Passport', icon: '🌍', sub: 'Play with people from any country. No borders, just games.' },
    { title: 'Rewind Last Swipe', icon: '⏪', sub: 'Accidentally swiped left? Bring them back instantly.' },
    { title: 'See Who Liked You', icon: '👀', sub: 'Instant access to your hidden fans. Know who wants to play.' },
    { title: 'Custom Themes', icon: '🎨', sub: 'Exclusive RGB, Neon and Retro interface themes for your profile.' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-secondary/80 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="bg-secondary w-full max-w-2xl rounded-[60px] border-4 border-accent shadow-[0_0_100px_rgba(242,215,140,0.3)] p-10 relative overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        
        <button onClick={onClose} className="absolute top-8 right-8 text-3xl font-bold opacity-30 hover:opacity-100 transition-opacity">✕</button>
        
        <header className="text-center mb-10 relative z-10">
          <span className="inline-block bg-accent text-secondary px-6 py-1 rounded-full text-xs font-black uppercase tracking-[0.5em] mb-4 shadow-xl">ELITE STATUS</span>
          <h2 className="text-6xl font-display font-bold text-accent italic mb-2 tracking-tighter">{t('premiumTitle')}</h2>
          <p className="text-accent/60 font-bold uppercase tracking-widest text-sm">{t('premiumSub')}</p>
        </header>

        <div className="space-y-6 mb-10 relative z-10 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
          {perks.map((perk, i) => (
            <div key={i} className="glass p-6 rounded-[30px] flex items-center space-x-6 border border-white/5 hover:border-accent/20 transition-all group">
              <span className="text-4xl group-hover:scale-125 transition-transform">{perk.icon}</span>
              <div>
                <h4 className="text-xl font-bold text-white uppercase tracking-tighter">{perk.title}</h4>
                <p className="text-sm text-accent/50">{perk.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 space-y-4">
            <button className="w-full py-6 bg-accent text-secondary font-black text-2xl rounded-[35px] shadow-2xl hover:bg-white active:scale-95 transition-all">
              GO GOLD FOR $9.99 / MO
            </button>
            <p className="text-center text-[10px] text-accent/30 font-bold uppercase tracking-widest">
                Unlock exclusive badges and priority matching.
            </p>
        </div>
        <p className="text-center mt-6 text-[10px] text-accent/30 font-bold uppercase tracking-widest relative z-10">Restore Purchases • Privacy Policy • Terms</p>
      </div>
    </div>
  );
};

export default PremiumOverlay;
