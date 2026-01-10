'use client';

import React from 'react';

interface StatusIndicatorsProps {
  connectionQuality: 'excellent' | 'good' | 'poor';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  connectionQuality,
  showLabel = true,
  size = 'sm',
  className = '',
}) => {
  const getStatusColor = () => {
    switch (connectionQuality) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-zinc-500';
    }
  };

  const getStatusLabel = () => {
    switch (connectionQuality) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'poor':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  const getIndicatorSize = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-3 h-3';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-2 h-2';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px]';
      case 'md':
        return 'text-xs';
      case 'lg':
        return 'text-sm';
      default:
        return 'text-[10px]';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <div 
          className={`${getIndicatorSize()} rounded-full ${getStatusColor()} ${
            connectionQuality === 'excellent' ? 'animate-pulse' : ''
          }`}
        />
        {showLabel && (
          <span className={`${getTextSize()} font-medium capitalize`}>
            {getStatusLabel()} Connection
          </span>
        )}
      </div>
    </div>
  );
};

// Extended component for participant status display
interface ParticipantStatusProps extends StatusIndicatorsProps {
  audioLevel?: number;
  isSpeaking?: boolean;
  isAudioOn?: boolean;
  isVideoOn?: boolean;
  isScreenSharing?: boolean;
  showDetails?: boolean;
}

export const ParticipantStatus: React.FC<ParticipantStatusProps> = ({
  connectionQuality,
  audioLevel = 0,
  isSpeaking = false,
  isAudioOn = true,
  isVideoOn = true,
  isScreenSharing = false,
  showDetails = true,
  size = 'sm',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <StatusIndicators 
        connectionQuality={connectionQuality} 
        showLabel={false}
        size={size}
      />
      
      {showDetails && (
        <>
          {/* Audio level indicator */}
          {isAudioOn && audioLevel > 0 && (
            <div className="flex items-center gap-1">
              <div className={`${size === 'sm' ? 'w-8 h-1' : 'w-12 h-1.5'} bg-zinc-800 rounded-full overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-150"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
              {isSpeaking && (
                <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-green-500 animate-pulse`} />
              )}
            </div>
          )}

          {/* Status icons */}
          <div className="flex items-center gap-1">
            {!isAudioOn && (
              <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-red-500`} />
            )}
            {!isVideoOn && (
              <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-red-500`} />
            )}
            {isScreenSharing && (
              <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-green-500`} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Compact status badge for small spaces
export const StatusBadge: React.FC<StatusIndicatorsProps> = ({
  connectionQuality,
  size = 'sm',
  className = '',
}) => {
  const getStatusColor = () => {
    switch (connectionQuality) {
      case 'excellent':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'poor':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getStatusLabel = () => {
    switch (connectionQuality) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'poor':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return 'px-1.5 py-0.5';
      case 'md':
        return 'px-2 py-1';
      case 'lg':
        return 'px-3 py-1.5';
      default:
        return 'px-1.5 py-0.5';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px]';
      case 'md':
        return 'text-xs';
      case 'lg':
        return 'text-sm';
      default:
        return 'text-[10px]';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${getPadding()} ${getStatusColor()} border rounded-full ${getTextSize()} font-medium ${className}`}>
      <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full ${connectionQuality === 'excellent' ? 'bg-green-400 animate-pulse' : connectionQuality === 'good' ? 'bg-yellow-400' : 'bg-red-400'}`} />
      <span className="capitalize">{getStatusLabel()}</span>
    </div>
  );
};

// Connection quality meter
export const ConnectionMeter: React.FC<{
  quality: 'excellent' | 'good' | 'poor';
  showLabels?: boolean;
}> = ({ quality, showLabels = true }) => {
  const getQualityScore = () => {
    switch (quality) {
      case 'excellent': return 3;
      case 'good': return 2;
      case 'poor': return 1;
      default: return 0;
    }
  };

  const qualityScore = getQualityScore();

  return (
    <div className="flex flex-col gap-1">
      {showLabels && (
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Poor</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-2 rounded-full transition-all duration-300 ${
              level <= qualityScore
                ? quality === 'excellent'
                  ? 'bg-green-500 w-4'
                  : quality === 'good'
                  ? 'bg-yellow-500 w-3'
                  : 'bg-red-500 w-2'
                : 'bg-zinc-800 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusIndicators;