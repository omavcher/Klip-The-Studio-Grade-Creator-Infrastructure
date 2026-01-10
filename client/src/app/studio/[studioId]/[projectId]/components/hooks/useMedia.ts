'use client';

import { useRef, useCallback } from 'react';

export const useMedia = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const initializeMedia = useCallback(async (settings: any, audioSettings: any) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
          deviceId: settings.selectedVideoDevice ? { exact: settings.selectedVideoDevice } : undefined,
        },
        audio: {
          echoCancellation: audioSettings.isEchoCancellation,
          noiseSuppression: audioSettings.isNoiseReduction,
          autoGainControl: audioSettings.isAutoGain,
          deviceId: settings.selectedAudioDevice ? { exact: settings.selectedAudioDevice } : undefined,
        },
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }

      return stream;
    } catch (error) {
      console.error('Error initializing media:', error);
      throw error;
    }
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
      return false;
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        screenStreamRef.current = screenStream;
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
        
        return true;
      } catch (error) {
        console.error('Screen sharing failed:', error);
        throw error;
      }
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const newState = !videoTrack.enabled;
        videoTrack.enabled = newState;
        return newState;
      }
    }
    return false;
  }, []);

  const toggleMicrophone = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        const newState = !audioTrack.enabled;
        audioTrack.enabled = newState;
        return newState;
      }
    }
    return false;
  }, []);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
  }, []);

  return {
    videoRef,
    screenShareRef,
    streamRef,
    screenStreamRef,
    initializeMedia,
    toggleScreenShare,
    toggleCamera,
    toggleMicrophone,
    cleanup,
  };
};