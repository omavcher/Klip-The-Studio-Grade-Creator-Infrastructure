'use client';

import React from 'react';
import { Mic, MicOff, Share, Volume2 } from 'lucide-react';
import { Participant } from '../../types';
import { ParticipantStatus } from '../StatusIndicators';

interface ParticipantVideoProps {
  participant: Participant;
  layoutMode: 'grid' | 'speaker' | 'cinema';
  showAudioLevel?: boolean;
  onClick?: (participantId: string) => void;
}

export const ParticipantVideo: React.FC<ParticipantVideoProps> = ({
  participant,
  layoutMode,
  showAudioLevel = true,
  onClick,
}) => {
  const getContainerClasses = () => {
    const baseClasses = 'relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-black group transition-all duration-200 hover:border-blue-500/30';
    
    switch (layoutMode) {
      case 'speaker':
        return `${baseClasses} h-32`;
      case 'cinema':
        return `${baseClasses} h-48`;
      case 'grid':
      default:
        return `${baseClasses} h-48`;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(participant.id);
    }
  };

  return (
    <div 
      className={getContainerClasses()}
      onClick={handleClick}
    >
      {/* Video/Avatar Background */}
      {participant.isVideoOn ? (
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${participant.avatarColor}`}>
          <span className="text-xl font-bold">{participant.name.charAt(0)}</span>
        </div>
      )}
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Bottom Info Bar */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 transition-all group-hover:bg-black/80">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-medium truncate">{participant.name}</span>
            {participant.isHost && (
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                Host
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {participant.isSpeaking && (
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            )}
            {participant.isAudioOn ? (
              <Mic size={12} className={participant.isSpeaking ? 'text-green-400' : 'text-zinc-400'} />
            ) : (
              <MicOff size={12} className="text-red-400" />
            )}
            {participant.isScreenSharing && (
              <Share size={12} className="text-green-400" />
            )}
          </div>
        </div>
        
        {/* Status and Audio Level */}
        <div className="flex items-center justify-between mt-1">
          <ParticipantStatus
            connectionQuality={participant.connectionStatus}
            showDetails={false}
            size="sm"
            className="flex-1"
          />
          
          {showAudioLevel && participant.isAudioOn && participant.audioLevel > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-8 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-150"
                  style={{ width: `${participant.audioLevel}%` }}
                />
              </div>
              {participant.isSpeaking && (
                <Volume2 size={10} className="text-green-400" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Top Corner Indicators */}
      <div className="absolute top-2 left-2 flex items-center gap-1">
        {!participant.isAudioOn && (
          <div className="w-2 h-2 rounded-full bg-red-500" title="Microphone off" />
        )}
        {!participant.isVideoOn && (
          <div className="w-2 h-2 rounded-full bg-red-500" title="Camera off" />
        )}
        {participant.isScreenSharing && (
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Screen sharing" />
        )}
      </div>

      {/* Connection Quality Indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-2 h-2 rounded-full ${
          participant.connectionStatus === 'excellent' ? 'bg-green-500' :
          participant.connectionStatus === 'good' ? 'bg-yellow-500' : 'bg-red-500'
        }`} title={`Connection: ${participant.connectionStatus}`} />
      </div>

      {/* Interactive Actions (on hover) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button 
          className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition-colors"
          title="Pin participant"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Pin participant:', participant.id);
          }}
        >
          📌
        </button>
        <button 
          className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition-colors"
          title="Focus view"
          onClick={(e) => {
            e.stopPropagation();
            console.log('Focus on participant:', participant.id);
          }}
        >
          🔍
        </button>
      </div>
    </div>
  );
};

// Optimized version for large participant lists
export const CompactParticipantVideo: React.FC<Omit<ParticipantVideoProps, 'layoutMode'>> = ({
  participant,
  showAudioLevel = false,
  onClick,
}) => {
  return (
    <div 
      className="relative rounded-lg overflow-hidden border border-white/5 bg-gradient-to-br from-zinc-900 to-black group h-24 hover:border-blue-500/30 transition-colors cursor-pointer"
      onClick={() => onClick?.(participant.id)}
    >
      {participant.isVideoOn ? (
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${participant.avatarColor}`}>
          <span className="text-lg font-bold">{participant.name.charAt(0)}</span>
        </div>
      )}
      
      <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm rounded p-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-medium truncate">{participant.name}</span>
          <div className="flex items-center gap-0.5">
            {participant.isAudioOn ? (
              <Mic size={10} className={participant.isSpeaking ? 'text-green-400' : 'text-zinc-400'} />
            ) : (
              <MicOff size={10} className="text-red-400" />
            )}
            <div className={`w-1.5 h-1.5 rounded-full ${
              participant.connectionStatus === 'excellent' ? 'bg-green-500' :
              participant.connectionStatus === 'good' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loading state
export const ParticipantVideoSkeleton: React.FC<{
  layoutMode?: 'grid' | 'speaker' | 'cinema';
}> = ({ layoutMode = 'grid' }) => {
  const getHeight = () => {
    switch (layoutMode) {
      case 'speaker': return 'h-32';
      case 'cinema': return 'h-48';
      default: return 'h-48';
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-black animate-pulse ${getHeight()}`}>
      <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-2">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-zinc-700 rounded w-24" />
          <div className="h-3 w-3 bg-zinc-700 rounded" />
        </div>
        <div className="h-2 bg-zinc-700 rounded w-16 mt-1" />
      </div>
    </div>
  );
};