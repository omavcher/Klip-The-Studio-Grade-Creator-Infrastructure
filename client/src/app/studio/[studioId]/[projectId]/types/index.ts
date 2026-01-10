export interface StudioSettings {
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
  
  export interface Participant {
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
  
  export interface ChatMessage {
    id: string;
    sender: string;
    senderId: string;
    message: string;
    timestamp: Date;
    isSystem: boolean;
    reactions: { emoji: string; users: string[] }[];
  }
  
  export interface Recording {
    id: string;
    title: string;
    duration: number;
    size: string;
    date: Date;
    thumbnail: string;
  }
  
  export interface Reaction {
    id: string;
    emoji: string;
    label: string;
  }
  
  export const REACTIONS: Reaction[] = [
    { id: 'clap', emoji: '👏', label: 'Clap' },
    { id: 'thumbsup', emoji: '👍', label: 'Like' },
    { id: 'heart', emoji: '❤️', label: 'Love' },
    { id: 'laugh', emoji: '😂', label: 'Haha' },
    { id: 'wow', emoji: '😲', label: 'Wow' },
    { id: 'fire', emoji: '🔥', label: 'Fire' },
  ];
  
  export const QUALITY_OPTIONS = [
    { value: '4k', label: '4K Ultra HD', description: 'Best quality' },
    { value: '1080p', label: '1080p Full HD', description: 'Great quality' },
    { value: '720p', label: '720p HD', description: 'Good quality' },
  ];
  
  export const STORAGE_OPTIONS = [
    { value: 'local', label: 'Local Only', description: 'Save to device' },
    { value: 'cloud', label: 'Cloud Only', description: 'Save to cloud' },
    { value: 'both', label: 'Local + Cloud', description: 'Both locations' },
  ];
  
  export const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
  ];