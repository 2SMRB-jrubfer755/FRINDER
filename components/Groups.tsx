
import React, { useState, useEffect } from 'react';
import { Group, User } from '../types';
import { api } from '../services/api';

interface GroupsProps {
  groups: Group[];
  users: User[];
  currentUserId?: string | null;
  onAddGroup: (group: Group) => void;
  onRequestEntrance?: (groupId: string) => Promise<void>;
  onNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
  t: (key: string) => string;
}

interface SquadMember {
  userId: string;
  username: string;
  avatar: string;
  role: 'admin' | 'officer' | 'member';
  joinedAt: Date;
  stats?: { matchesPlayed: number; wins: number };
}

interface SquadActivity {
  id: string;
  userId: string;
  username: string;
  action: 'joined' | 'left' | 'match_won' | 'match_lost' | 'promoted' | 'kicked' | 'tournament_entered';
  timestamp: Date;
  details?: Record<string, any>;
}

const Groups: React.FC<GroupsProps> = ({ groups, users, currentUserId, onAddGroup, onRequestEntrance, t, onNotification }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'activity' | 'tournaments' | 'requests'>('members');
  const [showCreate, setShowCreate] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDisbandModal, setShowDisbandModal] = useState(false);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupGame, setNewGroupGame] = useState('Valorant');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [groupError, setGroupError] = useState<string>('');
  
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>([]);
  const [squadActivity, setSquadActivity] = useState<SquadActivity[]>([]);
  const [joinRequests, setJoinRequests] = useState<string[]>([]);
  const [inviteUsername, setInviteUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedGroup = selectedGroupId ? groups.find(g => (g._id || g.id) === selectedGroupId) : null;
  const isAdmin = selectedGroup && currentUserId && (selectedGroup.createdBy === currentUserId || selectedGroup.roles?.some(r => r.userId === currentUserId && r.role === 'admin'));
  const isMember = selectedGroup && currentUserId && selectedGroup.members.includes(currentUserId);

  useEffect(() => {
    if (selectedGroupId && selectedGroup) {
      loadGroupData();
    }
  }, [selectedGroupId, selectedGroup]);

  const loadGroupData = async () => {
    if (!selectedGroup) return;
    setLoading(true);
    try {
      // Cargar detalles completos del squad desde la API
      const groupData = await api.groups.getById(selectedGroup._id || selectedGroup.id);
      
      // Construir lista de miembros con información de usuarios
      const members: SquadMember[] = groupData.members.map((memberId: string) => {
        const user = users.find(u => u.id === memberId);
        const role = groupData.roles?.find((r: any) => r.userId === memberId)?.role || 'member';
        return {
          userId: memberId,
          username: user?.username || `User_${memberId}`,
          avatar: user?.avatar || `https://i.pravatar.cc/100?u=${memberId}`,
          role,
          joinedAt: new Date(),
          stats: { matchesPlayed: 0, wins: 0 }
        };
      });
      setSquadMembers(members);

      // Cargar feed de actividad desde la API
      const activity = await api.groups.getActivity(selectedGroup._id || selectedGroup.id);
      const squadActivityList: SquadActivity[] = activity.map((act: any) => ({
        id: act.id,
        userId: act.userId,
        username: users.find(u => u.id === act.userId)?.username || act.userId,
        action: act.action,
        timestamp: new Date(act.timestamp),
        details: act.details
      }));
      setSquadActivity(squadActivityList);
      setJoinRequests(groupData.joinRequests || []);
    } catch (err) {
      console.error('Failed to load group data', err);
      onNotification?.('No se pudieron cargar los datos del squad', 'error');
    }
    setLoading(false);
  };

  const handleCreateSquad = async () => {
    setGroupError('');
    if (!newGroupName.trim()) {
      setGroupError('El nombre del escuadrón no puede estar vacío.');
      return;
    }

    try {
      const newGroup = await api.groups.create({
        name: newGroupName,
        description: newGroupDesc || 'Un nuevo squad listo para la batalla',
        game: newGroupGame,
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        isPrivate: false
      });

      onAddGroup(newGroup);
      setShowCreate(false);
      setNewGroupName('');
      setNewGroupDesc('');
      onNotification?.('¡Squad creado exitosamente! +200 Frins', 'success');
    } catch (err) {
      setGroupError(err instanceof Error ? err.message : 'Error al crear squad');
      onNotification?.(err instanceof Error ? err.message : 'Error al crear squad', 'error');
    }
  };

  const handleInviteMember = async () => {
    if (!selectedGroup || !inviteUsername.trim()) {
      onNotification?.('Ingresa un nombre de usuario válido', 'error');
      return;
    }

    try {
      const targetUser = users.find(u => u.username?.toLowerCase() === inviteUsername.toLowerCase());
      if (!targetUser) {
        onNotification?.('Usuario no encontrado', 'error');
        return;
      }

      if (selectedGroup.members.includes(targetUser.id)) {
        onNotification?.('Este usuario ya está en el squad', 'error');
        return;
      }

      // Enviar invitación mediante API
      await api.groups.invite(selectedGroup._id || selectedGroup.id, targetUser.id);

      setInviteUsername('');
      setShowInviteModal(false);
      onNotification?.(`Invitación enviada a ${targetUser.username}`, 'success');
      
      // Recargar datos del squad
      await loadGroupData();
    } catch (err) {
      onNotification?.('Error al enviar la invitación', 'error');
    }
  };

  const handlePromoteMember = async (userId: string, newRole: 'officer' | 'member') => {
    if (!selectedGroup || !isAdmin) {
      onNotification?.('No tienes permisos para esta acción', 'error');
      return;
    }

    try {
      await api.groups.changeRole(selectedGroup._id || selectedGroup.id, userId, newRole);
      
      setSquadMembers(prev => prev.map(m => 
        m.userId === userId ? { ...m, role: newRole } : m
      ));

      onNotification?.(`Usuario promovido a ${newRole}`, 'success');
      await loadGroupData();
    } catch (err) {
      onNotification?.('Error al promover miembro', 'error');
    }
  };

  const handleKickMember = async (userId: string) => {
    if (!selectedGroup || !isAdmin) {
      onNotification?.('No tienes permisos para esta acción', 'error');
      return;
    }

    try {
      await api.groups.removeMember(selectedGroup._id || selectedGroup.id, userId);
      
      setSquadMembers(prev => prev.filter(m => m.userId !== userId));

      onNotification?.('Miembro removido del squad', 'success');
      await loadGroupData();
    } catch (err) {
      onNotification?.('Error al remover miembro', 'error');
    }
  };

  const handleLeaveGroup = async () => {
    if (!selectedGroup || !currentUserId) return;

    try {
      await api.groups.removeMember(selectedGroup._id || selectedGroup.id, currentUserId);
      setShowLeaveModal(false);
      setSelectedGroupId(null);
      onNotification?.('Has dejado el squad', 'success');
    } catch (err) {
      onNotification?.('Error al dejar el squad', 'error');
    }
  };

  const handleDisbandGroup = async () => {
    if (!selectedGroup || !isAdmin) return;

    try {
      await api.groups.disband(selectedGroup._id || selectedGroup.id);
      setShowDisbandModal(false);
      setSelectedGroupId(null);
      onNotification?.('Squad disuelto exitosamente', 'success');
    } catch (err) {
      onNotification?.('Error al disolver el squad', 'error');
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-16">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-accent mb-2 tracking-tight italic text-glow uppercase">
            {t('squads')}
          </h2>
          <p className="text-accent/60 text-xs sm:text-sm md:text-base font-bold tracking-[0.14em] md:tracking-[0.2em]">Crea y gestiona escuadrones competitivos</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-14 h-14 md:w-20 md:h-20 bg-primary rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl shadow-2xl shadow-primary/40 hover:scale-110 hover:rotate-90 transition-all active:scale-95 border-4 border-white/10"
        >
          +
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Squad List - Left Column */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-lg font-black text-accent uppercase tracking-widest mb-4">Mis Escuadrones ({groups.length})</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {groups.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center text-accent/60">
                <p className="text-sm mb-4">No tienes escuadrones aún</p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="text-primary font-bold hover:underline text-xs"
                >
                  Crear ahora →
                </button>
              </div>
            ) : (
              groups.map(group => (
                <button
                  key={group.id}
                  onClick={() => {
                    setSelectedGroupId(group._id || group.id);
                    setActiveTab('members');
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
                    (selectedGroupId === (group._id || group.id))
                      ? 'glass border-primary bg-primary/10 shadow-lg'
                      : 'glass border-accent/10 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img src={group.image} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-accent truncate text-sm">{group.name}</p>
                      <p className="text-[10px] text-accent/50">{group.game}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-accent/60 px-13">
                    <span>👥 {group.members.length}</span>
                    <span>⚔️ {group.stats?.matchesPlayed || 0}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Squad Details - Right Columns */}
        <div className="lg:col-span-2">
          {selectedGroup ? (
            <div className="space-y-5">
              {/* Squad Header */}
              <div className="glass rounded-3xl p-6 md:p-8 border border-accent/10 card-depth">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <img src={selectedGroup.image} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-xl" />
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-black text-accent mb-1 tracking-tight uppercase">{selectedGroup.name}</h2>
                    <p className="text-accent/60 mb-4 text-sm md:text-base italic">{selectedGroup.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-accent/60 text-[10px] font-black uppercase tracking-widest block">Miembros</span>
                        <span className="text-primary font-black text-xl">{selectedGroup.members.length}</span>
                      </div>
                      <div>
                        <span className="text-accent/60 text-[10px] font-black uppercase tracking-widest block">Juegos</span>
                        <span className="text-primary font-black text-xl">{selectedGroup.stats?.matchesPlayed || 0}</span>
                      </div>
                      <div>
                        <span className="text-accent/60 text-[10px] font-black uppercase tracking-widest block">Victorias</span>
                        <span className="text-primary font-black text-xl">{selectedGroup.stats?.wins || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {isMember && (
                      <>
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="px-4 py-2 bg-primary text-white font-black text-xs rounded-xl hover:scale-105 transition-all shadow-lg"
                        >
                          Invitar
                        </button>
                        {!isAdmin && (
                          <button
                            onClick={() => setShowLeaveModal(true)}
                            className="px-4 py-2 glass border-2 border-accent/20 text-accent font-black text-xs rounded-xl hover:bg-accent/10 transition-all"
                          >
                            Dejar Squad
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => setShowDisbandModal(true)}
                            className="px-4 py-2 glass border-2 border-red-500/30 text-red-400 font-black text-xs rounded-xl hover:bg-red-500/10 transition-all"
                          >
                            Disolver Squad
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b-2 border-accent/10 pb-4">
                {(['members', 'activity', 'tournaments', 'requests'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-black text-xs uppercase tracking-widest transition-all ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary -mb-4'
                        : 'text-accent/50 hover:text-accent'
                    }`}
                  >
                    {tab === 'members' && '👥 Miembros'}
                    {tab === 'activity' && '⚡ Actividad'}
                    {tab === 'tournaments' && '🏆 Torneos'}
                    {tab === 'requests' && '📬 Solicitudes'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="glass rounded-2xl p-6 min-h-96 border border-accent/10">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-accent/60">Cargando...</p>
                  </div>
                ) : activeTab === 'members' ? (
                  <div className="space-y-3">
                    {squadMembers.map(member => (
                      <div key={member.userId} className="flex items-center justify-between p-4 rounded-xl border border-accent/10 hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                          <img src={member.avatar} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-black text-accent">{member.username}</p>
                            <p className="text-[10px] text-accent/50 flex gap-2">
                              <span className="px-2 py-1 bg-primary/20 text-primary rounded">{member.role}</span>
                              <span>{member.stats?.wins || 0}W {member.stats?.matchesPlayed || 0}G</span>
                            </p>
                          </div>
                        </div>
                        {isAdmin && member.userId !== currentUserId && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePromoteMember(member.userId, member.role === 'member' ? 'officer' : 'member')}
                              className="px-3 py-1 text-[10px] font-black bg-primary/20 text-primary rounded hover:bg-primary/30 transition-all"
                            >
                              {member.role === 'member' ? 'Promover' : 'Degradar'}
                            </button>
                            <button
                              onClick={() => handleKickMember(member.userId)}
                              className="px-3 py-1 text-[10px] font-black bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-all"
                            >
                              Expulsar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : activeTab === 'activity' ? (
                  <div className="space-y-3">
                    {squadActivity.map(activity => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl border border-accent/10 hover:border-primary/30 transition-all">
                        <img src={users.find(u => u.id === activity.userId)?.avatar || `https://i.pravatar.cc/100?u=${activity.userId}`} className="w-8 h-8 rounded-full object-cover mt-1" />
                        <div className="flex-1">
                          <p className="text-accent text-sm">
                            <span className="font-black">{activity.username}</span>
                            {activity.action === 'joined' && ' se unió al squad'}
                            {activity.action === 'match_won' && ` ganó una partida (${activity.details?.kills}K)`}
                            {activity.action === 'promoted' && ` fue promovido a ${activity.details?.newRole}`}
                            {activity.action === 'kicked' && ' fue expulsado'}
                          </p>
                          <p className="text-[10px] text-accent/50 mt-1">
                            {new Date(activity.timestamp).toLocaleDateString('es-ES', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeTab === 'tournaments' ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <p className="text-4xl">🏆</p>
                    <p className="text-accent font-black">Próximos Torneos</p>
                    <p className="text-accent/60 text-sm">Tu squad puede participar en torneos para ganar recompensas</p>
                    <button className="mt-4 px-6 py-2 bg-primary text-white font-black text-xs rounded-xl hover:scale-105 transition-all">
                      Ver Torneos Disponibles
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <p className="text-4xl">📬</p>
                    <p className="text-accent font-black">Sin Solicitudes Pendientes</p>
                    <p className="text-accent/60 text-sm">Las solicitudes de entrada aparecerán aquí</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass rounded-3xl p-12 border border-accent/10 flex flex-col items-center justify-center h-96 text-center">
              <p className="text-4xl mb-4">👥</p>
              <p className="text-accent font-black mb-2">Selecciona un Squad</p>
              <p className="text-accent/60 text-sm mb-6">Elige uno de tus escuadrones para ver detalles y gestionar miembros</p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-6 py-2 bg-primary text-white font-black text-xs rounded-xl hover:scale-105 transition-all"
              >
                Crear Squad
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Squad Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 glass backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-secondary p-5 md:p-8 rounded-3xl md:rounded-[44px] w-full max-w-2xl border-4 border-primary/20 card-depth shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <h3 className="text-2xl md:text-4xl font-display font-bold text-accent mb-6 md:mb-8 tracking-tight italic text-glow uppercase">Crear Squad</h3>
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
                  placeholder="Describe tu squad..."
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
                <button onClick={handleCreateSquad} className="flex-1 py-3.5 bg-primary text-white font-black rounded-2xl uppercase tracking-[0.14em] text-[10px] md:text-xs shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">Create Squad</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-secondary p-6 rounded-3xl w-full max-w-md border-4 border-primary/20 card-depth shadow-2xl animate-in zoom-in duration-500">
            <h3 className="text-2xl font-black text-accent mb-6 uppercase">Invitar Miembro</h3>
            <div className="space-y-4">
              <input
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                placeholder="Nombre de usuario..."
                className="w-full glass bg-transparent border-b-2 border-accent/20 py-3 text-base focus:border-primary outline-none transition-all placeholder:text-accent/20"
              />
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 py-3 glass text-accent font-black rounded-xl border-2 border-accent/20 uppercase text-xs hover:bg-accent/10 transition-all">Cancelar</button>
                <button onClick={handleInviteMember} className="flex-1 py-3 bg-primary text-white font-black rounded-xl uppercase text-xs shadow-lg hover:scale-105 transition-all">Invitar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Group Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-secondary p-6 rounded-3xl w-full max-w-md border-4 border-red-500/20 card-depth shadow-2xl animate-in zoom-in duration-500">
            <h3 className="text-2xl font-black text-red-400 mb-4 uppercase">Dejar Squad</h3>
            <p className="text-accent/70 mb-6">¿Estás seguro de que quieres dejar {selectedGroup?.name}?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLeaveModal(false)} className="flex-1 py-3 glass text-accent font-black rounded-xl border-2 border-accent/20 uppercase text-xs hover:bg-accent/10 transition-all">Cancelar</button>
              <button onClick={handleLeaveGroup} className="flex-1 py-3 bg-red-500/30 text-red-400 font-black rounded-xl uppercase text-xs hover:bg-red-500/50 transition-all">Dejar</button>
            </div>
          </div>
        </div>
      )}

      {/* Disband Group Modal */}
      {showDisbandModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-secondary p-6 rounded-3xl w-full max-w-md border-4 border-red-500/20 card-depth shadow-2xl animate-in zoom-in duration-500">
            <h3 className="text-2xl font-black text-red-400 mb-4 uppercase">Disolver Squad</h3>
            <p className="text-accent/70 mb-6">⚠️ Esta acción es irreversible. Todos los miembros serán removidos y se perderá toda la información del squad.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDisbandModal(false)} className="flex-1 py-3 glass text-accent font-black rounded-xl border-2 border-accent/20 uppercase text-xs hover:bg-accent/10 transition-all">Cancelar</button>
              <button onClick={handleDisbandGroup} className="flex-1 py-3 bg-red-500/30 text-red-400 font-black rounded-xl uppercase text-xs hover:bg-red-500/50 transition-all">Disolver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
