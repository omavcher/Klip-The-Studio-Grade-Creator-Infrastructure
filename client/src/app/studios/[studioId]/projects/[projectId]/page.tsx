"use client";
import React, { use, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Mic, Upload, Scissors, Sparkles, ChevronRight, 
  Zap, UserPlus, ArrowUp, Settings, Edit2, Check, X, 
  Loader2, MessageSquare, BrainCircuit, Video, Clock, Globe, User
} from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
interface PageProps {
  params: Promise<{ studioId: string; projectId: string; }>;
}

export default function DynamicStudioPage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  // --- STATE MANAGEMENT ---
  const [studioTitle, setStudioTitle] = useState("Untitled Studio");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const router = useRouter(); // Initialize router
  // Planning Modal States
  const [sessionData, setSessionData] = useState({
    name: "",
    date: "2026-01-10",
    startTime: "01:00",
    endTime: "02:00",
    timezone: "(GMT+05:30) India Standard Time - Calcutta",
    inviteEmail: "",
    description: ""
  });

  // AI Creator States
  const [aiLoadingSteps, setAiLoadingSteps] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [selectedTone, setSelectedTone] = useState("Thought Leader");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- HANDLERS ---
  
  const handleGoogleCalendarSync = () => {
    const { name, date, startTime, endTime, description } = sessionData;
    
    // Format dates for Google Calendar (YYYYMMDDTHHmmSSZ)
    const start = `${date.replace(/-/g, '')}T${startTime.replace(':', '')}00`;
    const end = `${date.replace(/-/g, '')}T${endTime.replace(':', '')}00`;
    
    const gCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name || studioTitle)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&sf=true&output=xml`;
    
    window.open(gCalUrl, '_blank');
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setIsAiProcessing(true);
    setAiLoadingSteps(["Analyzing show context...", "Consulting Co-creator personality...", "Generating creative insights..."]);
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setAiLoadingSteps(prev => prev.slice(1));
    }
    setIsAiProcessing(false);
    setAiInput("");
  };


  // Handle redirection to the Live Recording Room
  const handleRecordRedirect = () => {
    // 1. Format the studio slug correctly (om-awchar-s-studio)
    const studioSlug = resolvedParams.studioId;
    
    // 2. Extract the current project ID
    const currentProjectId = resolvedParams.projectId;

    // 3. Redirect to the Studio Room with the projectId as a query param
    router.push(`/studio/${studioSlug}?projectId=${currentProjectId}`);
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden selection:bg-blue-500/30 font-sans">
      
      {/* --- PLANNING MODAL (Logic for image_2b7ae0.png) --- */}
      <AnimatePresence>
        {isPlanning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#121212] border border-white/5 p-8 rounded-[2rem] max-w-2xl w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black tracking-tightest italic">PLAN SESSION</h2>
                <button onClick={() => setIsPlanning(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                {/* Session Name */}
                <div className="relative border-b border-white/10 pb-2">
                   <input 
                    type="text" 
                    placeholder="Session name*"
                    className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-zinc-700"
                    value={sessionData.name}
                    onChange={(e) => setSessionData({...sessionData, name: e.target.value})}
                   />
                </div>

                {/* Date & Time Row */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 p-3 rounded-xl flex-1">
                    <Calendar size={18} className="text-zinc-500" />
                    <input 
                      type="date" 
                      className="bg-transparent outline-none text-sm w-full"
                      value={sessionData.date}
                      onChange={(e) => setSessionData({...sessionData, date: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 p-3 rounded-xl">
                    <input type="time" className="bg-transparent outline-none text-sm" value={sessionData.startTime} onChange={(e) => setSessionData({...sessionData, startTime: e.target.value})}/>
                    <span className="text-zinc-500">-</span>
                    <input type="time" className="bg-transparent outline-none text-sm" value={sessionData.endTime} onChange={(e) => setSessionData({...sessionData, endTime: e.target.value})}/>
                  </div>
                </div>

                {/* Timezone */}
                <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 p-3 rounded-xl w-full">
                  <Globe size={18} className="text-zinc-500" />
                  <select className="bg-transparent outline-none text-sm w-full cursor-pointer">
                    <option className="bg-zinc-900">{sessionData.timezone}</option>
                  </select>
                </div>

                {/* Invites */}
                <div className="flex items-center gap-3 bg-zinc-900 border border-white/5 p-3 rounded-xl w-full">
                  <User size={18} className="text-zinc-500" />
                  <input 
                    type="email" 
                    placeholder="Invite people via email" 
                    className="bg-transparent outline-none text-sm w-full"
                    value={sessionData.inviteEmail}
                    onChange={(e) => setSessionData({...sessionData, inviteEmail: e.target.value})}
                  />
                  <span className="text-xs font-bold text-zinc-500 px-2 uppercase border-l border-white/10">Guest</span>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Description</label>
                  <textarea 
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 text-sm h-24 outline-none focus:border-blue-500/30"
                    placeholder="What's this session about?"
                    value={sessionData.description}
                    onChange={(e) => setSessionData({...sessionData, description: e.target.value})}
                  />
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button onClick={() => setIsPlanning(false)} className="px-8 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors">Cancel</button>
                  <button 
                    onClick={handleGoogleCalendarSync}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-blue-600/20"
                  >
                    Sync to Google Calendar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PERSONALIZATION MODAL --- */}
      <AnimatePresence>
        {isPersonalizing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tightest italic uppercase">Personalization</h2>
                  <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">Teach Co-creator about yourself</p>
                </div>
                <button onClick={() => setIsPersonalizing(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black text-zinc-500 uppercase mb-3 block">What tone fits you best?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Thought Leader", "Late Night Host", "Influencer", "Custom"].map((tone) => (
                      <button 
                        key={tone}
                        onClick={() => setSelectedTone(tone)}
                        className={`p-4 rounded-2xl border text-left transition-all ${selectedTone === tone ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                      >
                        <p className="font-bold text-sm">{tone}</p>
                        <p className="text-[10px] text-zinc-500 uppercase mt-1">
                          {tone === "Thought Leader" ? "Clear & Insightful" : tone === "Late Night Host" ? "Energetic & Witty" : "Passionate & Deep"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setIsPersonalizing(false)}
                  className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                >
                  Save Personality
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LEFT WORKSPACE --- */}
      <main className="flex-1 flex flex-col border-r border-white/5 overflow-y-auto no-scrollbar relative">
        <header className="px-8 py-6 flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
          <nav className="flex items-center gap-2 text-sm font-bold text-zinc-500 uppercase tracking-widest overflow-hidden">
            <span className="hover:text-white cursor-pointer transition-colors whitespace-nowrap">Projects</span>
            <ChevronRight size={14} className="shrink-0" />
            <div className="flex items-center gap-2 group">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input 
                    autoFocus
                    className="bg-zinc-800 border-none outline-none px-2 py-1 rounded text-white"
                    value={studioTitle}
                    onChange={(e) => setStudioTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  />
                  <button onClick={() => setIsEditingTitle(false)} className="text-emerald-500"><Check size={16}/></button>
                </div>
              ) : (
                <div className="flex items-center gap-2 cursor-pointer text-white group" onClick={() => setIsEditingTitle(true)}>
                  <span className="truncate max-w-[150px] md:max-w-xs">{studioTitle}</span>
                  <Edit2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </nav>
          
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-[10px] font-black bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/20 uppercase tracking-widest">Try Pro</button>
            <button onClick={() => setIsPersonalizing(true)} className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center hover:bg-zinc-700 transition-colors"><Settings size={14} /></button>
          </div>
        </header>

        {/* --- MAIN HERO --- */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center max-w-6xl mx-auto w-full">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8 relative">
            <div className="absolute -inset-10 bg-blue-500/10 blur-[100px] rounded-full" />
            <div className="w-32 h-20 bg-zinc-900 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
               <div className="flex gap-2">
                 <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center"><Mic size={16} className="text-zinc-600"/></div>
                 <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center"><Video size={16} className="text-zinc-600"/></div>
               </div>
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tightest uppercase leading-none">Start <br className="md:hidden"/> Creating</h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-md mx-auto font-medium">Record 4K local source or upload files to begin editing.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <button onClick={() => setIsPlanning(true)} className="text-left w-full"><ActionCard icon={<Calendar size={24}/>} label="Plan" desc="Schedule Guests" /></button>
{/* RECORD BUTTON: Redirection Logic Applied Here */}
<button onClick={handleRecordRedirect} className="text-left w-full h-full focus:outline-none">
              <ActionCard 
                icon={<Mic size={24}/>} 
                label="Record" 
                desc="Direct 4K" 
                color="border-red-500/20 text-red-500" 
              />
            </button>            <ActionCard icon={<Upload size={24}/>} label="Upload" desc="Import Raw" />
            <ActionCard icon={<Scissors size={24}/>} label="Edit" desc="Clip Studio" />
          </div>
        </div>
      </main>

      {/* --- RIGHT PANEL: CO-CREATOR --- */}
      <aside className="hidden lg:flex w-[400px] flex-col bg-zinc-950/50 backdrop-blur-sm">
        <header className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20"><Sparkles size={16} className="text-white"/></div>
             <h3 className="font-bold tracking-tight">Co-Creator</h3>
           </div>
           <button onClick={() => setIsPersonalizing(true)} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors">Personalize <Settings size={12}/></button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <AnimatePresence mode="wait">
            {isAiProcessing ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><BrainCircuit size={48} className="text-blue-50" /></motion.div>
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-widest text-white">{aiLoadingSteps[0]}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <MessageSquare size={40} className="text-zinc-700 mb-6" />
                <h4 className="text-xl font-bold mb-2 uppercase italic tracking-tighter">No transcript found</h4>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 border-t border-white/5 bg-black/40">
          <form onSubmit={handleAiSubmit} className="relative">
            <textarea 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder={`Ask Co-Creator (${selectedTone})...`}
              className="w-full bg-zinc-900 border border-white/5 rounded-[1.5rem] p-5 pt-7 pr-12 min-h-[140px] text-sm outline-none shadow-2xl"
            />
            <button type="submit" className="absolute bottom-5 right-5 p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/30 active:scale-90 transition-all"><ArrowUp size={18} strokeWidth={3} /></button>
          </form>
        </div>
      </aside>
    </div>
  );
}

function ActionCard({ icon, label, desc, color = "border-white/5 text-zinc-400" }: any) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.02 }} className={`p-6 rounded-[2rem] border bg-zinc-900/40 text-left group cursor-pointer transition-all hover:bg-zinc-900/80 ${color}`}>
      <div className="mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform origin-left">{icon}</div>
      <h3 className="font-bold text-white text-lg tracking-tight uppercase italic">{label}</h3>
      <p className="text-zinc-500 text-[10px] mt-1 uppercase font-black tracking-widest leading-tight">{desc}</p>
    </motion.div>
  );
}