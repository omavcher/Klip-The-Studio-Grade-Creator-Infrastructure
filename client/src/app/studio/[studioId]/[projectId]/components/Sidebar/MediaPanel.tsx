'use client';

import React, { useState } from 'react';
import { Play, Clock, Download, Trash2, Upload, Folder, Music, Video, Image, MoreVertical, Search, Filter } from 'lucide-react';
import { Recording } from '../../types';

interface MediaPanelProps {
  recordings: Recording[];
  onPlayRecording?: (recording: Recording) => void;
  onDownloadRecording?: (recording: Recording) => void;
  onDeleteRecording?: (recording: Recording) => void;
}

export const MediaPanel: React.FC<MediaPanelProps> = ({
  recordings,
  onPlayRecording,
  onDownloadRecording,
  onDeleteRecording,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'video' | 'audio' | 'image'>('all');

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'video' && recording.size.includes('GB')) ||
      (selectedCategory === 'audio' && recording.size.includes('MB')) ||
      (selectedCategory === 'image' && recording.size.includes('KB'));
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Media', icon: <Folder size={14} />, count: recordings.length },
    { id: 'video', label: 'Videos', icon: <Video size={14} />, count: recordings.filter(r => r.size.includes('GB')).length },
    { id: 'audio', label: 'Audio', icon: <Music size={14} />, count: recordings.filter(r => r.size.includes('MB')).length },
    { id: 'image', label: 'Images', icon: <Image size={14} />, count: recordings.filter(r => r.size.includes('KB')).length },
  ];

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Media Library</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              title="Grid view"
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
              </div>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              title="List view"
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="h-1 bg-current rounded-sm" />
                <div className="h-1 bg-current rounded-sm" />
                <div className="h-1 bg-current rounded-sm" />
              </div>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                selectedCategory === category.id
                  ? 'bg-white/20'
                  : 'bg-zinc-700'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recordings List */}
      <div className="space-y-3">
        {filteredRecordings.length === 0 ? (
          <div className="text-center py-8">
            <Folder size={48} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-400">No media found</p>
            <p className="text-xs text-zinc-500 mt-1">Upload files or start recording</p>
          </div>
        ) : (
          filteredRecordings.map(recording => (
            <div 
              key={recording.id}
              className="bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 border border-white/5 rounded-xl p-3 hover:bg-zinc-800/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div className="relative">
                  <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Play size={20} className="text-blue-400" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black/80 text-[8px] px-1 py-0.5 rounded">
                    {formatTime(recording.duration)}
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate">{recording.title}</p>
                    <button className="p-1 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock size={12} />
                      {formatTime(recording.duration)}
                    </span>
                    <span className="text-xs text-zinc-500">{recording.size}</span>
                    <span className="text-xs text-zinc-500">
                      {formatDate(recording.date)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
                <button 
                  onClick={() => onPlayRecording?.(recording)}
                  className="flex-1 py-1.5 text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Play size={12} />
                  Play
                </button>
                <button 
                  onClick={() => onDownloadRecording?.(recording)}
                  className="flex-1 py-1.5 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Download size={12} />
                  Download
                </button>
                <button 
                  onClick={() => onDeleteRecording?.(recording)}
                  className="flex-1 py-1.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Section */}
      <div className="pt-4 border-t border-white/5">
        <h4 className="text-sm font-bold text-white mb-3">Upload Media</h4>
        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-blue-500/30 transition-colors cursor-pointer group">
          <Upload size={32} className="mx-auto text-zinc-400 mb-3 group-hover:text-blue-400 transition-colors" />
          <p className="text-sm text-zinc-300">Drop files here or click to upload</p>
          <p className="text-xs text-zinc-500 mt-1">Supports MP4, MOV, MP3, JPG, PNG, PDF</p>
          <button className="mt-4 text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors">
            Browse Files
          </button>
        </div>
      </div>
    </div>
  );
};