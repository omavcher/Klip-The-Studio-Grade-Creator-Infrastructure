"use client";
import Navbar from "@/components/Navbar";
import BentoFeatures from "@/components/BentoFeatures";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function Home() {
  return (
    // Added overflow-x-hidden to prevent any horizontal scrolling
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <Navbar />

      <section className="relative pt-32 md:pt-28 pb-20 px-4 z-10 container mx-auto">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-blue-400 tracking-widest uppercase mb-8 md:mb-12"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Klip Studio v1.0
          </motion.div>

          {/* FLUID TYPOGRAPHY HERO */}
          {/* text-[clamp(min, preferred, max)] scales text based on screen width */}
          <motion.h1 
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  className="text-[clamp(2.5rem,10vw,8rem)] font-[1000] tracking-tighter leading-[0.8] mb-8 md:mb-12 uppercase"
>
  ZERO LAG. <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 to-zinc-600">
    TOTAL CLARITY.
  </span>
</motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400 text-base md:text-2xl max-w-2xl mx-auto mb-10 md:mb-14 px-4"
          >
            The video engine built for <span className="text-white">Elite Creators</span>. 
            Local 4K capture. AI editing. Zero lag.
          </motion.p>

          {/* Responsive Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
            <button className="w-full sm:w-auto bg-white text-black px-8 md:px-12 py-4 md:py-6 rounded-full font-black text-lg md:text-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              Start Building
            </button>
            <button className="flex items-center gap-3 text-zinc-400 hover:text-white font-bold text-lg md:text-xl group">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-colors">
                <Play size={18} className="md:w-6 md:h-6" fill="currentColor" />
              </div>
              See the Magic
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <BentoFeatures />
    </div>
  );
}