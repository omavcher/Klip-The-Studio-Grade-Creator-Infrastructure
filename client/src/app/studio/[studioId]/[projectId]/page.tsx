"use client";

import React, { useState, useEffect, useRef, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, Settings, Users, MessageSquare, 
  Type, Music, Layout, Hand, Smile, Share, LogOut, X, Copy, 
  Mail, Play, Circle, Radio, Volume2, Sparkles, Camera, Sliders, 
  ChevronDown, Check, Headphones, Zap, Globe, Bell, Shield, 
  Cloud, Wifi, Battery, Eye, EyeOff, Lock, Unlock, Phone,
  UserPlus, AlertCircle, Clock, Maximize2, Minimize2,
  Download, Upload, RotateCw, Trash2, Edit, Save,
  Grid, List, ThumbsUp, Star, Award, Gift
} from 'lucide-react';

// --- TYPES ---
interface StudioSettings {
  displayName: string;
  headphoneStatus: 'none' | 'used';
  selectedEffect: string;
  selectedVideoDevice: string;
  selectedAudioDevice: string;
  selectedAudioOutputDevice: string;
  isCamOn: boolean;
  isMicOn: boolean;
  studioTitle: string;
  recordingQuality: '4k' | '1080p' | '720p';
  storageType: 'local' | 'cloud' | 'both';
  language: string;
}

interface Participant {
  id: string;
  name: string;
  email?: string;
  isHost: boolean;
  isSpeaking: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  avatarColor: string;
  connectionStatus: 'excellent' | 'good' | 'poor';
  audioLevel: number;
  joinedAt: Date;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderId: string;
  message: string;
  timestamp: Date;
  isSystem: boolean;
  reactions: { emoji: string; users: string[] }[];
}

interface Recording {
  id: string;
  title: string;
  duration: number;
  size: string;
  date: Date;
  thumbnail: string;
}

interface Reaction {
  id: string;
  emoji: string;
  label: string;
}

// --- CONSTANTS ---
const REACTIONS: Reaction[] = [
  { id: 'clap', emoji: '👏', label: 'Clap' },
  { id: 'thumbsup', emoji: '👍', label: 'Like' },
  { id: 'heart', emoji: '❤️', label: 'Love' },
  { id: 'laugh', emoji: '😂', label: 'Haha' },
  { id: 'wow', emoji: '😲', label: 'Wow' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
];

const QUALITY_OPTIONS = [
  { value: '4k', label: '4K Ultra HD', description: 'Best quality' },
  { value: '1080p', label: '1080p Full HD', description: 'Great quality' },
  { value: '720p', label: '720p HD', description: 'Good quality' },
];

const STORAGE_OPTIONS = [
  { value: 'local', label: 'Local Only', description: 'Save to device' },
  { value: 'cloud', label: 'Cloud Only', description: 'Save to cloud' },
  { value: 'both', label: 'Local + Cloud', description: 'Both locations' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
];

export default function RecordingStudio({ params }: { params: Promise<{ studioId: string; projectId: string }> }) {
  const resolvedParams = use(params);
  
  // --- STATE ---
  const [settings, setSettings] = useState<StudioSettings>({
    displayName: 'Om Awchar',
    headphoneStatus: 'none',
    selectedEffect: 'none',
    selectedVideoDevice: '',
    selectedAudioDevice: '',
    selectedAudioOutputDevice: '',
    isCamOn: true,
    isMicOn: true,
    studioTitle: 'Untitled Studio',
    recordingQuality: '1080p',
    storageType: 'both',
    language: 'en',
  });

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

  // Data states
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
      thumbnail: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w-300',
    },
  ]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

  // --- INITIALIZATION ---
  useEffect(() => {
    loadSettings();
    initializeMedia();
    simulateRealTimeUpdates();

    return () => {
      cleanup();
    };
  }, []);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const loadSettings = () => {
    const saved = localStorage.getItem(`klip_settings_${resolvedParams.projectId}`);
    if (saved) {
      try {
        const loadedSettings = JSON.parse(saved);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const saveSettings = () => {
    localStorage.setItem(`klip_settings_${resolvedParams.projectId}`, JSON.stringify(settings));
  };

  const initializeMedia = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
          deviceId: settings.selectedVideoDevice ? { exact: settings.selectedVideoDevice } : undefined,
        },
        audio: {
          echoCancellation: isEchoCancellation,
          noiseSuppression: isNoiseReduction,
          autoGainControl: isAutoGain,
          deviceId: settings.selectedAudioDevice ? { exact: settings.selectedAudioDevice } : undefined,
        },
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }

      // Initialize audio analysis
      initializeAudioAnalysis(stream);

    } catch (error) {
      console.error('Error initializing media:', error);
      // Fallback to placeholder
    }
  };

  const initializeAudioAnalysis = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyserRef.current && settings.isMicOn) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, average / 2.55));
          
          // Update participant audio levels
          setParticipants(prev => prev.map(p => 
            p.id === '1' ? { ...p, audioLevel: Math.min(100, average / 2.55) } : p
          ));
        }
        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Audio analysis failed:', error);
    }
  };

  const simulateRealTimeUpdates = () => {
    // Update connection quality periodically
    const qualityInterval = setInterval(() => {
      const qualities: Array<'excellent' | 'good' | 'poor'> = ['excellent', 'good', 'poor'];
      const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
      setConnectionQuality(randomQuality);
      
      // Update participants' connection status
      setParticipants(prev => prev.map(p => ({
        ...p,
        connectionStatus: Math.random() > 0.3 ? p.connectionStatus : randomQuality,
        isSpeaking: p.id !== '1' && Math.random() > 0.7 ? !p.isSpeaking : p.isSpeaking,
        audioLevel: p.isSpeaking ? Math.floor(Math.random() * 100) : p.audioLevel,
      })));
    }, 10000);

    // Update stream viewers
    const viewerInterval = setInterval(() => {
      setStreamViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(0, prev + change);
      });
    }, 15000);

    return () => {
      clearInterval(qualityInterval);
      clearInterval(viewerInterval);
    };
  };

  const cleanup = () => {
    // Stop all media streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Stop animation frames
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Stop recording timer
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  // --- MEDIA CONTROL FUNCTIONS ---
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const newState = !videoTrack.enabled;
        videoTrack.enabled = newState;
        setSettings(prev => ({ ...prev, isCamOn: newState }));
        setParticipants(prev => prev.map(p => 
          p.id === '1' ? { ...p, isVideoOn: newState } : p
        ));
      }
    }
  };

  const toggleMicrophone = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        const newState = !audioTrack.enabled;
        audioTrack.enabled = newState;
        setSettings(prev => ({ ...prev, isMicOn: newState }));
        setParticipants(prev => prev.map(p => 
          p.id === '1' ? { ...p, isAudioOn: newState } : p
        ));
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
        
        // Update participant state
        setParticipants(prev => prev.map(p => 
          p.id === '1' ? { ...p, isScreenSharing: true } : p
        ));
        
        // Handle when user stops sharing via browser controls
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setParticipants(prev => prev.map(p => 
            p.id === '1' ? { ...p, isScreenSharing: false } : p
          ));
        };
      } catch (error) {
        console.error('Screen sharing failed:', error);
      }
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      const startTime = Date.now();
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      // Add system message
      addSystemMessage('Recording started');
    } else {
      // Stop recording
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      // Save recording
      const newRecording: Recording = {
        id: Date.now().toString(),
        title: `Recording ${recordings.length + 1}`,
        duration: recordingTime,
        size: `${(recordingTime * 0.5).toFixed(1)} GB`,
        date: new Date(),
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
      };
      
      setRecordings(prev => [newRecording, ...prev]);
      setRecordingTime(0);
      addSystemMessage('Recording saved');
    }
  };

  const toggleStreaming = () => {
    if (!isStreaming) {
      setIsStreaming(true);
      addSystemMessage('Live streaming started');
    } else {
      setIsStreaming(false);
      addSystemMessage('Live streaming ended');
    }
  };

  // --- CHAT FUNCTIONS ---
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      senderId: '1',
      message: newMessage.trim(),
      timestamp: new Date(),
      isSystem: false,
      reactions: [],
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const addSystemMessage = (text: string) => {
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
  };

  const addReaction = (messageId: string, emoji: string) => {
    setChatMessages(prev => prev.map(msg => {
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

  // --- PARTICIPANT FUNCTIONS ---
  const toggleRaiseHand = () => {
    setIsRaisedHand(!isRaisedHand);
    if (!isRaisedHand) {
      addSystemMessage(`${settings.displayName} raised their hand`);
    }
  };

  const removeParticipant = (participantId: string) => {
    if (participantId === '1') return; // Can't remove host
    
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    addSystemMessage(`${participants.find(p => p.id === participantId)?.name} left the studio`);
  };

  const muteParticipant = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, isAudioOn: !p.isAudioOn } : p
    ));
  };

  // --- INVITE FUNCTIONS ---
  const copyInviteLink = () => {
    const link = `https://klip.studio/join/${resolvedParams.projectId}`;
    navigator.clipboard.writeText(link).then(() => {
      // Show temporary feedback
      const button = document.querySelector('.copy-invite-btn');
      if (button) {
        const originalContent = button.innerHTML;
        button.innerHTML = '<Check size={18} /> Copied!';
        setTimeout(() => {
          button.innerHTML = originalContent;
        }, 2000);
      }
    });
  };

  const sendInviteEmail = () => {
    if (!inviteEmail.trim()) return;

    // Simulate sending email
    addSystemMessage(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  // --- UI FUNCTIONS ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const captureProfile = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const data = canvasRef.current.toDataURL('image/png');
      setProfileImg(data);

      // Show success feedback
      addSystemMessage('Profile picture updated');
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- PANEL COMPONENTS ---
  const PeoplePanel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Participants ({participants.length})</h3>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <UserPlus size={14} />
          Invite
        </button>
      </div>
      
      {participants.map(participant => (
        <div 
          key={participant.id}
          className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-zinc-800/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-10 h-10 rounded-lg ${participant.avatarColor} flex items-center justify-center text-sm font-bold shadow-lg`}>
                {participant.name.charAt(0)}
              </div>
              {participant.isHost && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                  <Star size={8} className="text-white" />
                </div>
              )}
              {participant.isScreenSharing && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                  <Share size={8} className="text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{participant.name}</p>
                {participant.isHost && (
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">Host</span>
                )}
                {isRaisedHand && participant.id === '1' && (
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <Hand size={8} /> Raised
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  participant.connectionStatus === 'excellent' ? 'bg-green-500 animate-pulse' :
                  participant.connectionStatus === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-[10px] text-zinc-400 font-medium">
                  {participant.connectionStatus === 'excellent' ? 'Excellent' :
                   participant.connectionStatus === 'good' ? 'Good' : 'Poor'}
                </span>
                <span className="text-[10px] text-zinc-500">•</span>
                <span className="text-[10px] text-zinc-500">
                  Joined {formatTime(Math.floor((Date.now() - participant.joinedAt.getTime()) / 1000))} ago
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Audio level indicator */}
            {participant.isAudioOn && (
              <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-150"
                  style={{ width: `${participant.audioLevel}%` }}
                />
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => muteParticipant(participant.id)}
                className={`p-1.5 rounded ${participant.isAudioOn ? 'hover:bg-green-500/20' : 'hover:bg-red-500/20'} transition-colors`}
                disabled={participant.id === '1'}
              >
                {participant.isAudioOn ? (
                  <Mic size={14} className={participant.isSpeaking ? 'text-green-400' : 'text-zinc-400'} />
                ) : (
                  <MicOff size={14} className="text-red-400" />
                )}
              </button>
              
              <button 
                className={`p-1.5 rounded ${participant.isVideoOn ? 'hover:bg-blue-500/20' : 'hover:bg-red-500/20'} transition-colors`}
              >
                {participant.isVideoOn ? (
                  <Video size={14} className="text-blue-400" />
                ) : (
                  <VideoOff size={14} className="text-red-400" />
                )}
              </button>
              
              {!participant.isHost && (
                <button 
                  onClick={() => removeParticipant(participant.id)}
                  className="p-1.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ChatPanel = () => (
    <div className="flex flex-col h-full">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {chatMessages.map(message => (
          <div 
            key={message.id}
            className={`p-3 rounded-xl ${
              message.isSystem 
                ? 'bg-blue-500/10 border border-blue-500/20' 
                : message.sender === 'You'
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20'
                : 'bg-zinc-900/50 border border-white/5'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  message.isSystem ? 'text-blue-400' : 
                  message.sender === 'You' ? 'text-green-400' : 'text-white'
                }`}>
                  {message.sender}
                </span>
                {!message.isSystem && (
                  <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              {message.isSystem && (
                <AlertCircle size={14} className="text-blue-400" />
              )}
            </div>
            
            <p className="text-sm mb-2">{message.message}</p>
            
            {message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction, idx) => (
                  <button
                    key={idx}
                    onClick={() => addReaction(message.id, reaction.emoji)}
                    className="px-2 py-1 bg-zinc-800/50 rounded-lg text-xs hover:bg-zinc-700/50 transition-colors"
                  >
                    <span className="mr-1">{reaction.emoji}</span>
                    <span className="text-zinc-400">{reaction.users.length}</span>
                  </button>
                ))}
              </div>
            )}
            
            {!message.isSystem && (
              <div className="flex gap-1 mt-2 pt-2 border-t border-white/5">
                {REACTIONS.slice(0, 3).map(reaction => (
                  <button
                    key={reaction.id}
                    onClick={() => addReaction(message.id, reaction.emoji)}
                    className="p-1 hover:bg-white/5 rounded transition-colors text-sm"
                    title={reaction.label}
                  >
                    {reaction.emoji}
                  </button>
                ))}
                <button className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 hover:bg-white/5 rounded transition-colors">
                  + Add
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder-zinc-500"
          />
          <div className="absolute right-2 top-2 flex gap-1">
            {REACTIONS.slice(0, 3).map(reaction => (
              <button
                key={reaction.id}
                onClick={() => setNewMessage(prev => prev + reaction.emoji)}
                className="p-1 hover:bg-white/5 rounded transition-colors"
                title={reaction.label}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );

  const BrandPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Studio Branding</h3>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
              KS
            </div>
            <div>
              <p className="text-sm font-bold">{settings.studioTitle}</p>
              <p className="text-xs text-zinc-500">Studio Logo</p>
            </div>
            <button className="ml-auto text-sm bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors">
              Change
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Studio Title</label>
              <input
                type="text"
                value={settings.studioTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, studioTitle: e.target.value }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Welcome Message</label>
              <textarea
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm h-24 resize-none"
                placeholder="Welcome to our studio..."
                defaultValue="Welcome to our recording studio! We're excited to create amazing content with you."
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Watermark</h3>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Show Watermark</span>
            <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <p className="text-xs text-zinc-500">Add your logo to recordings and streams</p>
        </div>
      </div>
    </div>
  );

  const MediaPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Recordings ({recordings.length})</h3>
        <div className="space-y-3">
          {recordings.map(recording => (
            <div 
              key={recording.id}
              className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/5 rounded-xl p-3 hover:bg-zinc-800/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Play size={20} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{recording.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock size={12} />
                      {formatTime(recording.duration)}
                    </span>
                    <span className="text-xs text-zinc-500">{recording.size}</span>
                    <span className="text-xs text-zinc-500">
                      {recording.date.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-blue-500/20 rounded-lg">
                    <Play size={16} className="text-blue-400" />
                  </button>
                  <button className="p-1.5 hover:bg-green-500/20 rounded-lg">
                    <Download size={16} className="text-green-400" />
                  </button>
                  <button className="p-1.5 hover:bg-red-500/20 rounded-lg">
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Upload Media</h3>
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/30 transition-colors cursor-pointer">
          <Upload size={32} className="mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-300">Drop files here or click to upload</p>
          <p className="text-xs text-zinc-500 mt-1">Supports images, videos, and presentations</p>
        </div>
      </div>
    </div>
  );

  // --- MAIN RENDER ---
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col overflow-hidden font-sans">
      
      {/* TOP BAR */}
      <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-black italic shadow-lg shadow-blue-500/20">
            KS
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-400">{settings.studioTitle}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  connectionQuality === 'excellent' ? 'bg-green-500 animate-pulse' :
                  connectionQuality === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="capitalize">{connectionQuality} Connection</span>
              </div>
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
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title="Settings"
          >
            <Settings size={18}/>
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          {/* Profile */}
          <div 
            className="relative group cursor-pointer"
            onClick={captureProfile}
            title="Capture profile picture"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-blue-400/50 overflow-hidden relative shadow-lg shadow-blue-500/20">
              {profileImg ? (
                <img src={profileImg} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-sm font-bold">{settings.displayName.charAt(0)}</span>
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

      {/* MAIN CONTENT */}
      <div ref={mainContainerRef} className="flex-1 flex overflow-hidden">
        
        {/* CENTER: VIDEO GRID */}
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className={`w-full h-full max-w-7xl gap-4 ${
            layoutMode === 'grid' ? 'grid grid-cols-2' :
            layoutMode === 'speaker' ? 'flex flex-col' :
            'grid grid-cols-3'
          }`}>
            
            {/* Host View (Always prominent) */}
            <div className={`relative rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-zinc-900 to-black group shadow-2xl ${
              layoutMode === 'speaker' ? 'h-2/3' : 'h-full'
            }`}>
              {isScreenSharing ? (
                <video 
                  ref={screenShareRef}
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
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
              )}
              
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
                  <Mic size={14} className={settings.isMicOn ? 'text-green-400' : 'text-red-400'} />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{settings.displayName}</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Host</span>
                  {isRaisedHand && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Hand size={10} /> Hand Raised
                    </span>
                  )}
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                {!settings.isCamOn && !isScreenSharing && (
                  <div className="px-2 py-1 bg-red-500/20 rounded text-xs font-medium text-red-400">
                    Camera Off
                  </div>
                )}
                {!settings.isMicOn && (
                  <div className="px-2 py-1 bg-red-500/20 rounded text-xs font-medium text-red-400">
                    Mic Off
                  </div>
                )}
              </div>
            </div>

            {/* Other Participants */}
            {participants
              .filter(p => !p.isHost)
              .map((participant, index) => (
                <div 
                  key={participant.id}
                  className={`relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 to-black group ${
                    layoutMode === 'speaker' ? 'h-1/3' : 'h-48'
                  }`}
                >
                  {participant.isVideoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${participant.avatarColor}`}>
                      <span className="text-xl font-bold">{participant.name.charAt(0)}</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium truncate">{participant.name}</span>
                      <div className="flex items-center gap-1">
                        {participant.isSpeaking && (
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        participant.connectionStatus === 'excellent' ? 'bg-green-500' :
                        participant.connectionStatus === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-[10px] text-zinc-400 capitalize">{participant.connectionStatus}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-96 border-l border-white/5 bg-gradient-to-b from-[#0D0D0D] to-black flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-white/5">
            {[
              { id: 'people', icon: <Users size={18} />, label: 'People', component: <PeoplePanel /> },
              { id: 'chat', icon: <MessageSquare size={18} />, label: 'Chat', component: <ChatPanel /> },
              { id: 'brand', icon: <Radio size={18} />, label: 'Brand', component: <BrandPanel /> },
              { id: 'media', icon: <Music size={18} />, label: 'Media', component: <MediaPanel /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
                  activePanel === tab.id
                    ? 'text-blue-500'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-medium uppercase">{tab.label}</span>
                {activePanel === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </button>
            ))}
          </div>
          
          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {(() => {
              switch (activePanel) {
                case 'people': return <PeoplePanel />;
                case 'chat': return <ChatPanel />;
                case 'brand': return <BrandPanel />;
                case 'media': return <MediaPanel />;
                default: return <PeoplePanel />;
              }
            })()}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">Studio Security</span>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-green-400" />
                  <span className="text-xs font-medium text-green-400">End-to-End Encrypted</span>
                </div>
              </div>
              <button 
                onClick={() => setIsInviteOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={16} />
                Invite People
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM CONTROLS */}
      <footer className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl">
            
            {/* Recording Controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleRecording}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                <Circle 
                  size={16} 
                  fill={isRecording ? "currentColor" : "none"} 
                  className={isRecording ? 'animate-pulse' : ''} 
                />
                <span className="text-xs font-medium">{isRecording ? 'Stop' : 'Record'}</span>
              </button>

              <button 
                onClick={toggleStreaming}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  isStreaming 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-white animate-pulse' : 'bg-current'}`} />
                <span className="text-xs font-medium">{isStreaming ? 'Stop Live' : 'Go Live'}</span>
              </button>
            </div>

            <div className="h-8 w-px bg-white/10 mx-1" />

            {/* Media Controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleMicrophone}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  settings.isMicOn ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
                title={settings.isMicOn ? "Mute microphone" : "Unmute microphone"}
              >
                {settings.isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                <span className="text-[10px] font-medium">Mic</span>
              </button>

              <button 
                onClick={toggleCamera}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  settings.isCamOn ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
                title={settings.isCamOn ? "Turn off camera" : "Turn on camera"}
              >
                {settings.isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
                <span className="text-[10px] font-medium">Camera</span>
              </button>

              <button 
                onClick={toggleScreenShare}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isScreenSharing ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
                title={isScreenSharing ? "Stop sharing" : "Share screen"}
              >
                <Share size={20} />
                <span className="text-[10px] font-medium">Share</span>
              </button>
            </div>

            <div className="h-8 w-px bg-white/10 mx-1" />

            {/* Audio Visualization */}
            <div className="flex items-center gap-2 px-3 py-2">
              <Volume2 size={20} className="text-zinc-400" />
              <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 mx-1" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsReactionsOpen(!isReactionsOpen)}
                className="flex flex-col items-center gap-1 px-3 py-2 text-zinc-400 hover:text-white transition-colors relative"
                title="Send reaction"
              >
                <Smile size={20} />
                <span className="text-[10px] font-medium">React</span>
                
                {/* Reactions Popup */}
                <AnimatePresence>
                  {isReactionsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl z-50"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {REACTIONS.map(reaction => (
                          <button
                            key={reaction.id}
                            onClick={() => {
                              addSystemMessage(`${settings.displayName} reacted with ${reaction.emoji}`);
                              setIsReactionsOpen(false);
                            }}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-2xl"
                            title={reaction.label}
                          >
                            {reaction.emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button 
                onClick={toggleRaiseHand}
                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                  isRaisedHand 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title={isRaisedHand ? "Lower hand" : "Raise hand"}
              >
                <Hand size={20} />
                <span className="text-[10px] font-medium">Hand</span>
              </button>

              <div className="relative group">
                <button className="flex flex-col items-center gap-1 px-3 py-2 text-zinc-400 hover:text-white transition-colors">
                  <Layout size={20} />
                  <span className="text-[10px] font-medium">Layout</span>
                </button>
                <div className="absolute bottom-full mb-2 right-0 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="space-y-1">
                    {['grid', 'speaker', 'cinema'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setLayoutMode(mode as any)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize ${
                          layoutMode === mode
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        {mode} View
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 mx-1" />

            {/* Leave Button */}
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to leave the studio?')) {
                  saveSettings();
                  // In a real app: router.push('/')
                  window.location.href = '/';
                }
              }}
              className="flex flex-col items-center gap-1 px-3 py-2 text-red-400 hover:text-red-500 transition-colors"
              title="Leave studio"
            >
              <LogOut size={20} />
              <span className="text-[10px] font-medium">Leave</span>
            </button>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      
      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsInviteOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#121212] to-black border border-white/10 p-8 rounded-3xl max-w-lg w-full relative shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsInviteOpen(false)} 
                className="absolute top-6 right-6 text-zinc-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={20}/>
              </button>
              
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Invite People
              </h2>
              <p className="text-zinc-400 mb-8">Share this studio with others</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-3">Share link</label>
                  <div className="flex gap-2 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                    <input 
                      readOnly 
                      value={`https://klip.studio/join/${resolvedParams.projectId}`} 
                      className="flex-1 bg-transparent outline-none text-zinc-300 text-sm" 
                    />
                    <button 
                      onClick={copyInviteLink}
                      className="text-blue-500 hover:text-blue-400 transition-colors copy-invite-btn flex items-center gap-2"
                    >
                      <Copy size={18}/>
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">Anyone with this link can join your studio</p>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-xs font-medium text-zinc-500">Or invite via email</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-3">Send email invitations</label>
                  <div className="flex gap-2">
                    <input 
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="email@example.com" 
                      className="flex-1 bg-zinc-900/50 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500/50 text-white placeholder-zinc-500"
                    />
                    <button 
                      onClick={sendInviteEmail}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                      Send
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                    <Shield size={16} className="text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">Secure Studio</p>
                      <p className="text-xs text-blue-400/70">All communications are end-to-end encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end justify-end"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="h-full w-full max-w-xl bg-gradient-to-b from-[#121212] to-black border-l border-white/10 p-8 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Studio Settings
                  </h2>
                  <p className="text-zinc-400 text-sm">Configure your studio experience</p>
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20}/>
                </button>
              </div>

              <div className="space-y-8">
                {/* Video Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Video Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-zinc-300">Brightness</span>
                        <span className="text-sm font-medium">{videoBrightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={videoBrightness}
                        onChange={(e) => setVideoBrightness(parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-zinc-300">Contrast</span>
                        <span className="text-sm font-medium">{videoContrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={videoContrast}
                        onChange={(e) => setVideoContrast(parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Audio Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Audio Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium">Echo Cancellation</p>
                        <p className="text-xs text-zinc-500">Reduce audio feedback</p>
                      </div>
                      <button 
                        onClick={() => setIsEchoCancellation(!isEchoCancellation)}
                        className={`w-12 h-6 rounded-full transition-all relative ${isEchoCancellation ? 'bg-green-500' : 'bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEchoCancellation ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium">Noise Reduction</p>
                        <p className="text-xs text-zinc-500">AI-powered noise cancellation</p>
                      </div>
                      <button 
                        onClick={() => setIsNoiseReduction(!isNoiseReduction)}
                        className={`w-12 h-6 rounded-full transition-all relative ${isNoiseReduction ? 'bg-green-500' : 'bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isNoiseReduction ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium">Auto Gain Control</p>
                        <p className="text-xs text-zinc-500">Automatically adjust microphone volume</p>
                      </div>
                      <button 
                        onClick={() => setIsAutoGain(!isAutoGain)}
                        className={`w-12 h-6 rounded-full transition-all relative ${isAutoGain ? 'bg-green-500' : 'bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAutoGain ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recording Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Recording Settings</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-zinc-900/50 rounded-xl">
                      <label className="text-sm font-medium block mb-3">Quality</label>
                      <div className="space-y-2">
                        {QUALITY_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => setSettings(prev => ({ ...prev, recordingQuality: option.value as any }))}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              settings.recordingQuality === option.value
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-zinc-500">{option.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-900/50 rounded-xl">
                      <label className="text-sm font-medium block mb-3">Storage</label>
                      <div className="space-y-2">
                        {STORAGE_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => setSettings(prev => ({ ...prev, storageType: option.value as any }))}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              settings.storageType === option.value
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-zinc-500">{option.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button 
                  onClick={() => {
                    saveSettings();
                    setIsSettingsOpen(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden canvas for profile capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}