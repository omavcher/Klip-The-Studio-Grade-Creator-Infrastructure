'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { use } from 'react';
import { TopBar } from './components/TopBar';
import { VideoGrid } from './components/VideoGrid';
import { Sidebar } from './components/Sidebar';
import { ControlBar } from './components/ControlBar';
import { InviteModal } from './components/Modals/InviteModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { useStudioState } from './components/hooks/useStudioState';
import { useAudioAnalysis } from './components/hooks/useAudioAnalysis';
import { useRecording } from './components/hooks/useRecording';
import { Participant, ChatMessage } from './types';

const initialSettings = {
  displayName: 'Om Awchar',
  headphoneStatus: 'none' as const,
  selectedEffect: 'none',
  selectedVideoDevice: '',
  selectedAudioDevice: '',
  selectedAudioOutputDevice: '',
  isCamOn: true,
  isMicOn: true,
  studioTitle: 'Untitled Studio',
  recordingQuality: '1080p' as const,
  storageType: 'both' as const,
  language: 'en',
};

export default function RecordingStudio({ params }: { params: Promise<{ studioId: string; projectId: string }> }) {
  const resolvedParams = use(params);
  
  // Refs for video elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use custom hooks
  const studioState = useStudioState(initialSettings);
  const { initializeAudioAnalysis, cleanupAudio } = useAudioAnalysis(studioState.setAudioLevel);
  const { startRecording, stopRecording } = useRecording(
    studioState.isRecording,
    studioState.setIsRecording,
    studioState.setRecordingTime,
    studioState.addSystemMessage,
    studioState.setRecordings,
    studioState.recordings,
    studioState.recordingTime
  );

  // Initialize camera when component mounts
  useEffect(() => {
    const initCamera = async () => {
      try {
        if (!studioState.settings.isCamOn) return;
        
        console.log('Initializing camera...');
        
        // Get available devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available video devices:', videoDevices);
        
        // Request camera access
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
            frameRate: { ideal: 30 }
          },
          audio: false // We'll handle audio separately
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Camera stream obtained:', stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => {
              console.error('Video play failed:', e);
            });
          };
        }

        // Initialize audio if mic is on
        if (studioState.settings.isMicOn) {
          const audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
          
          // Merge audio with video stream if needed
          if (stream && audioStream) {
            const combinedStream = new MediaStream([
              ...stream.getVideoTracks(),
              ...audioStream.getAudioTracks()
            ]);
            
            if (videoRef.current) {
              videoRef.current.srcObject = combinedStream;
            }
            
            initializeAudioAnalysis(combinedStream);
          }
        }

        console.log('Camera initialization complete');
        
      } catch (error) {
        console.error('Error initializing camera:', error);
        studioState.addSystemMessage('Could not access camera. Please check permissions.');
        
        // Update UI to show camera is off
        studioState.updateSettings({ isCamOn: false });
        studioState.setParticipants(prev => prev.map(p => 
          p.id === '1' ? { ...p, isVideoOn: false } : p
        ));
      }
    };

    initCamera();

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      cleanupAudio();
    };
  }, []);

  // Handle camera toggle
  const handleToggleCamera = async () => {
    if (studioState.settings.isCamOn) {
      // Turn camera OFF
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getVideoTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      studioState.updateSettings({ isCamOn: false });
      studioState.setParticipants(prev => prev.map(p => 
        p.id === '1' ? { ...p, isVideoOn: false } : p
      ));
    } else {
      // Turn camera ON
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.play();
        }
        
        studioState.updateSettings({ isCamOn: true });
        studioState.setParticipants(prev => prev.map(p => 
          p.id === '1' ? { ...p, isVideoOn: true } : p
        ));
      } catch (error) {
        console.error('Failed to turn on camera:', error);
        studioState.addSystemMessage('Could not access camera');
      }
    }
  };

  // Handle microphone toggle
  const handleToggleMicrophone = async () => {
    if (studioState.settings.isMicOn) {
      // Turn mic OFF
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getAudioTracks().forEach(track => track.stop());
      }
      
      studioState.updateSettings({ isMicOn: false });
      studioState.setParticipants(prev => prev.map(p => 
        p.id === '1' ? { ...p, isAudioOn: false } : p
      ));
    } else {
      // Turn mic ON
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        // If video is on, merge streams
        if (videoRef.current?.srcObject) {
          const videoStream = videoRef.current.srcObject as MediaStream;
          const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ]);
          
          videoRef.current.srcObject = combinedStream;
          initializeAudioAnalysis(combinedStream);
        } else {
          // If only audio, create new stream
          videoRef.current!.srcObject = audioStream;
          initializeAudioAnalysis(audioStream);
        }
        
        studioState.updateSettings({ isMicOn: true });
        studioState.setParticipants(prev => prev.map(p => 
          p.id === '1' ? { ...p, isAudioOn: true } : p
        ));
      } catch (error) {
        console.error('Failed to turn on microphone:', error);
        studioState.addSystemMessage('Could not access microphone');
      }
    }
  };

  // Handle screen sharing
  const handleToggleScreenShare = async () => {
    if (studioState.isScreenSharing) {
      // Stop screen sharing
      if (screenShareRef.current?.srcObject) {
        const stream = screenShareRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        screenShareRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        studioState.setParticipants(prev => prev.map(p => 
          p.id === '1' ? { ...p, isScreenSharing: true } : p
        ));
        
        // Handle when user stops sharing via browser controls
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          studioState.setParticipants(prev => prev.map(p => 
            p.id === '1' ? { ...p, isScreenSharing: false } : p
          ));
        };
      } catch (error) {
        console.error('Screen sharing failed:', error);
      }
    }
  };

  // Handle recording toggle
  const handleToggleRecording = () => {
    if (studioState.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen();
      studioState.setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      studioState.setIsFullscreen(false);
    }
  };

  // Handle chat message sending
  const handleSendMessage = () => {
    if (!studioState.newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      senderId: '1',
      message: studioState.newMessage.trim(),
      timestamp: new Date(),
      isSystem: false,
      reactions: [],
    };

    studioState.setChatMessages(prev => [...prev, message]);
    studioState.setNewMessage('');
  };

  // Handle reaction adding
  const handleAddReaction = (messageId: string, emoji: string) => {
    studioState.setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (!existingReaction.users.includes('1')) {
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, users: [...r.users, '1'] }
                  : r
              ),
            };
          }
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, users: ['1'] }],
          };
        }
      }
      return msg;
    }));
  };

  // Handle profile picture capture
  const handleCaptureProfile = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const data = canvasRef.current.toDataURL('image/png');
      studioState.setProfileImg(data);
      studioState.addSystemMessage('Profile picture updated');
    }
  };

  // Get host participant
  const host = studioState.participants.find(p => p.isHost) || studioState.participants[0];

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col overflow-hidden font-sans">
      <TopBar
        studioTitle={studioState.settings.studioTitle}
        connectionQuality={studioState.connectionQuality}
        isRecording={studioState.isRecording}
        isStreaming={studioState.isStreaming}
        recordingTime={studioState.recordingTime}
        streamViewers={studioState.streamViewers}
        isFullscreen={studioState.isFullscreen}
        profileImg={studioState.profileImg}
        displayName={studioState.settings.displayName}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenSettings={() => studioState.setIsSettingsOpen(true)}
        onCaptureProfile={handleCaptureProfile}
      />

      <div ref={mainContainerRef} className="flex-1 flex overflow-hidden">
        <main className="flex-1 p-6 flex items-center justify-center">
          <VideoGrid
            layoutMode={studioState.layoutMode}
            participants={studioState.participants}
            host={host}
            videoBrightness={studioState.videoBrightness}
            videoContrast={studioState.videoContrast}
            audioLevel={studioState.audioLevel}
            connectionQuality={studioState.connectionQuality}
            isScreenSharing={studioState.isScreenSharing}
            isRaisedHand={studioState.isRaisedHand}
            videoRef={videoRef}
            screenShareRef={screenShareRef}
          />
        </main>

        <Sidebar
          activePanel={studioState.activePanel}
          setActivePanel={studioState.setActivePanel}
          participants={studioState.participants}
          chatMessages={studioState.chatMessages}
          newMessage={studioState.newMessage}
          setNewMessage={studioState.setNewMessage}
          recordings={studioState.recordings}
          settings={studioState.settings}
          updateSettings={studioState.updateSettings}
          onAddReaction={handleAddReaction}
          onSendMessage={handleSendMessage}
          onInviteClick={() => studioState.setIsInviteOpen(true)}
        />
      </div>

      <ControlBar
        isRecording={studioState.isRecording}
        isStreaming={studioState.isStreaming}
        audioLevel={studioState.audioLevel}
        isRaisedHand={studioState.isRaisedHand}
        layoutMode={studioState.layoutMode}
        isReactionsOpen={studioState.isReactionsOpen}
        isFullscreen={studioState.isFullscreen}
        onToggleRecording={handleToggleRecording}
        onToggleStreaming={() => studioState.setIsStreaming(!studioState.isStreaming)}
        onToggleMicrophone={handleToggleMicrophone}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onToggleRaiseHand={() => studioState.setIsRaisedHand(!studioState.isRaisedHand)}
        onToggleReactions={() => studioState.setIsReactionsOpen(!studioState.isReactionsOpen)}
        onChangeLayout={studioState.setLayoutMode}
        onToggleFullscreen={handleToggleFullscreen}
        onLeaveStudio={() => {
          if (confirm('Are you sure you want to leave the studio?')) {
            // Save settings and redirect
            window.location.href = '/';
          }
        }}
        settings={{
          isMicOn: studioState.settings.isMicOn,
          isCamOn: studioState.settings.isCamOn,
        }}
      />

      {/* Modals */}
      <AnimatePresence>
        {studioState.isInviteOpen && (
          <InviteModal
            projectId={resolvedParams.projectId}
            isOpen={studioState.isInviteOpen}
            onClose={() => studioState.setIsInviteOpen(false)}
            inviteEmail={studioState.inviteEmail}
            setInviteEmail={studioState.setInviteEmail}
            onSendInvite={(email) => {
              studioState.addSystemMessage(`Invitation sent to ${email}`);
              studioState.setInviteEmail('');
              studioState.setIsInviteOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {studioState.isSettingsOpen && (
          <SettingsModal
            isOpen={studioState.isSettingsOpen}
            onClose={() => studioState.setIsSettingsOpen(false)}
            settings={studioState.settings}
            updateSettings={studioState.updateSettings}
            videoBrightness={studioState.videoBrightness}
            setVideoBrightness={studioState.setVideoBrightness}
            videoContrast={studioState.videoContrast}
            setVideoContrast={studioState.setVideoContrast}
            isEchoCancellation={studioState.isEchoCancellation}
            setIsEchoCancellation={studioState.setIsEchoCancellation}
            isNoiseReduction={studioState.isNoiseReduction}
            setIsNoiseReduction={studioState.setIsNoiseReduction}
            isAutoGain={studioState.isAutoGain}
            setIsAutoGain={studioState.setIsAutoGain}
          />
        )}
      </AnimatePresence>

      {/* Hidden canvas for profile capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}