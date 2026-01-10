'use client';

import React, { useMemo, RefObject } from 'react';
import { HostVideo } from './HostVideo';
import { ParticipantVideo, CompactParticipantVideo, ParticipantVideoSkeleton } from './ParticipantVideo';
import { Participant } from '../../types';

interface VideoGridProps {
  layoutMode: 'grid' | 'speaker' | 'cinema';
  participants: Participant[];
  host: Participant;
  videoBrightness: number;
  videoContrast: number;
  audioLevel: number;
  connectionQuality: 'excellent' | 'good' | 'poor';
  isScreenSharing: boolean;
  isRaisedHand: boolean;
  isLoading?: boolean;
  onParticipantClick?: (participantId: string) => void;
  showCompact?: boolean;
  videoRef?: RefObject<HTMLVideoElement>;
  screenShareRef?: RefObject<HTMLVideoElement>;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  layoutMode,
  participants,
  host,
  videoBrightness,
  videoContrast,
  audioLevel,
  connectionQuality,
  isScreenSharing,
  isRaisedHand,
  isLoading = false,
  onParticipantClick,
  showCompact = false,
  videoRef,
  screenShareRef,
}) => {
  const otherParticipants = useMemo(() => 
    participants.filter(p => !p.isHost), 
    [participants]
  );

  const getGridConfig = () => {
    switch (layoutMode) {
      case 'speaker':
        return {
          containerClass: 'flex flex-col h-full gap-3',
          hostClass: 'flex-1',
          participantsClass: 'grid grid-cols-3 gap-3 flex-shrink-0',
          showCompact: true,
        };
      case 'cinema':
        return {
          containerClass: 'grid grid-cols-3 gap-4 h-full',
          hostClass: 'col-span-2 row-span-2',
          participantsClass: 'space-y-4',
          showCompact: false,
        };
      case 'grid':
      default:
        return {
          containerClass: 'grid grid-cols-2 gap-4',
          hostClass: 'col-span-2',
          participantsClass: 'grid grid-cols-2 gap-4',
          showCompact: false,
        };
    }
  };

  const gridConfig = getGridConfig();

  if (isLoading) {
    return (
      <div className="w-full h-full max-w-7xl gap-4 grid grid-cols-2">
        <ParticipantVideoSkeleton layoutMode={layoutMode} />
        <ParticipantVideoSkeleton layoutMode={layoutMode} />
        <ParticipantVideoSkeleton layoutMode={layoutMode} />
        <ParticipantVideoSkeleton layoutMode={layoutMode} />
      </div>
    );
  }

  const ParticipantComponent = showCompact || gridConfig.showCompact 
    ? CompactParticipantVideo 
    : ParticipantVideo;

  return (
    <div className={`w-full h-full max-w-7xl ${gridConfig.containerClass}`}>
      {/* Host Video (Always prominent) */}
      <div className={gridConfig.hostClass}>
        <HostVideo
          host={host}
          videoBrightness={videoBrightness}
          videoContrast={videoContrast}
          audioLevel={audioLevel}
          connectionQuality={connectionQuality}
          isScreenSharing={isScreenSharing}
          isRaisedHand={isRaisedHand}
          layoutMode={layoutMode}
          videoRef={videoRef}
          screenShareRef={screenShareRef}
        />
      </div>
      
      {/* Other Participants */}
      <div className={gridConfig.participantsClass}>
        {otherParticipants.map((participant) => (
          <ParticipantComponent
            key={participant.id}
            participant={participant}
            layoutMode={layoutMode}
            onClick={onParticipantClick}
            showAudioLevel={!showCompact}
          />
        ))}
        
        {/* Empty slots for grid layout */}
        {layoutMode === 'grid' && otherParticipants.length < 3 && (
          Array.from({ length: 3 - otherParticipants.length }).map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="relative rounded-xl border-2 border-dashed border-white/5 bg-gradient-to-br from-zinc-900/30 to-black/30 flex items-center justify-center h-48"
            >
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">+</span>
                </div>
                <p className="text-sm text-zinc-500">Waiting for participants</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Utility component for empty state
export const EmptyVideoGrid: React.FC<{
  message?: string;
  subMessage?: string;
}> = ({ 
  message = "Waiting for participants to join", 
  subMessage = "Invite people or share the link to start"
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📹</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{message}</h3>
        <p className="text-zinc-400">{subMessage}</p>
      </div>
    </div>
  );
};