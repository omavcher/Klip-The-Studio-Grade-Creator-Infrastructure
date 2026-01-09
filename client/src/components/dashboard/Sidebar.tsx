"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Folder, Calendar, Radio, Settings, 
  LogOut, ChevronLeft, ChevronRight, Menu, X 
} from 'lucide-react';

const menuItems = [
  { icon: <Home size={22} />, label: 'Home', href: '/dashboard' },
  { icon: <Folder size={22} />, label: 'Projects', href: '/dashboard/projects' },
  { icon: <Calendar size={22} />, label: 'Schedule', href: '/dashboard/schedule' },
  { icon: <Radio size={22} />, label: 'Hosting', href: '/dashboard/hosting' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* MOBILE HEADER: Only visible on small screens */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/5 flex items-center justify-between px-6 z-[60]">
        <span className="text-xl font-black italic tracking-tighter">KLIP.</span>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-zinc-400">
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* DESKTOP/MOBILE SIDEBAR CONTAINER */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 280,
          x: isMobileOpen || !typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : -280 
        }}
        className={`
          fixed md:relative inset-y-0 left-0 z-[100] bg-zinc-950/80 backdrop-blur-xl 
          border-r border-white/5 flex flex-col transition-all duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* TOGGLE BUTTON: Desktop Only */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-20 bg-blue-600 rounded-full p-1 border border-white/10 hover:scale-110 transition-transform z-[110]"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* LOGO AREA */}
        <div className="p-6 mb-8 flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shrink-0" />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-2xl font-black tracking-tightest italic"
            >
              KLIP
            </motion.span>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 space-y-2 overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} className="block">
                <div className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group
                  ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}
                `}>
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-sm whitespace-nowrap">
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <Link href="/dashboard/settings" className="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-white font-bold text-sm group overflow-hidden">
            <Settings size={22} className="shrink-0" />
            {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">Settings</motion.span>}
          </Link>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-red-500/70 hover:text-red-500 font-bold text-sm group overflow-hidden">
            <LogOut size={22} className="shrink-0" />
            {!isCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">Logout</motion.span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}