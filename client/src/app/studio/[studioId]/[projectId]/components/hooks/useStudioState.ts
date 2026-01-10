'use client';

import { useState, useCallback } from 'react';
import { StudioSettings, Participant, ChatMessage, Recording } from '../../types';

export const useStudioState = (initialSettings: StudioSettings) => {
  const [settings, setSettings] = useState<StudioSettings>(initialSettings);
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activePanel, setActivePanel] = useState('people');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReactionsOpen, setIsReactionsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [isEchoCancellation, setIsEchoCancellation] = useState(true);
  const [isNoiseReduction, setIsNoiseReduction] = useState(true);
  const [isAutoGain, setIsAutoGain] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [videoBrightness, setVideoBrightness] = useState(50);
  const [videoContrast, setVideoContrast] = useState(50);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [recordingTime, setRecordingTime] = useState(0);
  const [streamViewers, setStreamViewers] = useState(12);
  const [isRaisedHand, setIsRaisedHand] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'speaker' | 'cinema'>('grid');
  const [newMessage, setNewMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  // Initialize with sample data
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Om Awchar',
      email: 'om@example.com',
      isHost: true,
      isSpeaking: true,
      isVideoOn: true,
      isAudioOn: true,
      isScreenSharing: false,
      avatarColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
      connectionStatus: 'excellent',
      audioLevel: 75,
      joinedAt: new Date(),
    },
    {
      id: '2',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      isHost: false,
      isSpeaking: false,
      isVideoOn: true,
      isAudioOn: true,
      isScreenSharing: false,
      avatarColor: 'bg-gradient-to-br from-green-500 to-teal-600',
      connectionStatus: 'good',
      audioLevel: 30,
      joinedAt: new Date(Date.now() - 300000),
    },
    {
      id: '3',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      isHost: false,
      isSpeaking: true,
      isVideoOn: false,
      isAudioOn: true,
      isScreenSharing: true,
      avatarColor: 'bg-gradient-to-br from-pink-500 to-rose-600',
      connectionStatus: 'excellent',
      audioLevel: 85,
      joinedAt: new Date(Date.now() - 600000),
    },
    {
      id: '4',
      name: 'Marcus Lee',
      email: 'marcus@example.com',
      isHost: false,
      isSpeaking: false,
      isVideoOn: true,
      isAudioOn: false,
      isScreenSharing: false,
      avatarColor: 'bg-gradient-to-br from-orange-500 to-yellow-600',
      connectionStatus: 'poor',
      audioLevel: 0,
      joinedAt: new Date(Date.now() - 900000),
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'System',
      senderId: 'system',
      message: 'Welcome to the studio! Recording will start when host joins.',
      timestamp: new Date(Date.now() - 1800000),
      isSystem: true,
      reactions: [],
    },
    {
      id: '2',
      sender: 'Alex Johnson',
      senderId: '2',
      message: 'Hey everyone, ready when you are!',
      timestamp: new Date(Date.now() - 1200000),
      isSystem: false,
      reactions: [{ emoji: '👍', users: ['1', '3'] }],
    },
    {
      id: '3',
      sender: 'Sarah Chen',
      senderId: '3',
      message: 'Can everyone hear me okay?',
      timestamp: new Date(Date.now() - 900000),
      isSystem: false,
      reactions: [{ emoji: '👏', users: ['1'] }],
    },
    {
      id: '4',
      sender: 'You',
      senderId: '1',
      message: 'Yes, perfect! Let\'s start the recording.',
      timestamp: new Date(Date.now() - 600000),
      isSystem: false,
      reactions: [{ emoji: '🔥', users: ['2', '3', '4'] }],
    },
  ]);

  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      title: 'Product Launch Meeting',
      duration: 2345,
      size: '2.4 GB',
      date: new Date(Date.now() - 86400000),
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300',
    },
    {
      id: '2',
      title: 'Design Review Session',
      duration: 1876,
      size: '1.9 GB',
      date: new Date(Date.now() - 172800000),
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
    },
    {
      id: '3',
      title: 'Weekly Team Sync',
      duration: 3210,
      size: '3.1 GB',
      date: new Date(Date.now() - 259200000),
      thumbnail: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=300',
    },
  ]);

  const updateSettings = useCallback((updates: Partial<StudioSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const addSystemMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'System',
      senderId: 'system',
      message: text,
      timestamp: new Date(),
      isSystem: true,
      reactions: [],
    };

    setChatMessages(prev => [...prev, message]);
  }, []);

  return {
    settings,
    updateSettings,
    isRecording,
    setIsRecording,
    isStreaming,
    setIsStreaming,
    isScreenSharing,
    setIsScreenSharing,
    activePanel,
    setActivePanel,
    isInviteOpen,
    setIsInviteOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isReactionsOpen,
    setIsReactionsOpen,
    isFullscreen,
    setIsFullscreen,
    profileImg,
    setProfileImg,
    isEchoCancellation,
    setIsEchoCancellation,
    isNoiseReduction,
    setIsNoiseReduction,
    isAutoGain,
    setIsAutoGain,
    audioLevel,
    setAudioLevel,
    videoBrightness,
    setVideoBrightness,
    videoContrast,
    setVideoContrast,
    connectionQuality,
    setConnectionQuality,
    recordingTime,
    setRecordingTime,
    streamViewers,
    setStreamViewers,
    isRaisedHand,
    setIsRaisedHand,
    layoutMode,
    setLayoutMode,
    newMessage,
    setNewMessage,
    inviteEmail,
    setInviteEmail,
    participants,
    setParticipants,
    chatMessages,
    setChatMessages,
    recordings,
    setRecordings,
    addSystemMessage,
  };
};