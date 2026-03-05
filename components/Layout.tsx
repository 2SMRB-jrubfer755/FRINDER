
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  t: (key: string) => string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, t }) => {
  const tabs = [
    { id: 'discover', label: t('discover'), icon: '🔍' },
    { id: 'groups', label: t('squads'), icon: '🛡️' },
    { id: 'chat', label: t('chats'), icon: '💬' },
    { id: 'rewards', label: t('trophies'), icon: '🏆' },
    { id: 'settings', label: t('settings'), icon: '⚙️' },
  ];

  return (
    <div className="flex flex-col h-screen md:flex-row bg-secondary-dark dark:bg-secondary-dark bg-secondary-light overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 lg:w-80 glass border-r border-accent/20 p-6 lg:p-8 z-10 shadow-2xl">
        <div className="flex flex-col items-center justify-center mb-16 w-full text-center">
          <h1 className="text-5xl lg:text-6xl font-display font-bold text-accent-dark dark:text-accent-dark text-accent-light italic text-glow animate-pulse w-full">
            FRINDER
          </h1>
          <p className="text-[10px] font-black text-accent-50/40 uppercase tracking-[0.8em] mt-2">Connect & Play</p>
        </div>
        <nav className="flex-1 space-y-3 lg:space-y-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-4 lg:space-x-5 px-5 lg:px-6 py-3.5 lg:py-4 rounded-2xl lg:rounded-[26px] transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-2xl shadow-primary/40 scale-105 border-2 border-white/20' 
                  : 'text-accent-50/60 hover:text-accent hover:bg-accent/5'
              }`}
            >
              <span className="text-2xl lg:text-3xl">{tab.icon}</span>
              <span className="font-black text-base lg:text-lg uppercase tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-auto glass p-5 lg:p-6 rounded-3xl border-2 border-primary/30 bg-primary/10 group cursor-pointer hover:border-primary/60 transition-all text-center shadow-lg">
          <p className="text-[10px] text-accent-50 uppercase tracking-[0.3em] mb-3 font-black">FRINDER GOLD</p>
          <p className="text-base lg:text-lg font-black text-white mb-4 leading-tight group-hover:text-accent transition-colors uppercase tracking-tight">BOOST YOUR VIBE</p>
          <button onClick={() => setActiveTab('settings')} className="w-full py-3.5 lg:py-4 bg-accent text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-95">
            GO PREMIUM
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden pb-28 md:pb-0 scroll-smooth flex flex-col items-center">
          <header className="md:hidden glass w-full py-5 mb-3 flex flex-col items-center justify-center sticky top-0 z-[60] border-b border-accent/20 shadow-xl">
            <h1 className="text-4xl font-display font-bold text-accent italic text-glow tracking-tighter text-center">FRINDER</h1>
           <p className="text-[8px] font-black text-accent/40 uppercase tracking-[0.5em]">Mobile Arena</p>
        </header>
          <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-accent/20 h-20 flex items-center justify-around z-50 px-2 pb-2 shadow-2xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-1/5 h-full transition-all ${
              activeTab === tab.id ? 'text-primary scale-125' : 'text-accent/40'
            }`}
          >
            <span className="text-2xl mb-0.5">{tab.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
