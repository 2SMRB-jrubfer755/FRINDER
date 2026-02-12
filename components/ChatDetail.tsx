
import React, { useState, useEffect, useRef } from 'react';
import { User, Message, Chat } from '../types';
import { getGamerResponse } from '../services/geminiService';
import { api } from '../services/api';

interface ChatDetailProps {
  chat: Chat;
  user: User;
  onSendMessage: (chatId: string, message: Message) => void;
  onBack: () => void;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ chat, user, onSendMessage, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: Date.now()
    };

    try {
      const updatedChat = await api.chats.sendMessage({
        chatId: chat.id,
        participants: chat.participants,
        message: userMessage
      });

      // Notify parent to update chat list/state
      // For now, we rely on the fact that if we re-fetch or if the parent updates, it shows.
      // But ChatDetail props 'chat' comes from parent. 
      // Ideally we should call a prop onSendMessage that updates the parent state.
      onSendMessage(chat.id, userMessage);

      setInputText('');
      setIsTyping(true);

      // AI Gamer Response (Mocked for now as we don't have a backend for AI yet, or we could call backend)
      // For this migration, we keep the client-side AI mock response but send it to DB too.
      const history = chat.messages.map(m => ({
        role: m.senderId === 'me' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const aiText = await getGamerResponse(user.name, user.bio, history, inputText);

      setIsTyping(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: user.id,
        text: aiText,
        timestamp: Date.now(),
        isAi: true
      };

      await api.chats.sendMessage({
        chatId: chat.id,
        participants: chat.participants,
        message: aiMessage
      });

      onSendMessage(chat.id, aiMessage);
    } catch (e) {
      console.error("Failed to send message", e);
    }
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
        <button className="text-xl opacity-50 hover:opacity-100">📞</button>
        <button className="text-xl opacity-50 hover:opacity-100">⚙️</button>
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
        {chat.messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed
              ${m.senderId === 'me'
                ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20'
                : 'glass border border-accent/10 text-accent rounded-bl-none'}
            `}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass px-4 py-3 rounded-2xl rounded-bl-none flex space-x-1">
              <div className="w-2 h-2 bg-accent/40 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-accent/40 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-accent/40 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-accent/10">
        <div className="glass flex items-center px-4 py-2 rounded-2xl border border-accent/20 focus-within:border-primary transition-all">
          <button className="mr-3 opacity-50 text-xl">📎</button>
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
