'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Hand, Layout, Radio, Globe, Bell, Zap, Sparkles } from 'lucide-react';
import { REACTIONS } from '../../types';

interface ActionButtonsProps {
  isRaisedHand: boolean;
  layoutMode: 'grid' | 'speaker' | 'cinema';
  isReactionsOpen: boolean;
  onToggleRaiseHand: () => void;
  onToggleReactions: () => void;
  onChangeLayout: (mode: 'grid' | 'speaker' | 'cinema') => void;
  onSendReaction?: (emoji: string, label: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isRaisedHand,
  layoutMode,
  isReactionsOpen,
  onToggleRaiseHand,
  onToggleReactions,
  onChangeLayout,
  onSendReaction,
}) => {
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const [showEffectsMenu, setShowEffectsMenu] = useState(false);

  const handleReactionClick = (reaction: typeof REACTIONS[0]) => {
    if (onSendReaction) {
      onSendReaction(reaction.emoji, reaction.label);
    }
    onToggleReactions();
  };

  const layoutOptions = [
    { id: 'grid', label: 'Grid View', description: 'Equal size for all participants' },
    { id: 'speaker', label: 'Speaker View', description: 'Focus on active speaker' },
    { id: 'cinema', label: 'Cinema View', description: 'Large focus video with gallery' },
  ];

  const effects = [
    { id: 'none', label: 'No Effect', icon: <Radio size={16} /> },
    { id: 'blur', label: 'Blur Background', icon: <Globe size={16} /> },
    { id: 'studio', label: 'Studio Lighting', icon: <Sparkles size={16} /> },
    { id: 'vintage', label: 'Vintage Film', icon: <Bell size={16} /> },
    { id: 'energy', label: 'Energy Boost', icon: <Zap size={16} /> },
  ];

  return (
    <div className="flex items-center gap-1">
      {/* Reactions Button */}
      <div className="relative group">
        <button 
          onClick={onToggleReactions}
          className="flex flex-col items-center gap-1 px-3 py-2 text-zinc-400 hover:text-white transition-colors relative"
          title="Send reaction"
        >
          <Smile size={20} />
          <span className="text-[10px] font-medium">React</span>
          
          {/* Reactions Popup */}
          <AnimatePresence>
            {isReactionsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl z-50 min-w-[180px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid grid-cols-3 gap-2">
                  {REACTIONS.map(reaction => (
                    <button
                      key={reaction.id}
                      onClick={() => handleReactionClick(reaction)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors text-2xl flex flex-col items-center gap-1"
                      title={reaction.label}
                    >
                      {reaction.emoji}
                      <span className="text-[8px] text-zinc-400">{reaction.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-white/5">
                  <button className="w-full text-xs text-zinc-400 hover:text-white py-1.5 hover:bg-white/5 rounded-lg transition-colors">
                    + Custom Reaction
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Raise Hand Button */}
      <button 
        onClick={onToggleRaiseHand}
        className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
          isRaisedHand 
            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        }`}
        title={isRaisedHand ? "Lower hand" : "Raise hand"}
      >
        <Hand size={20} />
        <span className="text-[10px] font-medium">Hand</span>
      </button>

      {/* Layout Button */}
      <div className="relative group">
        <button 
          onMouseEnter={() => setShowLayoutMenu(true)}
          onMouseLeave={() => setShowLayoutMenu(false)}
          className="flex flex-col items-center gap-1 px-3 py-2 text-zinc-400 hover:text-white transition-colors"
          title="Change layout"
        >
          <Layout size={20} />
          <span className="text-[10px] font-medium">Layout</span>
        </button>
        
        {/* Layout Menu */}
        <div 
          className={`absolute bottom-full mb-2 right-0 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 min-w-[200px] ${
            showLayoutMenu ? 'block' : 'hidden'
          }`}
          onMouseEnter={() => setShowLayoutMenu(true)}
          onMouseLeave={() => setShowLayoutMenu(false)}
        >
          <div className="space-y-1">
            {layoutOptions.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  onChangeLayout(option.id as 'grid' | 'speaker' | 'cinema');
                  setShowLayoutMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  layoutMode === option.id
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'hover:bg-white/5 text-zinc-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-zinc-500">{option.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Effects Button (Optional) */}
      <div className="relative group">
        <button 
          onMouseEnter={() => setShowEffectsMenu(true)}
          onMouseLeave={() => setShowEffectsMenu(false)}
          className="flex flex-col items-center gap-1 px-3 py-2 text-zinc-400 hover:text-white transition-colors"
          title="Video effects"
        >
          <Sparkles size={20} />
          <span className="text-[10px] font-medium">Effects</span>
        </button>
        
        {/* Effects Menu */}
        <div 
          className={`absolute bottom-full mb-2 left-0 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 min-w-[180px] ${
            showEffectsMenu ? 'block' : 'hidden'
          }`}
          onMouseEnter={() => setShowEffectsMenu(true)}
          onMouseLeave={() => setShowEffectsMenu(false)}
        >
          <div className="space-y-1">
            {effects.map(effect => (
              <button
                key={effect.id}
                onClick={() => setShowEffectsMenu(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-zinc-300 flex items-center gap-2"
              >
                {effect.icon}
                <span>{effect.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};