"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  MoreVertical, 
  Download, 
  Share2, 
  Trash2, 
  Clock, 
  Video, 
  Users,
  Loader2,
  Filter
} from 'lucide-react';

// SAMPLE DATA
const SAMPLE_RECORDINGS = [
  { id: "rec_01", title: "Intro to WebRTC Deep Dive", date: "Jan 08, 2026", duration: "42:15", participants: 2, resolution: "4K Source", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600", size: "1.2 GB" },
  { id: "rec_02", title: "Influencer Marketing Podcast #4", date: "Jan 05, 2026", duration: "1:12:05", participants: 3, resolution: "1080p Raw", thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=600", size: "2.8 GB" },
  { id: "rec_03", title: "Next.js 15 Performance Workshop", date: "Jan 02, 2026", duration: "25:30", participants: 12, resolution: "4K Source", thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600", size: "850 MB" }
];

export default function ProjectsPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  // Helper: Format username and generate random 16-bit-style code
  const handleCreateProject = () => {
    setIsCreating(true);

    // Mocking user data (This will later come from your Auth context)
    const rawUsername = "Om Awchar";
    const formattedUsername = rawUsername.toLowerCase().replace(/\s+/g, '-');
    
    // Generating 24-character random hex (standard for MongoDB/Studio IDs)
    const randomId = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    // Simulate "Creating Project" delay for UX
    setTimeout(() => {
      router.push(`/studios/${formattedUsername}-s-studio/projects/${randomId}`);
    }, 2000);
  };

  return (
    <div className="relative space-y-10">
      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-blue-500 mb-6"
            >
              <Loader2 size={60} />
            </motion.div>
            <h2 className="text-3xl font-black tracking-tightest italic">CREATING STUDIO...</h2>
            <p className="text-zinc-500 mt-2 font-mono text-sm uppercase">Initializing local 4k buffers</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER AREA */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tightest">MY PROJECTS</h1>
          <p className="text-zinc-500 font-medium mt-2">Manage your high-fidelity studio recordings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-2xl font-bold border border-white/5 transition-all">
            <Filter size={18} /> Filter
          </button>
          <button 
            onClick={handleCreateProject}
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            New Project
          </button>
        </div>
      </header>

      {/* MEDIA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SAMPLE_RECORDINGS.map((recording, i) => (
          <motion.div
            key={recording.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-zinc-950/50 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 transition-all cursor-pointer"
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={recording.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={recording.title}/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                  <Play fill="currentColor" size={24} />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{recording.resolution}</div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold leading-tight group-hover:text-blue-500 transition-colors">{recording.title}</h3>
                <button className="text-zinc-500 hover:text-white"><MoreVertical size={20} /></button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-500">
                <div className="flex items-center gap-1.5"><Clock size={14} /> {recording.duration}</div>
                <div className="flex items-center gap-1.5"><Users size={14} /> {recording.participants}</div>
                <div className="flex items-center gap-1.5"><Video size={14} /> {recording.size}</div>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <span className="text-xs text-zinc-600 uppercase font-black tracking-widest">{recording.date}</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500"><Download size={18} /></button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500"><Share2 size={18} /></button>
                  <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/70"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}