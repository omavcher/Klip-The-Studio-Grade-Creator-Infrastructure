'use client';

import React from 'react';
import { MediaControls } from './MediaControls';
import { RecordingControls } from './RecordingControls';
import { ActionButtons } from './ActionButtons';
import { LogOut } from 'lucide-react';

interface ControlBarProps {
  isRecording: boolean;
  isStreaming: boolean;
  audioLevel: number;
  isRaisedHand: boolean;
  layoutMode: 'grid' | 'speaker' | 'cinema';
  isReactionsOpen: boolean;
  isFullscreen: boolean;
  onToggleRecording: () => void;
  onToggleStreaming: () => void;
  onToggleMicrophone: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleRaiseHand: () => void;
  onToggleReactions: () => void;
  onChangeLayout: (mode: 'grid' | 'speaker' | 'cinema') => void;
  onToggleFullscreen: () => void;
  onLeaveStudio: () => void;
  settings: {
    isMicOn: boolean;
    isCamOn: boolean;
  };
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isRecording,
  isStreaming,
  audioLevel,
  isRaisedHand,
  layoutMode,
  isReactionsOpen,
  isFullscreen,
  onToggleRecording,
  onToggleStreaming,
  onToggleMicrophone,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRaiseHand,
  onToggleReactions,
  onChangeLayout,
  onToggleFullscreen,
  onLeaveStudio,
  settings,
}) => {
  return (
    <footer className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl">
          
          <RecordingControls
            isRecording={isRecording}
            isStreaming={isStreaming}
            onToggleRecording={onToggleRecording}
            onToggleStreaming={onToggleStreaming}
          />

          <div className="h-8 w-px bg-white/10 mx-1" />

          <MediaControls
            settings={settings}
            onToggleMicrophone={onToggleMicrophone}
            onToggleCamera={onToggleCamera}
            onToggleScreenShare={onToggleScreenShare}
            showAudioLevel={true}
            audioLevel={audioLevel}
          />

          <div className="h-8 w-px bg-white/10 mx-1" />

          <ActionButtons
            isRaisedHand={isRaisedHand}
            layoutMode={layoutMode}
            isReactionsOpen={isReactionsOpen}
            isFullscreen={isFullscreen}
            onToggleRaiseHand={onToggleRaiseHand}
            onToggleReactions={onToggleReactions}
            onChangeLayout={onChangeLayout}
            onToggleFullscreen={onToggleFullscreen}
          />

          <div className="h-8 w-px bg-white/10 mx-1" />

          {/* Leave Button */}
          <button 
            onClick={onLeaveStudio}
            className="flex flex-col items-center gap-1 px-3 py-2 text-red-400 hover:text-red-500 transition-colors"
            title="Leave studio"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-medium">Leave</span>
          </button>
        </div>
      </div>
    </footer>
  );
};