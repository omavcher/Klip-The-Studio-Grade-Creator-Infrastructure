'use client';

import React from 'react';
import { Settings, Minimize2, Maximize2, Camera, Wifi, Battery } from 'lucide-react';
import { StatusIndicators } from '../StatusIndicators';

interface TopBarProps {
  studioTitle: string;
  connectionQuality: 'excellent' | 'good' | 'poor';
  isRecording: boolean;
  isStreaming: boolean;
  recordingTime: number;
  streamViewers: number;
  isFullscreen: boolean;
  profileImg: string | null;
  displayName: string;
  onToggleFullscreen: () => void;
  onOpenSettings: () => void;
  onCaptureProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  studioTitle,
  connectionQuality,
  isRecording,
  isStreaming,
  recordingTime,
  streamViewers,
  isFullscreen,
  profileImg,
  displayName,
  onToggleFullscreen,
  onOpenSettings,
  onCaptureProfile,
}) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-black italic shadow-lg shadow-blue-500/20">
          KS
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-400">{studioTitle}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
            <StatusIndicators connectionQuality={connectionQuality} />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isRecording && (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Recording</span>
            <span className="text-[10px] text-red-300">● {formatTime(recordingTime)}</span>
          </div>
        )}
        
        {isStreaming && (
          <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Live</span>
            <span className="text-[10px] text-purple-300">{streamViewers} viewers</span>
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-lg">
          <Wifi size={14} className="text-green-400" />
          <span className="text-[10px] font-medium">5G</span>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <Battery size={14} className="text-green-400" />
          <span className="text-[10px] font-medium">87%</span>
        </div>

        <button 
          onClick={onOpenSettings}
          className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings size={18}/>
        </button>
        
        <button 
          onClick={onToggleFullscreen}
          className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        
        {/* Profile */}
        <div 
          className="relative group cursor-pointer"
          onClick={onCaptureProfile}
          title="Capture profile picture"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-blue-400/50 overflow-hidden relative shadow-lg shadow-blue-500/20">
            {profileImg ? (
              <img src={profileImg} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-sm font-bold">{displayName.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={16} className="text-white"/>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
        </div>
      </div>
    </header>
  );
};