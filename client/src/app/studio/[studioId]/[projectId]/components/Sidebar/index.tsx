'use client';

import React from 'react';
import { Users, MessageSquare, Radio, Music, Shield, UserPlus } from 'lucide-react';
import { PeoplePanel } from './PeoplePanel';
import { ChatPanel } from './ChatPanel';
import { BrandPanel } from './BrandPanel';
import { MediaPanel } from './MediaPanel';

interface SidebarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  participants: any[];
  chatMessages: any[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  recordings: any[];
  settings: any;
  updateSettings: (updates: any) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onSendMessage: () => void;
  onInviteClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePanel,
  setActivePanel,
  participants,
  chatMessages,
  newMessage,
  setNewMessage,
  recordings,
  settings,
  updateSettings,
  onAddReaction,
  onSendMessage,
  onInviteClick,
}) => {
  const panels = [
    { id: 'people', icon: <Users size={18} />, label: 'People' },
    { id: 'chat', icon: <MessageSquare size={18} />, label: 'Chat' },
    { id: 'brand', icon: <Radio size={18} />, label: 'Brand' },
    { id: 'media', icon: <Music size={18} />, label: 'Media' },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'people':
        return <PeoplePanel participants={participants} onInviteClick={onInviteClick} />;
      case 'chat':
        return (
          <ChatPanel
            messages={chatMessages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={onSendMessage}
            onAddReaction={onAddReaction}
          />
        );
      case 'brand':
        return <BrandPanel settings={settings} updateSettings={updateSettings} />;
      case 'media':
        return <MediaPanel recordings={recordings} />;
      default:
        return <PeoplePanel participants={participants} onInviteClick={onInviteClick} />;
    }
  };

  return (
    <aside className="w-96 border-l border-white/5 bg-gradient-to-b from-[#0D0D0D] to-black flex flex-col">
      {/* Panel Tabs */}
      <div className="flex border-b border-white/5">
        {panels.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
              activePanel === tab.id
                ? 'text-blue-500'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium uppercase">{tab.label}</span>
            {activePanel === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
            )}
          </button>
        ))}
      </div>
      
      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderPanel()}
      </div>
    </aside>
  );
};

// Export all sidebar components
export { PeoplePanel } from './PeoplePanel';
export { ChatPanel } from './ChatPanel';
export { BrandPanel } from './BrandPanel';
export { MediaPanel } from './MediaPanel';