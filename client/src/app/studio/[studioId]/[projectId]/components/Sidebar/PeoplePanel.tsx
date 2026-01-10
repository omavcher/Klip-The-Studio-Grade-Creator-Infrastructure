'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { 
  UserPlus, Mic, MicOff, Video, VideoOff, LogOut, 
  Crown, MoreVertical, Search, MessageSquare, 
  Pin, Users, X, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Participant } from '../../types';

// --- UTILS ---
const formatTime = (seconds: number): string => {
  if (seconds < 60) return '<1m';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
};

// --- SUB-COMPONENTS ---

const ActionButton = memo(({
  icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
      destructive
        ? 'text-red-400 bg-red-500/5 hover:bg-red-500/20'
        : 'text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/50'
    }`}
  >
    <span className="shrink-0">{icon}</span>
    <span>{label}</span>
  </button>
));

const ParticipantCard = memo(({
  participant,
  isSelected,
  onSelect,
  onAction,
}: {
  participant: Participant;
  isSelected: boolean;
  onSelect: () => void;
  onAction: (participantId: string, action: string) => void;
}) => {
  const joinedTime = Math.floor((Date.now() - new Date(participant.joinedAt).getTime()) / 1000);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group
        ${isSelected 
          ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/5' 
          : 'border-white/5 bg-zinc-900/40 hover:border-white/10 hover:bg-zinc-800/50'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* AVATAR SYSTEM */}
        <div className="relative shrink-0">
          <div className={`w-11 h-11 rounded-xl ${participant.avatarColor} flex items-center justify-center text-sm font-black shadow-inner text-white`}>
            {participant.name.charAt(0).toUpperCase()}
          </div>
          {participant.isSpeaking && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-1 border-2 border-green-500 rounded-xl" 
            />
          )}
          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0A0A0A] ${
            participant.connectionStatus === 'excellent' ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
        </div>

        {/* IDENTITY INFO */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-bold truncate text-zinc-100">{participant.name}</p>
            {participant.isHost && <Crown size={12} className="text-yellow-500 shrink-0" />}
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {participant.isHost ? 'Host' : 'Guest'} • {formatTime(joinedTime)}
          </p>
        </div>
      </div>

      {/* AUDIO VISUALIZER BARS */}
      <div className="flex items-center gap-3 ml-2">
        {participant.isAudioOn ? (
          <div className="flex items-end gap-0.5 h-3 w-4">
            {[0.4, 1, 0.6].map((v, i) => (
              <motion.div 
                key={i} 
                animate={{ height: participant.isSpeaking ? [`${v*100}%`, '100%', `${v*50}%`] : '20%' }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                className="w-1 bg-green-500 rounded-full" 
              />
            ))}
          </div>
        ) : <MicOff size={14} className="text-red-500/70" />}
        
        <button className="p-2 hover:bg-white/10 rounded-xl text-zinc-500 group-hover:text-white transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>
    </motion.div>
  );
});

// --- MAIN COMPONENT ---

export const PeoplePanel: React.FC<any> = ({ 
  participants, 
  onInviteClick,
  onMuteParticipant,
  onRemoveParticipant,
  onMakeHost
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'status'>('name');

  const filteredParticipants = useMemo(() => {
    return [...participants]
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
        return sortBy === 'name' ? a.name.localeCompare(b.name) : 0;
      });
  }, [participants, searchQuery, sortBy]);

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-hidden">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SEARCH HEADER */}
      <div className="mb-6 space-y-4 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Users size={14} /> Participants ({participants.length})
          </h3>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500/30 transition-all placeholder:text-zinc-600 text-white"
          />
        </div>
      </div>

      {/* LIST AREA - SCROLLBARS HIDDEN */}
      <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar pb-20">
        {filteredParticipants.map((p) => (
          <ParticipantCard 
            key={p.id}
            participant={p}
            isSelected={selectedId === p.id}
            onSelect={() => setSelectedId(selectedId === p.id ? null : p.id)}
            onAction={() => {}}
          />
        ))}

        {filteredParticipants.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <Search size={40} className="mx-auto mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No results</p>
          </div>
        )}
      </div>

      {/* INVITE FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent shrink-0">
        <button 
          onClick={onInviteClick}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-blue-600/20"
        >
          <UserPlus size={18} /> Invite Guests
        </button>
      </div>

      {/* ACTION DRAWER: RESPONSIVE BOTTOM SHEET */}
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-4 md:left-4 md:right-4 bg-[#121212] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2rem] p-8 z-[110] shadow-2xl"
            >
              {/* Drag Handle Mobile */}
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-8 md:hidden" />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-1">Moderation</h4>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Manage participant permissions</p>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><X size={20}/></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ActionButton icon={<MicOff size={18}/>} label="Mute Participant" onClick={() => onMuteParticipant?.(selectedId)} />
                <ActionButton icon={<MessageSquare size={18}/>} label="Send Message" onClick={() => {}} />
                <ActionButton icon={<Crown size={18}/>} label="Make Studio Host" onClick={() => onMakeHost?.(selectedId)} />
                <ActionButton icon={<LogOut size={18}/>} label="Remove from Session" onClick={() => onRemoveParticipant?.(selectedId)} destructive />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PeoplePanel;