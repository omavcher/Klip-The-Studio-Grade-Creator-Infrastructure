'use client';

import React from 'react';
import { Circle, Radio, Clock, Users, Zap } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  isStreaming: boolean;
  onToggleRecording: () => void;
  onToggleStreaming: () => void;
  recordingTime?: number;
  streamViewers?: number;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isStreaming,
  onToggleRecording,
  onToggleStreaming,
  recordingTime = 0,
  streamViewers = 0,
}) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-1">
      {/* Recording Control */}
      <div className="relative group">
        <button 
          onClick={onToggleRecording}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all relative ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          <Circle 
            size={16} 
            fill={isRecording ? "currentColor" : "none"} 
            className={isRecording ? 'animate-pulse' : ''} 
          />
          <span className="text-xs font-medium">{isRecording ? 'Stop' : 'Record'}</span>
          
          {/* Recording time display */}
          {isRecording && recordingTime > 0 && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
              <Clock size={10} className="inline mr-1" />
              {formatTime(recordingTime)}
            </div>
          )}
        </button>
      </div>

      {/* Streaming Control */}
      <div className="relative group">
        <button 
          onClick={onToggleStreaming}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all relative ${
            isStreaming 
              ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
          title={isStreaming ? "Stop live stream" : "Go live"}
        >
          <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-white animate-pulse' : 'bg-current'}`} />
          <span className="text-xs font-medium">{isStreaming ? 'Stop Live' : 'Go Live'}</span>
          
          {/* Viewer count display */}
          {isStreaming && streamViewers > 0 && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap flex items-center gap-1">
              <Users size={10} />
              {streamViewers} viewers
            </div>
          )}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-1 ml-1">
        <button 
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          title="Quick recording"
        >
          <Zap size={16} />
        </button>
        <button 
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          title="Audio only mode"
        >
          <Radio size={16} />
        </button>
      </div>
    </div>
  );
};