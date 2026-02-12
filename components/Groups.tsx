
import React, { useState } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { Group } from '../types';

interface GroupsProps {
  groups: Group[];
  users: User[]; // [NEW] Accept users list
  onAddGroup: (group: Group) => void;
  t: (key: string) => string;
}

const Groups: React.FC<GroupsProps> = ({ groups, users, onAddGroup, t }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupGame, setNewGroupGame] = useState('Valorant');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const handleCreate = () => {
    if (!newGroupName.trim()) return;

    const newGroup: Group = {
      id: `g_${Date.now()}`,
      name: newGroupName,
      description: newGroupDesc || 'A new gaming squad ready for battle!',
      members: ['me'], // Current user
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
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-6xl font-display font-bold text-accent mb-3 tracking-tighter italic text-glow uppercase">
            {t('squads')}
          </h2>
          <p className="text-accent/60 text-xl font-bold tracking-widest">{t('squadsSub')}</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-24 h-24 bg-primary rounded-[35px] flex items-center justify-center text-5xl shadow-2xl shadow-primary/40 hover:scale-110 hover:rotate-90 transition-all active:scale-95 border-4 border-white/10"
        >
          +
        </button>
      </header>

      {/* Featured Group */}
      <div className="relative h-80 rounded-[50px] overflow-hidden card-depth group shadow-2xl">
        <img src="https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/40 to-transparent" />
        <div className="absolute inset-0 p-12 flex flex-col justify-center max-w-xl">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-3">Editor's Pick</span>
          <h3 className="text-5xl font-black mb-4 text-white tracking-tighter">ELITE SCRIMS HUB</h3>
          <p className="text-accent/80 mb-8 italic text-lg leading-relaxed">The place where pro dreams are born. Daily 10-mans and VOD reviews with the best coaches.</p>
          <button className="w-fit px-10 py-4 bg-white text-secondary font-black rounded-2xl uppercase tracking-widest hover:bg-accent hover:scale-105 transition-all shadow-xl text-sm">JOIN ELITE</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {groups.map(group => (
          <div key={group.id} className="glass rounded-[50px] p-10 border border-accent/10 hover:border-primary/50 transition-all group card-depth flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div className="relative w-24 h-24">
                <img src={group.image} className="w-full h-full rounded-[30px] object-cover border-4 border-accent/10 group-hover:border-primary/30 transition-colors shadow-xl" />
                <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg animate-pulse">LIVE</div>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black text-accent block">{group.members.length}</span>
                <p className="text-[10px] font-black text-accent/50 uppercase tracking-widest">Gamer Squad</p>
              </div>
            </div>

            <h4 className="text-3xl font-black mb-3 group-hover:text-primary transition-colors tracking-tighter uppercase">{group.name}</h4>
            <div className="inline-block w-fit bg-accent/10 text-accent text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest mb-4">
              {group.game}
            </div>
            <p className="text-accent/70 text-lg mb-8 line-clamp-2 italic leading-relaxed">"{group.description}"</p>

            <div className="flex items-center -space-x-5 mb-10">
              {group.members.slice(0, 4).map(mid => {
                const u = users.find(x => x.id === mid);
                return <img key={mid} src={u?.avatar || `https://i.pravatar.cc/100?u=${mid}`} className="w-14 h-14 rounded-full border-4 border-secondary object-cover shadow-lg" />;
              })}
              {group.members.length > 4 && (
                <div className="w-14 h-14 rounded-full bg-accent/10 border-4 border-secondary flex items-center justify-center text-sm font-black text-accent">
                  +{group.members.length - 4}
                </div>
              )}
            </div>

            <button className="mt-auto w-full py-5 glass border-2 border-accent/20 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:border-transparent transition-all shadow-xl active:scale-95">
              Request Entrance
            </button>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 glass backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-secondary p-12 rounded-[60px] w-full max-w-2xl border-4 border-primary/20 card-depth shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <h3 className="text-5xl font-display font-bold text-accent mb-10 tracking-tighter italic text-glow uppercase">FOUND A SQUAD</h3>
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest mb-3 block">Squad Name</label>
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Dream Team X"
                  className="w-full glass bg-transparent border-b-2 border-accent/20 py-4 text-2xl focus:border-primary outline-none transition-all placeholder:text-accent/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest mb-3 block">Squad Bio</label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Tell us about the vibes..."
                  className="w-full glass bg-transparent border-b-2 border-accent/20 py-4 text-xl focus:border-primary outline-none transition-all h-24 resize-none placeholder:text-accent/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-accent/50 tracking-widest mb-3 block">Game Focus</label>
                <select
                  value={newGroupGame}
                  onChange={(e) => setNewGroupGame(e.target.value)}
                  className="w-full glass bg-transparent border-b-2 border-accent/20 py-4 text-2xl focus:border-primary outline-none cursor-pointer"
                >
                  <option className="bg-secondary">Valorant</option>
                  <option className="bg-secondary">Counter-Strike 2</option>
                  <option className="bg-secondary">Elden Ring</option>
                  <option className="bg-secondary">Rocket League</option>
                  <option className="bg-secondary">League of Legends</option>
                </select>
              </div>
              <div className="flex gap-6 pt-10">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-5 glass text-accent font-black rounded-3xl border-2 border-accent/20 uppercase tracking-widest text-sm hover:bg-accent/10 transition-all">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-5 bg-primary text-white font-black rounded-3xl uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">Create Squad</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
