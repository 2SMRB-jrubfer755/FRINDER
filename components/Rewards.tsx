
import React from 'react';
import { MOCK_TOURNAMENTS } from '../data/mockData';

const Rewards: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <header>
        <h2 className="text-4xl font-display font-bold text-accent mb-2">Rewards Center</h2>
        <p className="text-accent/60">Compete, collaborate, and win exclusive prizes</p>
      </header>

      {/* Points Card */}
      <div className="glass p-8 rounded-[32px] border border-primary/30 card-depth relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/30 transition-colors" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-accent/50 uppercase tracking-widest text-xs font-bold mb-1">Your Balance</p>
            <h3 className="text-6xl font-black text-accent">2,450 <span className="text-2xl font-normal opacity-50">Frins</span></h3>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 md:flex-none px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Redeem Store
            </button>
            <button className="flex-1 md:flex-none px-8 py-4 glass text-accent font-bold rounded-2xl border border-accent/20 hover:bg-accent/10 transition-all">
              History
            </button>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Upcoming Tournaments</h3>
          <button className="text-primary font-bold hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_TOURNAMENTS.map(t => (
            <div key={t.id} className="group glass rounded-3xl overflow-hidden border border-accent/10 hover:border-primary/50 transition-all card-depth">
              <div className="relative h-48 overflow-hidden">
                <img src={t.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
                  Partner: {t.partner}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="bg-primary px-4 py-1 rounded-lg text-white font-bold shadow-lg">
                    {t.prizePool}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-1">{t.title}</h4>
                <p className="text-accent/60 text-sm mb-4">📅 {t.date}</p>
                <button className="w-full py-3 glass border border-accent/20 text-accent font-bold rounded-xl hover:bg-primary hover:text-white hover:border-transparent transition-all uppercase tracking-widest text-xs">
                  Join Tournament
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Partnerships */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Partner Quests</h3>
        <div className="space-y-4">
          {[
            { brand: 'Logitech', quest: 'Win 5 games using a G-series mouse', reward: '500 Frins' },
            { brand: 'Discord', quest: 'Connect your Nitro account', reward: 'Exclusive Badge' },
            { brand: 'Twitch', quest: 'Watch 2 hours of FRINDER Stream', reward: '100 Frins' },
          ].map((q, i) => (
            <div key={i} className="glass p-4 rounded-2xl flex items-center justify-between border border-white/5 hover:border-accent/20 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center font-bold text-accent">
                  {q.brand[0]}
                </div>
                <div>
                  <h5 className="font-bold">{q.quest}</h5>
                  <p className="text-xs text-accent/50 uppercase tracking-widest">{q.brand}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary font-bold">{q.reward}</p>
                <button className="text-[10px] font-bold uppercase tracking-tighter text-accent/40 hover:text-accent">Details →</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rewards;
