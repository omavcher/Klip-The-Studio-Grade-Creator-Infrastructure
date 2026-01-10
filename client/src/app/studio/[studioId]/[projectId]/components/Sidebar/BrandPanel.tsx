'use client';

import React from 'react';
import { Upload, Palette, Type, Settings } from 'lucide-react';
import { StudioSettings } from '../../types';

interface BrandPanelProps {
  settings: StudioSettings;
  updateSettings: (updates: Partial<StudioSettings>) => void;
}

export const BrandPanel: React.FC<BrandPanelProps> = ({
  settings,
  updateSettings,
}) => {
  const themes = [
    { id: 'dark', name: 'Dark', colors: ['#1a1a1a', '#2d2d2d'] },
    { id: 'blue', name: 'Blue', colors: ['#0d1b2a', '#1b263b'] },
    { id: 'purple', name: 'Purple', colors: ['#1a0b2e', '#2d1b69'] },
    { id: 'green', name: 'Green', colors: ['#0d2818', '#1a3c27'] },
  ];

  const fonts = [
    { id: 'inter', name: 'Inter', value: 'font-sans' },
    { id: 'montserrat', name: 'Montserrat', value: 'font-montserrat' },
    { id: 'roboto', name: 'Roboto', value: 'font-roboto' },
    { id: 'system', name: 'System', value: 'font-system' },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Branding */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Studio Branding</h3>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
                KS
              </div>
              <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                <Upload size={20} className="text-white" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{settings.studioTitle}</p>
              <p className="text-xs text-zinc-500">Studio Logo</p>
              <button className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Upload new logo
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Studio Title</label>
              <input
                type="text"
                value={settings.studioTitle}
                onChange={(e) => updateSettings({ studioTitle: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                placeholder="Enter studio title"
              />
            </div>
            
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Welcome Message</label>
              <textarea
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:border-blue-500/50"
                placeholder="Welcome to our studio..."
                defaultValue="Welcome to our recording studio! We're excited to create amazing content with you."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Theme Selection */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Palette size={16} />
          Theme
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map(theme => (
            <button
              key={theme.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                settings.selectedEffect === theme.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/5 hover:border-white/10'
              }`}
              onClick={() => updateSettings({ selectedEffect: theme.id })}
            >
              <div 
                className="w-full h-8 rounded mb-2" 
                style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
              />
              <span className="text-xs font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Font Selection */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Type size={16} />
          Font
        </h3>
        <div className="space-y-2">
          {fonts.map(font => (
            <button
              key={font.id}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                settings.language === font.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/5 hover:border-white/10'
              }`}
              onClick={() => updateSettings({ language: font.id })}
            >
              <div className="font-medium" style={{ fontFamily: font.value }}>
                {font.name}
              </div>
              <div className="text-xs text-zinc-500 mt-1" style={{ fontFamily: font.value }}>
                Aa Bb Cc
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Watermark Settings */}
      <div>
        <h3 className="text-sm font-bold text-white mb-4">Watermark</h3>
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-zinc-400" />
              <span className="text-sm">Show Watermark</span>
            </div>
            <div className="relative">
              <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1">
                <div className="w-3 h-3 bg-white rounded-full transition-transform" />
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-500">Add your logo to recordings and streams</p>
          <div className="mt-3 p-3 bg-zinc-900/50 rounded-lg">
            <div className="text-xs text-zinc-400 mb-2">Watermark Preview</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-xs font-bold">
                KS
              </div>
              <div className="text-sm opacity-50">Recording Studio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};