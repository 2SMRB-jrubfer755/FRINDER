
import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Chat } from '../types';
import { api } from '../services/api';
import CallOverlay from './CallOverlay';
import ChatSettings from './ChatSettings';

interface ChatDetailProps {
  chat: Chat;
  user: User;
  currentUserId?: string | null;
  onSendMessage: (chatId: string, message: Message, updatedChat?: Chat) => void;
  onBack: () => void;
  onNotification?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chat, user, currentUserId, onSendMessage, onBack, onNotification }) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const chatId = (chat as any)?._id || (chat as any)?.id;
  const chatSettings_state = { 
    chatName: chat?.chatName || '', 
    isPrivate: chat?.isPrivate || false, 
    isMuted: chat?.mutedBy?.includes(currentUserId as string) || false 
  };
  const [chatSettings, setChatSettings] = useState(chatSettings_state);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollRef.current && chat?.messages) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  // Auto-scroll para nuevos mensajes
  useEffect(() => {
    if (scrollRef.current && chat?.messages) {
      const timer = setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [chat?.messages?.length]);

  // Cleanup call timer
  useEffect(() => {
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId || 'me',
      text: inputText,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    try {
      const updatedChat = await api.chats.sendMessage({
        chatId: chatId,
        participants: chat.participants,
        message: userMessage
      });

      onSendMessage(chatId, userMessage, updatedChat);
      setInputText('');
      setAttachments([]);
    } catch (e) {
      console.error("Failed to send message", e);
      onNotification?.('No se pudo enviar el mensaje', 'error');
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onNotification?.('El archivo es demasiado pesado. Máximo 5MB.', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const attachment = {
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: event.target?.result as string,
          name: file.name,
          size: file.size
        };
        setAttachments(prev => [...prev, attachment]);
        onNotification?.(`📎 ${file.name} adjuntado`, 'success');
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditMessage = async (messageId: string, originalText: string) => {
    if (editingId === messageId) {
      // Save edit
      if (editText.trim() === originalText) {
        setEditingId(null);
        return;
      }
      try {
        await api.chats.editMessage(chatId, messageId, editText);
        onNotification?.('Mensaje editado', 'success');
        setEditingId(null);
      } catch (e) {
        onNotification?.('No se pudo editar el mensaje', 'error');
      }
    } else {
      // Start editing
      setEditingId(messageId);
      setEditText(originalText);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await api.chats.deleteMessage(chatId, messageId);
      onNotification?.('Mensaje borrado', 'success');
      setShowMenuId(null);
    } catch (e) {
      onNotification?.('No se pudo borrar el mensaje', 'error');
    }
  };

  const handleStartCall = async () => {
    if (isCalling) {
      // End call
      setIsCalling(false);
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
      try {
        await api.chats.recordCall(chatId, {
          endTime: Date.now(),
          accepted: true
        });
      } catch (e) {
        console.error('Failed to record call end', e);
      }
      setCallDuration(0);
      onNotification?.(`Llamada finalizada. Duración: ${Math.floor(callDuration / 60)}m ${callDuration % 60}s`, 'info');
    } else {
      // Start call
      setIsCalling(true);
      setCallDuration(0);
      try {
        await api.chats.recordCall(chatId, {
          callId: `call_${Date.now()}`,
          accepted: true
        });
        
        // Start timer
        callIntervalRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        onNotification?.(`📞 Llamada iniciada con ${user.name}`, 'success');
      } catch (e) {
        setIsCalling(false);
        onNotification?.('No se pudo iniciar la llamada', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-64px)] glass rounded-3xl overflow-hidden card-depth">
      <CallOverlay 
        isActive={isCalling} 
        duration={callDuration} 
        userName={user.name}
        userAvatar={user.avatar}
        onEnd={handleStartCall}
        isMuted={false}
      />
      {/* Header */}
      <header className="p-4 border-b border-accent/10 flex items-center space-x-4 bg-secondary/50 backdrop-blur">
        <button onClick={onBack} className="md:hidden text-2xl">←</button>
        <div className="relative">
          <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-secondary rounded-full ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-white leading-none">{user.name}</h4>
          <p className="text-[10px] text-accent/50 uppercase tracking-widest font-bold">{user.isOnline ? '🟢 En línea' : '⚪ Offline'}</p>
        </div>
        
        {/* Call button */}
        <button 
          onClick={handleStartCall}
          className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wide transition-all ${
            isCalling 
              ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
              : 'text-accent opacity-60 hover:opacity-100'
          }`}
        >
          {isCalling ? `📞 ${Math.floor(callDuration / 60)}:${String(callDuration % 60).padStart(2, '0')}` : '📞 Llamar'}
        </button>

        {/* Settings button */}
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-xl opacity-60 hover:opacity-100 active:scale-75 transition-all"
        >
          ⚙️
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar" ref={scrollRef}>
        {!chat?.messages || chat.messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-accent/30 italic text-sm">¡Comienza la conversación! Di algo para romper el hielo 💬</p>
          </div>
        )}
        {chat?.messages?.map((m) => {
          if (!m?.id) return null;
          const isMine = m.senderId === (currentUserId || 'me');
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}>
              <div className={`relative max-w-[80%]`}>
                {editingId === m.id ? (
                  // Edit mode
                  <div className="flex gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 glass px-4 py-2 rounded-2xl border border-primary outline-none focus:border-accent"
                    />
                    <button
                      onClick={() => handleEditMessage(m.id, m.text)}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 glass rounded-lg font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed cursor-pointer relative
                      ${isMine
                        ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20 hover:shadow-lg'
                        : 'glass border border-accent/10 text-accent rounded-bl-none hover:border-accent/30'}
                    `}>
                      {m.text}
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {m.attachments.map((att, idx) => (
                            <div key={idx}>
                              {att.type === 'image' && (
                                <img src={att.url} className="max-w-xs rounded-lg max-h-48 object-cover" alt={att.name} />
                              )}
                              {att.type !== 'image' && (
                                <a href={att.url} download className="text-xs underline opacity-80">
                                  📎 {att.name} ({Math.round(att.size / 1024)}KB)
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {m.isEdited && <span className="text-[9px] opacity-60 ml-1">(editado)</span>}
                    </div>

                    {/* Message menu */}
                    {isMine && (
                      <div className="absolute right-0 top-0 -mr-8 opacity-0 group-hover:opacity-100 transition-all flex gap-1">
                        <button
                          onClick={() => handleEditMessage(m.id, m.text)}
                          className="w-6 h-6 rounded text-xs flex items-center justify-center hover:bg-accent/20"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="w-6 h-6 rounded text-xs flex items-center justify-center hover:bg-red-500/20"
                          title="Borrar"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Settings Modal */}
      {showSettings && (
        <ChatSettings 
          chatName={chatSettings.chatName}
          isPrivate={chatSettings.isPrivate}
          isMuted={chatSettings.isMuted}
          onSave={async (updatedSettings) => {
            setChatSettings(updatedSettings);
            try {
              await api.chats.updateChat(chatId, {
                chatName: updatedSettings.chatName,
                isPrivate: updatedSettings.isPrivate
              });
              
              if (updatedSettings.isMuted) {
                await api.chats.muteChat(chatId, true);
              } else {
                await api.chats.muteChat(chatId, false);
              }
              
              onNotification?.('Ajustes del chat guardados', 'success');
            } catch (e) {
              onNotification?.('No se pudieron guardar los ajustes', 'error');
            }
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Input Area */}
      <div className="border-t border-accent/10 bg-secondary/50 backdrop-blur p-4 space-y-3">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative">
                {att.type === 'image' && (
                  <img src={att.url} className="h-16 w-16 rounded-lg object-cover" alt={att.name} />
                )}
                {att.type !== 'image' && (
                  <div className="h-16 w-16 bg-accent/20 rounded-lg flex items-center justify-center text-xs">
                    📎
                  </div>
                )}
                <button
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="glass flex items-center px-4 py-3 rounded-2xl border border-accent/20 focus-within:border-primary transition-all gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="text-lg opacity-60 hover:opacity-100 transition-opacity hover:text-primary"
            title="Adjuntar archivo"
          >
            📎
          </button>
          <input 
            ref={fileInputRef} 
            type="file" 
            onChange={handleFile} 
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx"
          />
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent border-none outline-none text-accent placeholder:text-accent/40 py-2"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() && attachments.length === 0}
            className="text-lg opacity-60 hover:opacity-100 disabled:opacity-30 transition-opacity hover:text-primary"
            title="Enviar (Enter)"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
