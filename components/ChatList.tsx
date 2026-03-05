
import React, { useState } from 'react';
import { User, Chat } from '../types';
import { api } from '../services/api';

interface ChatListProps {
  users: User[];
  chats: Chat[];
  currentUserId?: string | null;
  onSelectChat: (chatId: string) => void;
  onNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}
}

const ChatList: React.FC<ChatListProps> = ({ users, chats, onSelectChat, onNotification }) => {
  const [profileUser, setProfileUser] = useState<null | User>(null);
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-display font-bold text-accent mb-2">My Squad</h2>
        <p className="text-accent/60">Active conversations with your matches</p>
      </header>

      {/* New Matches Row */}
      <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
        {users.slice(0, 5).map(user => (
          <button key={user.id} onClick={() => setProfileUser(user)} className="flex-shrink-0 text-center space-y-2 group cursor-pointer">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] bg-gradient-to-tr from-primary to-accent group-hover:scale-105 transition-transform">
              <img 
                src={user.avatar} 
                className="w-full h-full rounded-full object-cover border-4 border-secondary"
                alt={user.name}
              />
              {user.isOnline && (
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-secondary rounded-full" />
              )}
            </div>
            <p className="text-xs font-bold text-accent/80 truncate w-20">{user.name.split(' ')[0]}</p>
          </button>
        ))}
      </div>

      {profileUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-secondary p-6 rounded-2xl w-full max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <img src={profileUser.avatar} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-bold text-lg">{profileUser.name}</h4>
                <p className="text-sm text-accent/60">{profileUser.bio}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={async () => {
                // create or fetch chat with this user
                try {
                  const participants = [profileUser.id];
                  if (currentUserId) participants.unshift(currentUserId);
                  else {
                    onNotification?.('Por favor, inicia sesión primero', 'error');
                    return;
                  }
                  const savedChat = await api.chats.sendMessage({ participants, message: null });
                  const newChatId = savedChat._id || savedChat.id;
                  setProfileUser(null);
                  onSelectChat(newChatId);
                } catch (err) {
                  console.error('Failed to open chat', err);
                  onNotification?.('No se pudo abrir el chat', 'error');
                }
              }} className="flex-1 py-2 bg-primary text-white rounded-md">Message</button>
              <button onClick={() => setProfileUser(null)} className="flex-1 py-2 glass rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {chats.map(chat => {
          const chatId = (chat as any)._id || (chat as any).id;
          const participantId = chat.participants[0]; // Simplified for demo
          const user = users.find(u => u.id === participantId || (u as any)._id === participantId);
          if (!user) return null;

          return (
            <button
              key={chatId}
              onClick={() => onSelectChat(chatId)}
              className="w-full glass flex items-center p-4 rounded-2xl hover:bg-accent/5 transition-all border border-transparent hover:border-accent/20 group"
            >
              <img src={user.avatar} className="w-16 h-16 rounded-2xl object-cover mr-4 group-hover:scale-105 transition-transform" />
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-lg text-white group-hover:text-accent transition-colors">{user.name}</h4>
                  <span className="text-[10px] text-accent/40 font-bold uppercase tracking-widest">Now</span>
                </div>
                <p className="text-accent/60 text-sm truncate max-w-[200px]">
                  {chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1].text 
                    : `Matched! Say hi to ${user.name}`}
                </p>
              </div>
            </button>
          );
        })}

        {chats.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <span className="text-6xl block mb-4">🌑</span>
            <p className="font-bold uppercase tracking-widest">No active chats yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
