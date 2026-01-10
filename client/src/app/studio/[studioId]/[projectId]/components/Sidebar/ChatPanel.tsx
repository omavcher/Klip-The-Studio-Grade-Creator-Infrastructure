'use client';

import React, { useRef, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { ChatMessage, REACTIONS } from '../../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  onAddReaction,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {messages.map(message => (
          <div 
            key={message.id}
            className={`p-3 rounded-xl ${
              message.isSystem 
                ? 'bg-blue-500/10 border border-blue-500/20' 
                : message.sender === 'You'
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20'
                : 'bg-zinc-900/50 border border-white/5'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  message.isSystem ? 'text-blue-400' : 
                  message.sender === 'You' ? 'text-green-400' : 'text-white'
                }`}>
                  {message.sender}
                </span>
                {!message.isSystem && (
                  <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                    {formatTime(message.timestamp)}
                  </span>
                )}
              </div>
              {message.isSystem && (
                <AlertCircle size={14} className="text-blue-400" />
              )}
            </div>
            
            <p className="text-sm mb-2">{message.message}</p>
            
            {message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAddReaction(message.id, reaction.emoji)}
                    className="px-2 py-1 bg-zinc-800/50 rounded-lg text-xs hover:bg-zinc-700/50 transition-colors"
                  >
                    <span className="mr-1">{reaction.emoji}</span>
                    <span className="text-zinc-400">{reaction.users.length}</span>
                  </button>
                ))}
              </div>
            )}
            
            {!message.isSystem && (
              <div className="flex gap-1 mt-2 pt-2 border-t border-white/5">
                {REACTIONS.slice(0, 3).map(reaction => (
                  <button
                    key={reaction.id}
                    onClick={() => onAddReaction(message.id, reaction.emoji)}
                    className="p-1 hover:bg-white/5 rounded transition-colors text-sm"
                    title={reaction.label}
                  >
                    {reaction.emoji}
                  </button>
                ))}
                <button className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 hover:bg-white/5 rounded transition-colors">
                  + Add
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Type a message..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder-zinc-500"
          />
          <div className="absolute right-2 top-2 flex gap-1">
            {REACTIONS.slice(0, 3).map(reaction => (
              <button
                key={reaction.id}
                onClick={() => setNewMessage(prev => prev + reaction.emoji)}
                className="p-1 hover:bg-white/5 rounded transition-colors"
                title={reaction.label}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onSendMessage}
          disabled={!newMessage.trim()}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};