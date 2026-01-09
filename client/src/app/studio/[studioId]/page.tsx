"use client";
import React, { use, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Video, VideoOff, MicOff, Settings, 
  Headphones, Info, ChevronDown, Monitor, 
  Zap, ShieldCheck, Play, Sparkles, X, 
  Check, Calendar, Globe, User, Edit2, ArrowUp, Loader2, BrainCircuit, MessageSquare
} from 'lucide-react';

// --- TYPES ---
interface PageProps {
  params: Promise<{ studioId: string; projectId: string; }>;
}

interface DeviceSelectorProps {
  icon: React.ReactNode;
  label: string;
  options: MediaDeviceInfo[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface EffectOptionProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface BackgroundTemplate {
  id: string;
  name: string;
  image: string;
  loaded?: boolean;
}

interface UserSettings {
  displayName: string;
  headphoneStatus: 'none' | 'used';
  selectedEffect: string;
  selectedVideoDevice: string;
  selectedAudioDevice: string;
  selectedAudioOutputDevice: string;
  isCamOn: boolean;
  isMicOn: boolean;
  studioTitle: string;
}

export default function StudioGreenRoom({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  
  // --- STATE: UI CONTROL ---
  const [isPlanning, setIsPlanning] = useState(false);
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  const [studioTitle, setStudioTitle] = useState("Untitled Studio");
  const [isJoining, setIsJoining] = useState(false);

  // --- STATE: HARDWARE & MEDIA ---
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [headphoneStatus, setHeadphoneStatus] = useState<'none' | 'used'>('none'); // Default: No Headphones
  
  const [devices, setDevices] = useState<{
    video: MediaDeviceInfo[],
    audioIn: MediaDeviceInfo[],
    audioOut: MediaDeviceInfo[]
  }>({ video: [], audioIn: [], audioOut: [] });

  const [selectedEffect, setSelectedEffect] = useState<'none' | 'blur' | 'gradient' | 'nature' | 'office' | 'abstract' | 'studio' | 'modern'>('none');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [selectedAudioOutputDevice, setSelectedAudioOutputDevice] = useState("");
  
  // Display name state
  const [displayName, setDisplayName] = useState("Om Awchar");
  
  // Background templates with higher quality images
  const [backgroundTemplates, setBackgroundTemplates] = useState<BackgroundTemplate[]>([
    { id: 'gradient', name: 'Gradient', image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=450&fit=crop' },
    { id: 'nature', name: 'Nature', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=450&fit=crop' },
    { id: 'office', name: 'Office', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=450&fit=crop' },
    { id: 'abstract', name: 'Abstract', image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&h=450&fit=crop' },
    { id: 'studio', name: 'Studio', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=450&fit=crop' },
    { id: 'modern', name: 'Modern', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=450&fit=crop' },
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const previewContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number>();
  const backgroundImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('studioSettings');
    if (savedSettings) {
      try {
        const settings: UserSettings = JSON.parse(savedSettings);
        setDisplayName(settings.displayName || "Om Awchar");
        setHeadphoneStatus(settings.headphoneStatus || 'none');
        setSelectedEffect(settings.selectedEffect as any || 'none');
        setSelectedVideoDevice(settings.selectedVideoDevice || "");
        setSelectedAudioDevice(settings.selectedAudioDevice || "");
        setSelectedAudioOutputDevice(settings.selectedAudioOutputDevice || "");
        setIsCamOn(settings.isCamOn !== undefined ? settings.isCamOn : true);
        setIsMicOn(settings.isMicOn !== undefined ? settings.isMicOn : true);
        setStudioTitle(settings.studioTitle || "Untitled Studio");
      } catch (error) {
        console.error("Error loading saved settings:", error);
      }
    }
  }, []);

  // --- INITIALIZE HARDWARE ---
  useEffect(() => {
    async function init() {
      try {
        // First load background images
        await loadBackgroundImages();
        
        // Then get user media
        const userStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: true 
        });
        setStream(userStream);
        
        // Get all devices
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        updateDevicesList(allDevices);
        
        // Set initial device selections
        if (allDevices.length > 0) {
          const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
          const audioInDevices = allDevices.filter(d => d.kind === 'audioinput');
          const audioOutDevices = allDevices.filter(d => d.kind === 'audiooutput');
          
          if (videoDevices.length > 0 && !selectedVideoDevice) {
            setSelectedVideoDevice(videoDevices[0].deviceId);
          }
          if (audioInDevices.length > 0 && !selectedAudioDevice) {
            setSelectedAudioDevice(audioInDevices[0].deviceId);
          }
          if (audioOutDevices.length > 0 && !selectedAudioOutputDevice) {
            setSelectedAudioOutputDevice(audioOutDevices[0].deviceId);
          }
        }

        // Setup canvases
        setupCanvases();

      } catch (err) {
        console.error("Hardware Access Denied", err);
      }
    }
    init();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      stream?.getTracks().forEach(t => t.stop());
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []);

  // Load background images
  const loadBackgroundImages = async () => {
    setIsLoadingImages(true);
    const promises = backgroundTemplates.map(template => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          backgroundImagesRef.current.set(template.id, img);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image for ${template.id}`);
          resolve();
        };
        img.src = template.image;
      });
    });
    
    await Promise.all(promises);
    setIsLoadingImages(false);
  };

  // Setup canvases
  const setupCanvases = () => {
    if (mainCanvasRef.current) {
      mainContextRef.current = mainCanvasRef.current.getContext('2d');
      mainCanvasRef.current.width = 1280;
      mainCanvasRef.current.height = 720;
    }
    
    if (previewCanvasRef.current) {
      previewContextRef.current = previewCanvasRef.current.getContext('2d');
      previewCanvasRef.current.width = 1280;
      previewCanvasRef.current.height = 720;
    }
  };

  // Handle device change
  const handleDeviceChange = async () => {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    updateDevicesList(allDevices);
  };

  const updateDevicesList = (allDevices: MediaDeviceInfo[]) => {
    setDevices({
      video: allDevices.filter(d => d.kind === 'videoinput'),
      audioIn: allDevices.filter(d => d.kind === 'audioinput'),
      audioOut: allDevices.filter(d => d.kind === 'audiooutput')
    });
  };

  // Apply video effects with proper background replacement
  const applyVideoEffects = () => {
    if (!videoRef.current || !mainCanvasRef.current || !mainContextRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = mainCanvasRef.current;
    const ctx = mainContextRef.current;

    const drawFrame = () => {
      if (video.videoWidth === 0 || !ctx) {
        animationFrameRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle different effects
      if (selectedEffect === 'blur') {
        // Apply blur effect
        ctx.filter = 'blur(20px) brightness(1.1)';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        
      } else if (selectedEffect !== 'none') {
        // Apply background template with person segmentation (simplified version)
        const bgImage = backgroundImagesRef.current.get(selectedEffect);
        
        if (bgImage) {
          // Draw background first
          ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
          
          // Draw video on top (simulating foreground)
          // In a real app, you'd use ML for person segmentation
          // For now, we'll just draw a rounded rectangle as placeholder
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const personWidth = 400;
          const personHeight = 600;
          
          // Save context for clipping
          ctx.save();
          
          // Create rounded rectangle for "person"
          ctx.beginPath();
          ctx.roundRect(
            centerX - personWidth/2,
            centerY - personHeight/2,
            personWidth,
            personHeight,
            40
          );
          ctx.clip();
          
          // Draw the video inside the clipped area
          ctx.drawImage(video, 
            centerX - personWidth/2,
            centerY - personHeight/2,
            personWidth,
            personHeight
          );
          
          ctx.restore();
          
          // Add a subtle border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            centerX - personWidth/2,
            centerY - personHeight/2,
            personWidth,
            personHeight
          );
          
        } else {
          // Fallback: just draw video if background not loaded
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        
      } else {
        // No effect - just draw video
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Also update preview canvas if modal is open
      if (isEffectsOpen && previewCanvasRef.current && previewContextRef.current) {
        const previewCtx = previewContextRef.current;
        const previewCanvas = previewCanvasRef.current;
        
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        
        // Apply same effect to preview
        if (selectedEffect === 'blur') {
          previewCtx.filter = 'blur(20px) brightness(1.1)';
          previewCtx.drawImage(video, 0, 0, previewCanvas.width, previewCanvas.height);
          previewCtx.filter = 'none';
          
        } else if (selectedEffect !== 'none') {
          const bgImage = backgroundImagesRef.current.get(selectedEffect);
          
          if (bgImage) {
            previewCtx.drawImage(bgImage, 0, 0, previewCanvas.width, previewCanvas.height);
            
            const centerX = previewCanvas.width / 2;
            const centerY = previewCanvas.height / 2;
            const personWidth = 400;
            const personHeight = 600;
            
            previewCtx.save();
            previewCtx.beginPath();
            previewCtx.roundRect(
              centerX - personWidth/2,
              centerY - personHeight/2,
              personWidth,
              personHeight,
              40
            );
            previewCtx.clip();
            previewCtx.drawImage(video, 
              centerX - personWidth/2,
              centerY - personHeight/2,
              personWidth,
              personHeight
            );
            previewCtx.restore();
            
            previewCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            previewCtx.lineWidth = 2;
            previewCtx.strokeRect(
              centerX - personWidth/2,
              centerY - personHeight/2,
              personWidth,
              personHeight
            );
          } else {
            previewCtx.drawImage(video, 0, 0, previewCanvas.width, previewCanvas.height);
          }
        } else {
          previewCtx.drawImage(video, 0, 0, previewCanvas.width, previewCanvas.height);
        }
      }

      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    // Start the animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    drawFrame();
  };

  // Update effects when selection changes or modal opens
  useEffect(() => {
    if (stream && videoRef.current && !isLoadingImages) {
      applyVideoEffects();
    }
  }, [selectedEffect, stream, isEffectsOpen, isLoadingImages]);

  // Start/stop animation based on camera state
  useEffect(() => {
    if (!isCamOn && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    } else if (isCamOn && stream && !isLoadingImages) {
      applyVideoEffects();
    }
  }, [isCamOn]);

  // Save settings to localStorage
  const saveSettingsToLocalStorage = () => {
    const settings: UserSettings = {
      displayName,
      headphoneStatus,
      selectedEffect,
      selectedVideoDevice,
      selectedAudioDevice,
      selectedAudioOutputDevice,
      isCamOn,
      isMicOn,
      studioTitle
    };
    
    localStorage.setItem('studioSettings', JSON.stringify(settings));
    console.log('Settings saved to localStorage:', settings);
  };

  // Handle Join Studio button click
  const handleJoinStudio = async () => {
    setIsJoining(true);
    
    try {
      // Save all settings to localStorage
      saveSettingsToLocalStorage();
      
      // Stop the camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Build the redirect URL based on the current page
      // Current URL: http://localhost:3000/studio/om-awchar-s-studio?projectId=1c264de6f5c39eb7346bf2d9
      // Target URL: http://localhost:3000/studio/om-awchar-s-studio/1c264de6f5c39eb7346bf2d9
      
      // Extract studioId from params
      const { studioId, projectId } = await resolvedParams;
      
      // If we have both studioId and projectId from params, use them
      if (studioId && projectId) {
        // Redirect to: /studio/{studioId}/{projectId}
        router.push(`/studio/${studioId}/${projectId}`);
      } else {
        // Fallback: Try to get from URL search params
        const projectIdFromQuery = searchParams.get('projectId');
        const currentPath = window.location.pathname;
        
        if (projectIdFromQuery) {
          // Extract studioId from current path (e.g., "/studio/om-awchar-s-studio")
          const pathParts = currentPath.split('/');
          const studioIdFromPath = pathParts[2]; // "om-awchar-s-studio"
          
          if (studioIdFromPath) {
            // Redirect to: /studio/{studioIdFromPath}/{projectIdFromQuery}
            router.push(`/studio/${studioIdFromPath}/${projectIdFromQuery}`);
          } else {
            // Fallback to a default studio page
            router.push(`/studio/${displayName.toLowerCase().replace(/\s+/g, '-')}-studio/join`);
          }
        } else {
          // If no projectId in query, redirect to studio main page
          router.push(`/studio/${displayName.toLowerCase().replace(/\s+/g, '-')}-studio`);
        }
      }
      
    } catch (error) {
      console.error('Error joining studio:', error);
      setIsJoining(false);
      
      // Show error message (you could add a toast notification here)
      alert('Failed to join studio. Please try again.');
    }
  };

  // --- EFFECT LOGIC ---
  const toggleCam = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !isCamOn);
      setIsCamOn(!isCamOn);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  // Change video device
  const changeVideoDevice = async (deviceId: string) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
        audio: true
      });
      
      setStream(newStream);
      setSelectedVideoDevice(deviceId);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error changing video device:", err);
    }
  };

  // Change audio input device
  const changeAudioInputDevice = async (deviceId: string) => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) audioTrack.stop();
      
      try {
        const newAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } }
        });
        
        const newAudioTrack = newAudioStream.getAudioTracks()[0];
        stream.addTrack(newAudioTrack);
        setSelectedAudioDevice(deviceId);
      } catch (err) {
        console.error("Error changing audio input device:", err);
      }
    }
  };

  // Change audio output device
  const changeAudioOutputDevice = (deviceId: string) => {
    if (videoRef.current) {
      // @ts-ignore - setSinkId is not in the standard TypeScript definitions yet
      if (videoRef.current.setSinkId) {
        // @ts-ignore
        videoRef.current.setSinkId(deviceId)
          .then(() => {
            setSelectedAudioOutputDevice(deviceId);
          })
          .catch(err => {
            console.error("Error setting audio output:", err);
          });
      }
    }
  };

  // Hardware Dropdown Component
  const HardwareDrop = ({ icon, label, options, value, onChange, disabled = false }: DeviceSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <div 
          className={`flex items-center justify-between bg-zinc-900/40 border border-white/5 px-6 py-4 rounded-2xl transition-all cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-900'}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-4">
            <div className="text-zinc-500 group-hover:text-blue-500 transition-colors">{icon}</div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
              <span className="text-sm font-bold text-zinc-300">
                {options.find(opt => opt.deviceId === value)?.label || options[0]?.label || 'Default Hardware'}
              </span>
            </div>
          </div>
          <ChevronDown size={16} className={`text-zinc-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/5 rounded-xl overflow-hidden z-50 shadow-2xl"
            >
              <div className="max-h-60 overflow-y-auto">
                {options.map((device) => (
                  <button
                    key={device.deviceId}
                    className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 border-b border-white/5 last:border-b-0"
                    onClick={() => {
                      onChange(device.deviceId);
                      setIsOpen(false);
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{device.label}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                        {device.kind === 'videoinput' ? 'Camera' : 
                         device.kind === 'audioinput' ? 'Microphone' : 'Speaker'}
                      </p>
                    </div>
                    {value === device.deviceId && <Check size={16} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Effect Option Component
  const EffectOption = ({ active, onClick, icon, label }: EffectOptionProps) => {
    return (
      <button 
        onClick={onClick} 
        className="flex flex-col items-center gap-2 group"
      >
        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all ${active ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-zinc-900 border-white/5 hover:border-white/10'}`}>
          {icon}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-blue-400' : 'text-zinc-600'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      
      {/* --- TOP NAV BAR --- */}
      <header className="p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20" />
          <span className="font-black tracking-tightest italic">KLIP STUDIO</span>
        </div>
        <button className="flex items-center gap-2 text-xs font-black bg-zinc-800 px-4 py-2 rounded-lg border border-white/10">
          <Info size={14} /> Help
        </button>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-12 max-w-7xl mx-auto w-full">
        
        {/* LEFT: IDENTITY & ENTRY */}
        <section className="flex-1 w-full space-y-10 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tightest leading-tight uppercase">Check your cam and mic</h1>
            <p className="text-zinc-500 font-medium">Joining as Host</p>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 flex items-center justify-between group">
               <div className="flex-1">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Display Name</p>
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-transparent w-full text-2xl font-bold outline-none" 
                  />
               </div>
               <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-blue-500/20 uppercase">Host</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setHeadphoneStatus('none')}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col gap-3 text-left ${headphoneStatus === 'none' ? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-zinc-900/50 border-white/5 hover:border-white/20'}`}
              >
                <Zap size={20} />
                <span className="font-bold text-sm">I am not using headphones</span>
              </button>
              <button 
                onClick={() => setHeadphoneStatus('used')}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col gap-3 text-left ${headphoneStatus === 'used' ? 'bg-blue-600 border-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-zinc-900/50 border-white/5 hover:border-white/20'}`}
              >
                <Headphones size={20} />
                <span className="font-bold text-sm">I am using headphones</span>
              </button>
            </div>

            <button 
              onClick={handleJoinStudio}
              disabled={isJoining}
              className={`w-full ${isJoining ? 'bg-blue-600' : 'bg-white hover:bg-blue-500 hover:text-white'} text-black py-6 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isJoining ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Joining Studio...
                </>
              ) : (
                'Join Studio'
              )}
            </button>
          </div>
        </section>

        {/* RIGHT: HARDWARE PREVIEW & SELECTORS */}
        <section className="flex-1 w-full max-w-xl order-1 lg:order-2 space-y-6">
           <div className="relative aspect-video bg-zinc-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
              {/* Canvas for effects - always rendered */}
              <canvas 
                ref={mainCanvasRef}
                className={`absolute inset-0 w-full h-full object-cover ${selectedEffect === 'none' ? 'hidden' : 'block'}`}
              />
              
              {/* Original video - shown when no effects */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted={headphoneStatus === 'none'}
                className={`w-full h-full object-cover transition-all duration-700 ${selectedEffect === 'none' ? 'block' : 'hidden'} ${!isCamOn ? 'opacity-0' : 'opacity-100'}`}
              />
              
              {!isCamOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 font-black text-zinc-700 text-xs uppercase tracking-[0.4em]">
                  Camera Paused
                </div>
              )}

              {/* EFFECTS TRIGGER */}
              <button 
                onClick={() => setIsEffectsOpen(true)}
                className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors z-10"
              >
                <Sparkles size={14} className="text-blue-400" /> Effects
              </button>

              {/* Current effect indicator */}
              {selectedEffect !== 'none' && (
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 z-10">
                  <Sparkles size={12} />
                  {selectedEffect === 'blur' ? 'Background Blur' : backgroundTemplates.find(t => t.id === selectedEffect)?.name}
                </div>
              )}

              {/* Loading indicator for effects */}
              {isLoadingImages && selectedEffect !== 'none' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-blue-400" />
                    <span className="text-xs font-medium">Loading effects...</span>
                  </div>
                </div>
              )}

              {/* FLOATING CONTROLS */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-full z-10">
                <button 
                  onClick={toggleMic} 
                  className={`p-4 rounded-full transition-all ${isMicOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {isMicOn ? <Mic size={20}/> : <MicOff size={20}/>}
                </button>
                <button 
                  onClick={toggleCam} 
                  className={`p-4 rounded-full transition-all ${isCamOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {isCamOn ? <Video size={20}/> : <VideoOff size={20}/>}
                </button>
              </div>
           </div>

           {/* DROP-DOWN SELECTORS */}
           <div className="space-y-3">
              <HardwareDrop 
                icon={<Video size={16}/>} 
                label="Integrated Camera" 
                options={devices.video} 
                value={selectedVideoDevice} 
                onChange={changeVideoDevice}
              />
              <HardwareDrop 
                icon={<Mic size={16}/>} 
                label="Default Input - Mic" 
                options={devices.audioIn} 
                value={selectedAudioDevice} 
                onChange={changeAudioInputDevice}
              />
              <HardwareDrop 
                icon={<Headphones size={16}/>} 
                label="System Audio Output" 
                options={devices.audioOut} 
                value={selectedAudioOutputDevice} 
                onChange={changeAudioOutputDevice}
                disabled={headphoneStatus === 'none'}
              />
           </div>
        </section>
      </main>

      {/* --- MODAL: VISUAL EFFECTS --- */}
      <AnimatePresence>
        {isEffectsOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsEffectsOpen(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              className="bg-[#121212] border border-white/10 p-10 rounded-[3rem] max-w-5xl w-full flex flex-col md:flex-row gap-12 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsEffectsOpen(false)} 
                className="absolute top-6 right-6 text-zinc-500 hover:text-white z-10 bg-black/50 p-2 rounded-full"
              >
                <X size={24}/>
              </button>
              
              <div className="w-full md:w-1/3 space-y-10">
                <div>
                  <h3 className="text-2xl font-black mb-6 italic tracking-tighter uppercase">Visual effects</h3>
                  
                  {/* Background Blur Section */}
                  <div className="mb-8">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Background Blur</p>
                    <div className="flex gap-4">
                      <EffectOption 
                        active={selectedEffect === 'none'} 
                        onClick={() => setSelectedEffect('none')} 
                        icon={<X size={16}/>} 
                        label="Off" 
                      />
                      <EffectOption 
                        active={selectedEffect === 'blur'} 
                        onClick={() => setSelectedEffect('blur')} 
                        icon={<div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 blur-[2px] rounded-full"/>} 
                        label="Studio Blur" 
                      />
                    </div>
                  </div>

                  {/* Background Templates Section */}
                  <div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Background Templates</p>
                    <div className="grid grid-cols-3 gap-3">
                      {backgroundTemplates.map((template) => (
                        <button 
                          key={template.id}
                          onClick={() => setSelectedEffect(template.id as any)}
                          className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all relative group ${selectedEffect === template.id ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20' : 'border-white/10 hover:border-white/30'}`}
                        >
                          <img 
                            src={template.image} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                            alt={template.name}
                          />
                          <div className={`absolute inset-0 flex items-center justify-center ${selectedEffect === template.id ? 'bg-blue-500/20' : 'bg-black/40 group-hover:bg-black/20'}`}>
                            {selectedEffect === template.id && (
                              <div className="bg-blue-500 p-1.5 rounded-full shadow-lg">
                                <Check size={14} />
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-center">
                            <span className="text-[8px] font-black uppercase tracking-widest bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
                              {template.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Effect Instructions */}
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles size={12} /> How it works
                  </p>
                  <p className="text-xs text-zinc-300">
                    Select an effect to automatically apply it to your live video. 
                    <span className="text-blue-300 font-semibold"> Blur effect</span> creates a professional background blur. 
                    <span className="text-purple-300 font-semibold"> Templates</span> replace your background with beautiful preset images.
                  </p>
                </div>
              </div>

              {/* Preview Section */}
              <div className="flex-1 relative">
                <div className="aspect-video bg-zinc-950 rounded-[2.5rem] overflow-hidden border-2 border-white/10 relative mb-4 shadow-2xl">
                  {/* Canvas for preview effects */}
                  <canvas 
                    ref={previewCanvasRef}
                    className={`w-full h-full object-cover ${selectedEffect === 'none' ? 'hidden' : 'block'}`}
                  />
                  
                  {/* Original video for no-effect preview */}
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover ${selectedEffect === 'none' ? 'block' : 'hidden'}`}
                  />
                  
                  {/* Loading overlay for preview */}
                  {isLoadingImages && selectedEffect !== 'none' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 size={32} className="animate-spin text-blue-400" />
                        <span className="text-sm font-medium">Loading effect preview...</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-6 left-6 px-4 py-1.5 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm rounded-full text-[9px] font-black tracking-widest uppercase border border-white/20 flex items-center gap-2">
                    <Video size={12} /> Live Preview
                  </div>
                  
                  {/* Selected effect indicator */}
                  {selectedEffect !== 'none' && (
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/80 backdrop-blur-sm rounded-full text-[9px] font-black tracking-widest uppercase border border-white/20 flex items-center gap-2">
                      <Sparkles size={12} />
                      {selectedEffect === 'blur' ? 'Background Blur' : backgroundTemplates.find(t => t.id === selectedEffect)?.name}
                    </div>
                  )}
                </div>
                
                {/* Effect Controls */}
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setSelectedEffect('none')}
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${selectedEffect === 'none' ? 'bg-blue-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                  >
                    <X size={16} /> Clear Effects
                  </button>
                  <button 
                    onClick={() => setIsEffectsOpen(false)}
                    className="px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <Check size={16} /> Apply & Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}