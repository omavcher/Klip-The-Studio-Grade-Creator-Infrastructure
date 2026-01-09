"use client";
import React, { useState } from 'react';
import { Home, Folder, Calendar, Radio, Settings, Search, Bell, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('Home');

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home' },
    { icon: <Folder size={20} />, label: 'Projects' },
    { icon: <Calendar size={20} />, label: 'Schedule' },
    { icon: <Radio size={20} />, label: 'Hosting' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden">
      {/* SIDEBAR: Glassmorphism Laptop View */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 px-2 mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
          <span className="text-2xl font-black tracking-tightest">KLIP</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === item.label 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/5 pt-6 space-y-2">
          <Link href="#" className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white transition-all font-bold text-sm">
            <Settings size={20} /> Settings
          </Link>
          <div className="p-4 bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-2xl mt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Storage</p>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 w-1/3 h-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
            </div>
            <p className="text-[10px] mt-2 text-zinc-400">3.2 GB of 10 GB used</p>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
        {/* TOP COMMAND BAR */}
        <header className="sticky top-0 z-40 px-8 py-6 flex items-center justify-between bg-[#050505]/80 backdrop-blur-md">
          <div className="relative group w-full max-w-md hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search studio files..." 
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-3 bg-zinc-900 rounded-xl border border-white/5 hover:bg-zinc-800 transition-all relative">
              <Bell size={20} className="text-zinc-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 p-[1px]">
               <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-black">OA</div>
            </div>
          </div>
        </header>

        <div className="px-6 md:px-12 pb-32">
          {children}
        </div>

        {/* MOBILE NAVIGATION: Bottom Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50">
           {menuItems.map(item => (
             <button key={item.label} className="flex flex-col items-center gap-1 text-zinc-500">
               {item.icon} <span className="text-[10px] uppercase font-black">{item.label}</span>
             </button>
           ))}
        </nav>
      </main>
    </div>
  );
}