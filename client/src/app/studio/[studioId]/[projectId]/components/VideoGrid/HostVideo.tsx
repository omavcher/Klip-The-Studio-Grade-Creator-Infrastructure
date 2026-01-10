'use client';

import React from 'react';
import { Share, Hand, Mic, VideoOff } from 'lucide-react';
import { Participant } from '../../types';

interface HostVideoProps {
  host: Participant;
  videoBrightness: number;
  videoContrast: number;
  audioLevel: number;
  connectionQuality: 'excellent' | 'good' | 'poor';
  isScreenSharing: boolean;
  isRaisedHand: boolean;
  layoutMode: 'grid' | 'speaker' | 'cinema';
  videoRef?: React.RefObject<HTMLVideoElement>;
  screenShareRef?: React.RefObject<HTMLVideoElement>;
}

export const HostVideo: React.FC<HostVideoProps> = ({
  host,
  videoBrightness,
  videoContrast,
  audioLevel,
  connectionQuality,
  isScreenSharing,
  isRaisedHand,
  layoutMode,
  videoRef,
  screenShareRef,
}) => {


  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-zinc-900 to-black group shadow-2xl ${
      layoutMode === 'speaker' ? 'h-2/3' : 'h-full'
    }`}>
      {/* Video Element */}
      <div className="w-full h-full bg-black relative">
        {isScreenSharing ? (
          <video 
            ref={screenShareRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : host.isVideoOn ? (
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              filter: `brightness(${videoBrightness + 50}%) contrast(${videoContrast + 50}%)`,
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${host.avatarColor}`}>
            <span className="text-3xl font-bold">{host.name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      {/* Overlay Info */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              connectionQuality === 'excellent' ? 'bg-green-500 animate-pulse' :
              connectionQuality === 'good' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-xs font-medium capitalize">{connectionQuality}</span>
          </div>
          {isScreenSharing && (
            <div className="flex items-center gap-1 text-green-400">
              <Share size={12} />
              <span className="text-xs">Screen Sharing</span>
            </div>
          )}
        </div>
        
        {/* Audio Level */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="w-24 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-100"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
          <Mic size={14} className={host.isAudioOn ? 'text-green-400' : 'text-red-400'} />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{host.name}</span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Host</span>
          {isRaisedHand && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Hand size={10} /> Hand Raised
            </span>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {!host.isVideoOn && !isScreenSharing && (
          <div className="px-2 py-1 bg-red-500/20 rounded text-xs font-medium text-red-400 flex items-center gap-1">
            <VideoOff size={12} />
            Camera Off
          </div>
        )}
        {!host.isAudioOn && (
          <div className="px-2 py-1 bg-red-500/20 rounded text-xs font-medium text-red-400">
            Mic Off
          </div>
        )}
      </div>
    </div>
  );
};