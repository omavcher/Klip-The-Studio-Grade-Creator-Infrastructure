'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Sliders, Video, Mic, Save, Monitor, Cloud, Globe, Bell, Shield, Wifi, Battery } from 'lucide-react';
import { StudioSettings, QUALITY_OPTIONS, STORAGE_OPTIONS, LANGUAGES } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  updateSettings: (updates: Partial<StudioSettings>) => void;
  videoBrightness: number;
  setVideoBrightness: (value: number) => void;
  videoContrast: number;
  setVideoContrast: (value: number) => void;
  isEchoCancellation: boolean;
  setIsEchoCancellation: (value: boolean) => void;
  isNoiseReduction: boolean;
  setIsNoiseReduction: (value: boolean) => void;
  isAutoGain: boolean;
  setIsAutoGain: (value: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
  videoBrightness,
  setVideoBrightness,
  videoContrast,
  setVideoContrast,
  isEchoCancellation,
  setIsEchoCancellation,
  isNoiseReduction,
  setIsNoiseReduction,
  isAutoGain,
  setIsAutoGain,
}) => {
  const [activeTab, setActiveTab] = React.useState<'video' | 'audio' | 'recording' | 'advanced'>('video');

  const handleSave = () => {
    // Save settings logic here
    onClose();
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'video', label: 'Video', icon: <Video size={18} /> },
    { id: 'audio', label: 'Audio', icon: <Mic size={18} /> },
    { id: 'recording', label: 'Recording', icon: <Monitor size={18} /> },
    { id: 'advanced', label: 'Advanced', icon: <Sliders size={18} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-end justify-end"
      onClick={onClose}
    >
      <motion.div 
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: "spring", damping: 25 }}
        className="h-full w-full max-w-xl bg-gradient-to-b from-[#121212] to-black border-l border-white/10 p-8 overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sliders size={24} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Studio Settings
              </h2>
              <p className="text-zinc-400 text-sm">Configure your studio experience</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {/* Video Settings */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Video size={20} />
                Video Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <div>
                      <span className="text-sm text-zinc-300">Brightness</span>
                      <p className="text-xs text-zinc-500">Adjust video brightness</p>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-zinc-800 rounded-lg">{videoBrightness}%</span>
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
                  <div className="flex justify-between mb-3">
                    <div>
                      <span className="text-sm text-zinc-300">Contrast</span>
                      <p className="text-xs text-zinc-500">Adjust video contrast</p>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-zinc-800 rounded-lg">{videoContrast}%</span>
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

                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">HD Video</p>
                      <p className="text-xs text-zinc-500">Enable high definition video</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">Auto Framing</p>
                      <p className="text-xs text-zinc-500">Keep you centered in frame</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audio Settings */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Mic size={20} />
                Audio Settings
              </h3>
              
              <div className="space-y-4">
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

                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <div className="flex justify-between mb-3">
                    <div>
                      <span className="text-sm text-zinc-300">Microphone Gain</span>
                      <p className="text-xs text-zinc-500">Adjust microphone sensitivity</p>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-zinc-800 rounded-lg">75%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recording Settings */}
          {activeTab === 'recording' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Monitor size={20} />
                Recording Settings
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <label className="text-sm font-medium block mb-3">Quality</label>
                  <div className="space-y-2">
                    {QUALITY_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateSettings({ recordingQuality: option.value as any })}
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
                        onClick={() => updateSettings({ storageType: option.value as any })}
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

                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">Auto Recording</p>
                      <p className="text-xs text-zinc-500">Start recording when studio starts</p>
                    </div>
                    <div className="w-12 h-6 bg-zinc-700 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">Cloud Backup</p>
                      <p className="text-xs text-zinc-500">Automatically backup to cloud</p>
                    </div>
                    <Cloud size={20} className="text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sliders size={20} />
                Advanced Settings
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <label className="text-sm font-medium block mb-3">Language</label>
                  <div className="space-y-2">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => updateSettings({ language: lang.code })}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                          settings.language === lang.code
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Globe size={16} className="text-zinc-400" />
                          <span>{lang.name}</span>
                        </div>
                        {settings.language === lang.code && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-xs text-zinc-500">Receive studio notifications</p>
                    </div>
                    <Bell size={20} className="text-blue-400" />
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">End-to-End Encryption</p>
                      <p className="text-xs text-zinc-500">Maximum security for all communications</p>
                    </div>
                    <Shield size={20} className="text-green-400" />
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Network Status</span>
                      <div className="flex items-center gap-2">
                        <Wifi size={16} className="text-green-400" />
                        <span className="text-sm font-medium">Excellent</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Latency</span>
                      <span className="text-sm font-medium">42ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Bandwidth</span>
                      <span className="text-sm font-medium">12.4 Mbps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button 
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-8"
          >
            <Save size={18} />
            Save Settings
          </button>

          {/* Reset Button */}
          <button 
            onClick={onClose}
            className="w-full py-3 bg-zinc-900 border border-white/10 text-zinc-300 rounded-xl font-medium hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Version Info */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-500">Klip Studio v2.4.1 • © 2024 Klip Inc.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};