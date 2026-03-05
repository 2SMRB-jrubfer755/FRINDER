
import React, { useState } from 'react';
import { Group, User } from '../types';

interface GroupsProps {
  groups: Group[];
  users: User[];
  currentUserId?: string | null;
  onAddGroup: (group: Group) => void;
  onRequestEntrance?: (groupId: string) => Promise<void>;
  t: (key: string) => string;
}

const Groups: React.FC<GroupsProps> = ({ groups, users, currentUserId, onAddGroup, t }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupGame, setNewGroupGame] = useState('Valorant');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [requested, setRequested] = useState<Record<string, boolean>>({});
  const [groupError, setGroupError] = useState<string>('');

  const handleCreate = () => {
    setGroupError('');
    if (!newGroupName.trim()) {
      setGroupError('El nombre del escuadrón no puede estar vacío.');
      return;
    }

    const newGroup: Group = {
      id: `g_${Date.now()}`,
      name: newGroupName,
      description: newGroupDesc || 'A new gaming squad ready for battle!',
      members: [currentUserId || 'me'],
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      game: newGroupGame,
      isPrivate: false
    };

    onAddGroup(newGroup);
    setShowCreate(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-16">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-accent mb-2 tracking-tight italic text-glow uppercase">
            {t('squads')}
          </h2>
          <p className="text-accent/60 text-xs sm:text-sm md:text-base font-bold tracking-[0.14em] md:tracking-[0.2em]">{t('squadsSub')}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-14 h-14 md:w-20 md:h-20 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl shadow-2xl shadow-primary/40 hover:scale-110 hover:rotate-90 transition-all active:scale-95 border-4 border-white/10"
        >
          +
        </button>
      </header>

      {/* Featured Group */}
      <div className="relative h-56 md:h-72 rounded-3xl md:rounded-[44px] overflow-hidden card-depth group shadow-2xl">
        <img src="https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/40 to-transparent" />
        <div className="absolute inset-0 p-5 md:p-9 flex flex-col justify-center max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] md:tracking-[0.34em] text-primary mb-2">Editor's Pick</span>
          <h3 className="text-2xl md:text-4xl font-black mb-3 text-white tracking-tight">ELITE SCRIMS HUB</h3>
          <p className="text-accent/80 mb-5 md:mb-7 italic text-sm md:text-base leading-relaxed">The place where pro dreams are born. Daily 10-mans and VOD reviews with the best coaches.</p>
          <button onClick={async () => {
            if (!currentUserId) {
              alert('Por favor, inicia sesión para unirte a grupos');
              return;
            }
            try {
              // Join the featured "ELITE SCRIMS HUB" group
              const eliteGroupId = groups.find(g => g.name.includes('ELITE'))?.id || groups[0]?.id;
              if (!eliteGroupId) {
                alert('No se encontró el grupo Elite');
                return;
              }
              await onRequestEntrance(eliteGroupId);
              alert('Solicitud enviada al grupo Elite');
            } catch (err) {
              console.error('Failed to join elite group', err);
              alert('No se pudo enviar la solicitud');
            }
          }} className="w-fit px-5 md:px-8 py-2.5 md:py-3 bg-white text-secondary font-black rounded-xl md:rounded-2xl uppercase tracking-[0.14em] md:tracking-[0.2em] hover:bg-accent hover:scale-105 transition-all shadow-xl text-[10px] md:text-xs">JOIN ELITE</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        {groups.map(group => (
          <div key={group.id} className="glass rounded-3xl md:rounded-[40px] p-5 md:p-7 border border-accent/10 hover:border-primary/50 transition-all group card-depth flex flex-col">
            <div className="flex items-start justify-between mb-5 md:mb-6">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <img src={group.image} className="w-full h-full rounded-2xl md:rounded-[24px] object-cover border-4 border-accent/10 group-hover:border-primary/30 transition-colors shadow-xl" />
                <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg animate-pulse">LIVE</div>
              </div>
              <div className="text-right">
                <span className="text-3xl md:text-4xl font-black text-accent block">{group.members.length}</span>
                <p className="text-[10px] font-black text-accent/50 uppercase tracking-widest">Gamer Squad</p>
              </div>
            </div>

            <h4 className="text-xl md:text-2xl font-black mb-2 group-hover:text-primary transition-colors tracking-tight uppercase">{group.name}</h4>
            <div className="inline-block w-fit bg-accent/10 text-accent text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest mb-4">
              {group.game}
            </div>
            <p className="text-accent/70 text-sm md:text-base mb-5 md:mb-7 line-clamp-2 italic leading-relaxed">"{group.description}"</p>

            <div className="flex items-center -space-x-4 mb-6 md:mb-8">
              {group.members.slice(0, 4).map(mid => {
                const u = users.find(x => x.id === mid);
                return <img key={mid} src={u?.avatar || `https://i.pravatar.cc/100?u=${mid}`} className="w-11 h-11 md:w-12 md:h-12 rounded-full border-4 border-secondary object-cover shadow-lg" />;
              })}
              {group.members.length > 4 && (
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-accent/10 border-4 border-secondary flex items-center justify-center text-xs md:text-sm font-black text-accent">
                  +{group.members.length - 4}
                </div>
              )}
            </div>

            <button onClick={async () => {
              if (onRequestEntrance) {
                try {
                  await onRequestEntrance((group as any)._id || group.id);
                  setRequested(prev => ({ ...prev, [group.id]: true }));
                } catch (err) {
                  console.error('Request entrance failed', err);
                  alert('No se pudo solicitar entrada.');
                }
              } else {
                setRequested(prev => ({ ...prev, [group.id]: true }));
                alert(`Entrance requested for ${group.name} (simulated)`);
              }
            }} className="mt-auto w-full py-3.5 md:py-4 glass border-2 border-accent/20 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.14em] md:tracking-[0.2em] hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-xl active:scale-95">
              {requested[group.id] ? 'Requested' : 'Request Entrance'}
            </button>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 glass backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-secondary p-5 md:p-8 rounded-3xl md:rounded-[44px] w-full max-w-2xl border-4 border-primary/20 card-depth shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <h3 className="text-2xl md:text-4xl font-display font-bold text-accent mb-6 md:mb-8 tracking-tight italic text-glow uppercase">FOUND A SQUAD</h3>
            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest mb-3 block">Squad Name</label>
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Dream Team X"
                  className="w-full glass bg-transparent border-b-2 border-accent/20 py-3 text-base md:text-lg focus:border-primary outline-none transition-all placeholder:text-accent/20"
                />
                {groupError && <p className="text-red-500 text-sm mt-1">{groupError}</p>}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest mb-3 block">Squad Bio</label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Tell us about the vibes..."
                  className="w-full glass bg-transparent border-b-2 border-accent/20 py-3 text-base md:text-lg focus:border-primary outline-none transition-all h-24 resize-none placeholder:text-accent/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest mb-3 block">Game Focus</label>
                <select
                  value={newGroupGame}
                  onChange={(e) => setNewGroupGame(e.target.value)}
                  className="w-full glass bg-transparent border-b-2 border-accent/20 py-3 text-base md:text-lg focus:border-primary outline-none cursor-pointer"
                >
                  <option className="bg-secondary">Valorant</option>
                  <option className="bg-secondary">Counter-Strike 2</option>
                  <option className="bg-secondary">Elden Ring</option>
                  <option className="bg-secondary">Rocket League</option>
                  <option className="bg-secondary">League of Legends</option>
                </select>
              </div>
              <div className="flex gap-3 md:gap-4 pt-4 md:pt-6">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-3.5 glass text-accent font-black rounded-2xl border-2 border-accent/20 uppercase tracking-[0.14em] text-[10px] md:text-xs hover:bg-accent/10 transition-all">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-3.5 bg-primary text-white font-black rounded-2xl uppercase tracking-[0.14em] text-[10px] md:text-xs shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">Create Squad</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
