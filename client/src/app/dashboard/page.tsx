"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Scissors, Radio, Calendar, Upload, Sparkles, ArrowUpRight } from 'lucide-react';

const actions = [
  { icon: <Mic size={28} />, label: 'Record', color: 'bg-red-500', active: true },
  { icon: <Scissors size={28} />, label: 'Edit', color: 'bg-zinc-800' },
  { icon: <Radio size={28} />, label: 'Go Live', color: 'bg-zinc-800' },
  { icon: <Calendar size={28} />, label: 'Schedule', color: 'bg-zinc-800' },
  { icon: <Upload size={28} />, label: 'Upload', color: 'bg-zinc-800' },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* ACTION HUB */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-14 py-16">
        {actions.map((action, i) => (
          <motion.div 
            key={action.label}
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-4 group cursor-pointer"
          >
            <div className={`
              w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center 
              transition-all duration-500 border border-white/5
              ${action.active ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.15)]' : 'bg-zinc-900/50 hover:border-blue-500/40'}
            `}>
              <div className={action.active ? 'text-red-500' : 'text-zinc-500 group-hover:text-blue-500 transition-colors'}>
                {action.icon}
              </div>
            </div>
            <span className={`text-xs md:text-sm font-black uppercase tracking-widest ${action.active ? 'text-red-500' : 'text-zinc-500 group-hover:text-white'}`}>
              {action.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* AI MEDIA LIBRARY */}
      <section className="mt-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Sparkles className="text-blue-500" size={20} /></div>
            <h2 className="text-2xl font-black tracking-tight text-white">AI MAGIC TOOLS</h2>
          </div>
          <button className="text-sm font-bold text-zinc-500 hover:text-white flex items-center gap-1 transition-all">View All <ArrowUpRight size={14} /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StudioCard 
             title="Magic Clips" 
             desc="AI creates 9:16 vertical shorts from your long raw footage." 
             image="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800"
             tag="PRO"
          />
          <StudioCard 
             title="Translate & Sync" 
             desc="Dub your video into 30+ languages with perfect lip-sync." 
             image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800"
             tag="BETA"
          />
          <StudioCard 
             title="Studio Audio" 
             desc="Remove background noise and echo with one-click AI logic." 
             image="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800"
             tag="FREE"
          />
        </div>
      </section>
    </div>
  );
}

function StudioCard({ title, desc, image, tag }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="group relative aspect-video md:aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer"
    >
      <img src={image} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      <div className="absolute top-6 right-6">
        <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full text-white">{tag}</span>
      </div>

      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h3 className="text-2xl font-black mb-2 leading-none uppercase">{title}</h3>
        <p className="text-zinc-400 text-sm font-medium leading-snug">{desc}</p>
      </div>
    </motion.div>
  );
}