
import React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface RewardsProps {
  currentUserId?: string | null;
  onNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Rewards: React.FC<RewardsProps> = ({ currentUserId, onNotification }) => {
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [showRedeemStore, setShowRedeemStore] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.tournaments.getAll();
        setTournaments(data);
        if (currentUserId) {
          // mark any already-joined tournaments
          const map: Record<string, boolean> = {};
          data.forEach(t => {
            const participants: string[] = (t as any).participants || [];
            if (participants.includes(currentUserId)) {
              map[t.id || (t as any)._id] = true;
            }
          });
          setJoined(map);
        }
      } catch (err) {
        console.error('Failed to load tournaments', err);
      }
    };
    load();
  }, [currentUserId]);

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
            <button onClick={() => setShowRedeemStore(true)} className="flex-1 md:flex-none px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Redeem Store
            </button>
            <button onClick={() => setShowHistory(true)} className="flex-1 md:flex-none px-8 py-4 glass text-accent font-bold rounded-2xl border border-accent/20 hover:bg-accent/10 transition-all">
              History
            </button>
          </div>
        </div>
      </div>

      {/* Redeem Store Modal */}
      {showRedeemStore && (
        <div className="fixed inset-0 z-[100] bg-secondary/80 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="bg-secondary rounded-[40px] p-8 max-w-md w-full border-4 border-accent/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-accent">REDEEM STORE</h3>
              <button onClick={() => setShowRedeemStore(false)} className="text-2xl font-bold opacity-50 hover:opacity-100">✕</button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {[
                { name: 'Battle Pass Season 2', cost: 1000 },
                { name: 'Premium Avatar Pack', cost: 500 },
                { name: 'Gaming Chair Voucher', cost: 2000 },
              ].map((item, i) => (
                <div key={i} className="glass p-4 rounded-2xl flex justify-between items-center border border-accent/10">
                  <span className="font-black text-white">{item.name}</span>
                  <button onClick={() => onNotification?.(`Canjeado: ${item.name}`, 'success')} className="px-4 py-2 bg-primary text-white font-black rounded-lg hover:scale-105 transition-all">{item.cost}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] bg-secondary/80 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="bg-secondary rounded-[40px] p-8 max-w-md w-full border-4 border-accent/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-accent">HISTORY</h3>
              <button onClick={() => setShowHistory(false)} className="text-2xl font-bold opacity-50 hover:opacity-100">✕</button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {[
                { action: 'Won Tournament', frins: '+500', date: '2 days ago' },
                { action: 'Daily Quest', frins: '+100', date: '5 days ago' },
                { action: 'Redeemed Item', frins: '-1000', date: '1 week ago' },
              ].map((item, i) => (
                <div key={i} className="glass p-4 rounded-2xl flex justify-between items-center border border-accent/10">
                  <div>
                    <p className="font-black text-white">{item.action}</p>
                    <p className="text-xs text-accent/50">{item.date}</p>
                  </div>
                  <span className={`font-black text-sm ${item.frins.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{item.frins}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Upcoming Tournaments</h3>
          <button onClick={() => onNotification?.('Mostrando todos los torneos', 'info')} className="text-primary font-bold hover:underline">View All</button>
        </div>
          {tournaments.map(t => (
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
                <button onClick={async () => {
                  if (!currentUserId) return alert('Please login to join tournaments');
                  try {
                    await api.tournaments.join(t._id || t.id);
                    const key = t.id || (t as any)._id;
                    setJoined(prev => ({ ...prev, [key]: true }));
                  } catch (err) {
                    console.error('Failed to join tournament', err);
                    alert('No se pudo unir al torneo');
                  }
                }} disabled={!!joined[t.id]} className="w-full py-3 glass border border-accent/20 text-accent font-bold rounded-xl hover:bg-primary hover:text-white hover:border-transparent transition-all uppercase tracking-widest text-xs">
                  {joined[t.id] ? 'Joined' : 'Join Tournament'}
                </button>
              </div>
            </div>
          ))}
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
                <button onClick={() => onNotification?.(`Detalles de ${q.quest}: ${q.reward} puntos`, 'info')} className="text-[10px] font-bold uppercase tracking-tighter text-accent/40 hover:text-accent">Details →</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rewards;
