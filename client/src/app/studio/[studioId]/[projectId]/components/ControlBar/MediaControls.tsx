'use client';

import React from 'react';
import { Mic, MicOff, Video, VideoOff, Share, Volume2 } from 'lucide-react';

interface MediaControlsProps {
  settings: {
    isMicOn: boolean;
    isCamOn: boolean;
  };
  onToggleMicrophone: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  showAudioLevel?: boolean;
  audioLevel?: number;
  isScreenSharing?: boolean;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  settings,
  onToggleMicrophone,
  onToggleCamera,
  onToggleScreenShare,
  showAudioLevel = false,
  audioLevel = 0,
  isScreenSharing = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {/* Microphone Control */}
      <button 
        onClick={onToggleMicrophone}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all relative ${
          settings.isMicOn 
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
        }`}
        title={settings.isMicOn ? "Mute microphone" : "Unmute microphone"}
      >
        {settings.isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        <span className="text-[10px] font-medium">Mic</span>
        
        {/* Audio level indicator on button */}
        {showAudioLevel && settings.isMicOn && (
          <div className="absolute -top-1 -right-1 w-2 h-2">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              <div className="relative w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </div>
        )}
      </button>

      {/* Camera Control */}
      <button 
        onClick={onToggleCamera}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
          settings.isCamOn 
            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
        }`}
        title={settings.isCamOn ? "Turn off camera" : "Turn on camera"}
      >
        {settings.isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
        <span className="text-[10px] font-medium">Camera</span>
      </button>

      {/* Screen Share Control */}
      <button 
        onClick={onToggleScreenShare}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all relative ${
          isScreenSharing 
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
        }`}
        title={isScreenSharing ? "Stop sharing" : "Share screen"}
      >
        <Share size={20} />
        <span className="text-[10px] font-medium">Share</span>
        
        {/* Sharing indicator */}
        {isScreenSharing && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Audio level display */}
      {showAudioLevel && settings.isMicOn && (
        <div className="flex items-center gap-2 px-3 py-2">
          <Volume2 size={16} className="text-green-400" />
          <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-100"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};