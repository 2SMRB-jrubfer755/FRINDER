import React, { useState, useEffect } from 'react';

interface CallOverlayProps {
  isActive: boolean;
  duration: number;
  userName: string;
  userAvatar: string;
  onEnd: () => void;
  onMuteToggle?: (muted: boolean) => void;
  isMuted?: boolean;
}

const CallOverlay: React.FC<CallOverlayProps> = ({
  isActive,
  duration,
  userName,
  userAvatar,
  onEnd,
  onMuteToggle,
  isMuted = false
}) => {
  if (!isActive) return null;

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-black/80 via-black/70 to-black/80 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <div className="text-center space-y-6">
        {/* Avatar */}
        <div className="animate-pulse">
          <img 
            src={userAvatar} 
            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary shadow-xl shadow-primary/50" 
            alt={userName}
          />
        </div>

        {/* User Name */}
        <div>
          <h2 className="text-4xl font-black text-white mb-2">{userName}</h2>
          <p className="text-lg text-accent/70 font-bold">Llamada en curso</p>
        </div>

        {/* Call Duration */}
        <div className="bg-primary/20 px-6 py-3 rounded-2xl border-2 border-primary inline-block">
          <p className="text-3xl font-black text-primary font-mono">{timeStr}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-6 justify-center">
          {/* Mute Button */}
          {onMuteToggle && (
            <button
              onClick={() => onMuteToggle(!isMuted)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all transform hover:scale-110 ${
                isMuted
                  ? 'bg-red-500/30 border-2 border-red-500 animate-pulse'
                  : 'bg-white/10 border-2 border-accent/50 hover:bg-white/20'
              }`}
              title={isMuted ? 'Activar micrófono' : 'Mutearse'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={onEnd}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-red-500/30 border-2 border-red-500 hover:bg-red-500/50 transition-all transform hover:scale-110 animate-pulse"
            title="Finalizar llamada"
          >
            📞
          </button>

          {/* Speaker Button */}
          <button
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-white/10 border-2 border-accent/50 hover:bg-white/20 transition-all transform hover:scale-110"
            title="Altavoz"
          >
            🔊
          </button>
        </div>

        {/* Call Status */}
        <div className="text-center">
          <p className="text-sm text-accent/50 uppercase tracking-widest font-bold">
            ✓ Llamada conectada
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;
