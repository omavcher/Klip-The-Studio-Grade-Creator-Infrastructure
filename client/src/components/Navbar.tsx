"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed w-full flex justify-center pt-6 z-[100] px-4">
      <nav className={`
        transition-all duration-500 ease-in-out
        flex items-center justify-between
        max-w-6xl w-full px-6 py-3 rounded-2xl
        border border-white/10
        ${scrolled ? 'bg-white/5 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}
      `}>
        
        {/* TEXT-ONLY LOGO: High-End Minimalist */}
        <Link href="/" className="flex items-center group">
          <span className="text-2xl font-black tracking-tighter text-white transition-transform group-hover:-rotate-2">
            KLIP
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-0.5 mt-2 animate-pulse" />
        </Link>

        {/* DESKTOP NAV: Minimalist Links */}
        <div className="hidden md:flex items-center gap-10">
          {['Product', 'Studio', 'Pricing'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="bg-white text-black px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-blue-500 hover:text-white transition-all active:scale-95"
          >
            Join Klip <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-400">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 z-[-1] flex flex-col items-center justify-center gap-8 md:hidden backdrop-blur-lg">
          {['Product', 'Studio', 'Pricing'].map((item) => (
            <Link key={item} href="#" className="text-4xl font-bold" onClick={() => setIsOpen(false)}>{item}</Link>
          ))}
          <Link href="/signup" className="mt-8 bg-blue-600 px-10 py-4 rounded-2xl font-bold text-xl">Get Started</Link>
        </div>
      )}
    </div>
  );
}