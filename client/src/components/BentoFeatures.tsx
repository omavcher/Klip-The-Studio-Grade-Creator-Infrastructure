"use client";
import { motion } from "framer-motion";
import { Camera, Cpu, MousePointer2, Share2, Zap } from "lucide-react";

const features = [
  {
    title: "4K Source Recording",
    desc: "Direct hardware capture. Zero internet compression. Studio-raw quality in every frame.",
    // Laptop: Spans 2 columns | Mobile: Spans full width
    className: "md:col-span-2 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent border-blue-500/20",
    icon: <Camera className="text-blue-500" size={32} />,
    status: "Studio Grade"
  },
  {
    title: "AI Tracking",
    desc: "Auto-centering for TikTok.",
    className: "md:col-span-1 bg-zinc-900/50 border-white/5",
    icon: <Cpu className="text-emerald-500" size={24} />,
  },
  {
    title: "Instant Markers",
    desc: "Tag highlights live with one click.",
    className: "md:col-span-1 bg-zinc-900/50 border-white/5",
    icon: <MousePointer2 className="text-purple-500" size={24} />,
  },
  {
    title: "Multi-Export",
    desc: "One-click export for TikTok, YouTube, and Reels.",
    className: "md:col-span-2 bg-gradient-to-tr from-zinc-900/50 to-blue-900/10 border-white/5",
    icon: <Share2 className="text-orange-500" size={24} />,
  }
];

export default function BentoFeatures() {
  return (
    <section id="features" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12 text-left">
        <h2 className="text-sm font-black tracking-[0.3em] text-blue-500 uppercase mb-4 flex items-center gap-2">
          <Zap size={14} fill="currentColor" /> Infrastructure
        </h2>
        <p className="text-4xl md:text-6xl font-bold tracking-tightest">
          Built for <span className="text-zinc-500">Scale.</span>
        </p>
      </div>

      {/* THE GRID: Optimized for 2-column row on Laptop, 1-column on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px] md:auto-rows-[280px]">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8, 
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1] // Custom "Startup" easing
            }}
            className={`
              relative p-8 rounded-[2.5rem] border overflow-hidden
              flex flex-col justify-end group transition-all duration-500
              hover:border-white/20 hover:shadow-[0_0_40px_rgba(37,99,235,0.1)]
              ${f.className}
            `}
          >
            {/* Background Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              {f.status && (
                <div className="absolute top-0 right-0 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                  {f.status}
                </div>
              )}
              
              <div className="mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 origin-left">
                {f.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-2 tracking-tight text-white">{f.title}</h3>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium max-w-[280px]">
                {f.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}