
import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Chat } from '../types';
import { api } from '../services/api';

interface ChatDetailProps {
  chat: Chat;
  user: User;
  currentUserId?: string | null;
  // include optional updated chat object from server
  onSendMessage: (chatId: string, message: Message, updatedChat?: Chat) => void;
  onBack: () => void;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chat, user, currentUserId, onSendMessage, onBack }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatId = (chat as any)._id || (chat as any).id;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId || 'me',
      text: inputText,
      timestamp: Date.now()
    };

    try {
      const updatedChat = await api.chats.sendMessage({
        chatId: chatId,
        participants: chat.participants,
        message: userMessage
      });

      // Notify parent to update chat list/state with returned object
      onSendMessage(chatId, userMessage, updatedChat);

      setInputText('');
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // basic validation: only images under 2MB
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten imágenes como archivo adjunto.');
      } else if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado pesado. Máximo 2MB.');
      } else {
        console.log('Attached file:', file);
        alert(`Archivo adjuntado: ${file.name}`);
      }
    }
    // reset input value so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] glass rounded-3xl overflow-hidden card-depth">
      {/* Header */}
      <header className="p-4 border-b border-accent/10 flex items-center space-x-4">
        <button onClick={onBack} className="md:hidden text-2xl">←</button>
        <div className="relative">
          <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-secondary rounded-full" />
        </div>
        <div>
          <h4 className="font-bold text-white leading-none">{user.name}</h4>
          <p className="text-[10px] text-accent/50 uppercase tracking-widest font-bold">In-Game: Valorant</p>
        </div>
        <div className="flex-1" />
        <button onClick={async () => {
          try {
            const callMessage: Message = {
              id: Date.now().toString(),
              senderId: currentUserId || 'me',
              text: '📞 Started a voice call',
              timestamp: Date.now()
            };
            await api.chats.sendMessage({ chatId: chatId, participants: chat.participants, message: callMessage });
            onSendMessage(chatId, callMessage);
          } catch (e) {
            console.error('Failed to record call message', e);
          }
        }} className="text-xl opacity-50 hover:opacity-100">📞</button>
        <button onClick={() => {
          // Open chat settings menu (future enhancement)
          console.log('Chat settings opened');
        }} className="text-xl opacity-50 hover:opacity-100 active:scale-75 transition-all">⚙️</button>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar"
      >
        {chat.messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-accent/30 italic text-sm">Say something to break the ice!</p>
          </div>
        )}
        {chat.messages.map((m) => {
          const isMine = m.senderId === (currentUserId || 'me');
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed
                ${isMine
                  ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20'
                  : 'glass border border-accent/10 text-accent rounded-bl-none'}
              `}>
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-accent/10">
        <div className="glass flex items-center px-4 py-2 rounded-2xl border border-accent/20 focus-within:border-primary transition-all">
          <button onClick={() => fileInputRef.current?.click()} className="mr-3 opacity-50 text-xl">📎</button>
          <input ref={fileInputRef} type="file" onChange={handleFile} className="hidden" />
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-accent placeholder:text-accent/30 py-2"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="ml-3 bg-primary w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
