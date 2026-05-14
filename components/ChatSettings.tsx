import React, { useState } from 'react';

interface ChatSettingsProps {
  chatName: string;
  isPrivate: boolean;
  isMuted: boolean;
  onSave: (settings: { chatName: string; isPrivate: boolean; isMuted: boolean }) => void;
  onClose: () => void;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({
  chatName,
  isPrivate,
  isMuted,
  onSave,
  onClose
}) => {
  const [settings, setSettings] = useState({ chatName, isPrivate, isMuted });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-secondary rounded-[32px] p-8 max-w-md w-full border-2 border-accent/20 space-y-6 animate-in fade-in scale-95">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-black text-accent uppercase">Ajustes del Chat</h3>
          <button 
            onClick={onClose} 
            className="text-2xl opacity-50 hover:opacity-100 transition-opacity active:scale-75"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* Chat Name */}
          <div>
            <label className="text-xs font-black uppercase text-accent/50 mb-2 block">
              Nombre del chat
            </label>
            <input
              value={settings.chatName}
              onChange={(e) => setSettings({...settings, chatName: e.target.value})}
              className="w-full glass bg-transparent border-b-2 border-accent/20 p-2 outline-none focus:border-primary text-accent placeholder:text-accent/30"
              placeholder="Ej: Mi dúo favorito"
              maxLength={30}
            />
            <p className="text-[10px] text-accent/30 mt-1">{settings.chatName.length}/30</p>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
            <div>
              <label className="text-sm font-black uppercase text-accent/70">Privado</label>
              <p className="text-xs text-accent/40">Solo para los participantes</p>
            </div>
            <button
              onClick={() => setSettings({...settings, isPrivate: !settings.isPrivate})}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.isPrivate ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.isPrivate ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Mute Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
            <div>
              <label className="text-sm font-black uppercase text-accent/70">Silenciar notificaciones</label>
              <p className="text-xs text-accent/40">No recibirás alertas</p>
            </div>
            <button
              onClick={() => setSettings({...settings, isMuted: !settings.isMuted})}
              className={`w-12 h-6 rounded-full transition-all relative ${settings.isMuted ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.isMuted ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/5 text-accent font-black rounded-xl uppercase tracking-wide hover:bg-white/10 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(settings);
              onClose();
            }}
            className="flex-1 py-3 bg-primary text-white font-black rounded-xl uppercase tracking-wide hover:bg-primary/80 transition-all active:scale-95"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
