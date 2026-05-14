
import React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface RewardsProps {
  currentUserId?: string | null;
  userProfile?: any;
  onNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const Rewards: React.FC<RewardsProps> = ({ currentUserId, userProfile, onNotification }) => {
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [showRedeemStore, setShowRedeemStore] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, frins: 100, wins: 0, losses: 0, matchesPlayed: 0 });
  
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.tournaments.getAll();
        setTournaments(data);
        if (currentUserId) {
          const map: Record<string, boolean> = {};
          data.forEach(t => {
            const tid = t.id || (t as any)._id;
            if (!tid) return;
            const participants: string[] = (t as any).participants || [];
            if (participants.includes(currentUserId)) {
              map[tid] = true;
            }
          });
          setJoined(map);
        }

        // Load leaderboard
        const leaderboardData = await api.users.getLeaderboard(10);
        setLeaderboard(leaderboardData);

        // Set user stats
        if (userProfile) {
          setUserStats({
            level: userProfile.level || 1,
            xp: userProfile.xp || 0,
            frins: userProfile.frins || 100,
            wins: userProfile.wins || 0,
            losses: userProfile.losses || 0,
            matchesPlayed: userProfile.matchesPlayed || 0
          });
        }
      } catch (err) {
        console.error('Failed to load rewards data', err);
      }
    };
    load();
  }, [currentUserId, userProfile]);

  const redeemStore = [
    { id: 'bp1', name: 'Battle Pass Season 2', cost: 1000, type: 'premium' },
    { id: 'avatar1', name: 'Premium Avatar Pack', cost: 500, type: 'cosmetic' },
    { id: 'voucher1', name: 'Gaming Chair Voucher', cost: 2000, type: 'reward' },
    { id: 'boost1', name: 'XP Boost +50%', cost: 300, type: 'boost' },
    { id: 'emote1', name: 'Exclusive Emote Pack', cost: 250, type: 'cosmetic' },
  ];

  const handleRedeem = async (item: any) => {
    if (!currentUserId) {
      onNotification?.('Por favor, inicia sesión', 'error');
      return;
    }
    if (userStats.frins < item.cost) {
      onNotification?.(`No tienes suficientes Frins. Necesitas ${item.cost}, tienes ${userStats.frins}`, 'error');
      return;
    }
    try {
      await api.users.addFrins(currentUserId, -item.cost, `redeemed_${item.id}`);
      setUserStats(prev => ({ ...prev, frins: prev.frins - item.cost }));
      onNotification?.(`¡Canjeado! ${item.name} - ${item.cost} Frins gastados`, 'success');
    } catch (err) {
      onNotification?.('No se pudo canjear el item', 'error');
    }
  };

  const winRate = userStats.matchesPlayed > 0 
    ? ((userStats.wins / userStats.matchesPlayed) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h2 className="text-4xl font-display font-bold text-accent mb-2">🏆 Rewards Center</h2>
        <p className="text-accent/60">Compite, colabora y gana premios exclusivos</p>
      </header>

      {/* Player Stats Card */}
      <div className="glass p-8 rounded-[32px] border border-primary/30 card-depth relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/30 transition-colors" />
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-accent/50 uppercase tracking-widest text-xs font-bold mb-2">Tu Nivel</p>
              <h3 className="text-6xl font-black text-accent">Lv. {userStats.level}</h3>
              <p className="text-xs text-accent/50 mt-1">{userStats.xp % 100}/100 XP para siguiente nivel</p>
            </div>
            <div className="w-full md:w-40 h-2 bg-black/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${(userStats.xp % 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-accent">{userStats.frins}</p>
              <p className="text-[10px] text-accent/50 uppercase tracking-widest font-bold">Frins</p>
            </div>
            <div className="bg-black/30 p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-green-400">{userStats.wins}W</p>
              <p className="text-[10px] text-accent/50 uppercase tracking-widest font-bold">Victorias</p>
            </div>
            <div className="bg-black/30 p-4 rounded-2xl text-center">
              <p className="text-2xl font-black text-accent">{winRate}%</p>
              <p className="text-[10px] text-accent/50 uppercase tracking-widest font-bold">Win Rate</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setShowRedeemStore(true)} className="flex-1 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Redeem Store
            </button>
            <button onClick={() => setShowHistory(true)} className="flex-1 px-8 py-4 glass text-accent font-bold rounded-2xl border border-accent/20 hover:bg-accent/10 transition-all">
              Historial
            </button>
          </div>
        </div>
      </div>

      {/* Redeem Store Modal */}
      {showRedeemStore && (
        <div className="fixed inset-0 z-[100] bg-secondary/80 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="bg-secondary rounded-[40px] p-8 max-w-2xl w-full border-4 border-accent/30 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-secondary pb-4">
              <h3 className="text-2xl font-black text-accent">REDEEM STORE</h3>
              <button onClick={() => setShowRedeemStore(false)} className="text-2xl font-bold opacity-50 hover:opacity-100">✕</button>
            </div>
            <div className="space-y-4">
              {redeemStore.map((item) => (
                <div key={item.id} className="glass p-5 rounded-2xl flex justify-between items-center border border-accent/10 hover:border-accent/30 transition-all">
                  <div className="flex-1">
                    <h5 className="font-black text-white">{item.name}</h5>
                    <p className="text-xs text-accent/50 uppercase tracking-widest">{item.type}</p>
                  </div>
                  <button 
                    onClick={() => handleRedeem(item)}
                    disabled={userStats.frins < item.cost}
                    className={`px-6 py-2 font-black rounded-lg transition-all ${
                      userStats.frins < item.cost
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {item.cost}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <section>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>🏅</span> Top Jugadores
        </h3>
        <div className="space-y-3">
          {leaderboard.map((player, idx) => (
            <div key={player._id} className="glass p-4 rounded-2xl flex items-center justify-between border border-accent/10 hover:border-primary/50 transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl font-black text-primary w-8 text-center">#{idx + 1}</div>
                <img src={player.avatar} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-white">{player.name}</p>
                  <p className="text-xs text-accent/50">Lv. {player.level} • {player.wins}W-{player.losses}L</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-accent">{player.xp} XP</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">⚔️ Próximos Torneos</h3>
        </div>
        {tournaments.length > 0 ? (
          <div className="space-y-4">
            {tournaments.map(t => (
              <div key={t.id} className="group glass rounded-3xl overflow-hidden border border-accent/10 hover:border-primary/50 transition-all card-depth">
                <div className="relative h-48 overflow-hidden">
                  <img src={t.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
                    {t.partner}
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
                    if (!currentUserId) return onNotification?.('Por favor, inicia sesión', 'error');
                    try {
                      await api.tournaments.join(t._id || t.id);
                      const key = t.id || (t as any)._id;
                      setJoined(prev => ({ ...prev, [key]: true }));
                      onNotification?.('¡Unido al torneo! 🎉', 'success');
                    } catch (err) {
                      onNotification?.('No se pudo unir al torneo', 'error');
                    }
                  }} disabled={!!joined[t.id]} className="w-full py-3 glass border border-accent/20 text-accent font-bold rounded-xl hover:bg-primary hover:text-white hover:border-transparent transition-all uppercase tracking-widest text-xs disabled:opacity-50">
                    {joined[t.id] ? '✓ Unido' : 'Unirse'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl text-center text-accent/50">
            <p>No hay torneos disponibles en este momento</p>
          </div>
        )}
      </section>

      {/* Daily Quests */}
      <section>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>⭐</span> Misiones Diarias
        </h3>
        <div className="space-y-4">
          {[
            { quest: 'Juega 3 partidas', reward: '100 XP + 50 Frins', progress: '2/3' },
            { quest: 'Gana 1 partida', reward: '150 Frins', progress: '0/1' },
            { quest: 'Añade 2 favoritos', reward: '100 Frins', progress: '1/2' },
          ].map((q, i) => (
            <div key={i} className="glass p-5 rounded-2xl flex items-center justify-between border border-accent/10 hover:border-accent/20 transition-all">
              <div className="flex-1">
                <h5 className="font-bold text-white">{q.quest}</h5>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-black/30 rounded-full overflow-hidden max-w-xs">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${(parseInt(q.progress.split('/')[0]) / parseInt(q.progress.split('/')[1])) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-accent/50 font-bold">{q.progress}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-accent uppercase tracking-widest">{q.reward}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Rewards;
