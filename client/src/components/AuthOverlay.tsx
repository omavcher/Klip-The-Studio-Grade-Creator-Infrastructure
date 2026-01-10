"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, Mail, Lock, Chrome, Apple, Music as Spotify, 
  ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, RefreshCw 
} from 'lucide-react';

type AuthStep = 'login' | 'signup' | 'forgot' | 'otp' | 'reset' | 'success';

export default function AuthOverlay({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  // Logic: Handle Final Authentication
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'signup') {
      setMessage("Congratulations! Your Klip account is ready.");
      setStep('success');
    } else {
      const userData = { email, name: email.split('@')[0], isAuthenticated: true };
      localStorage.setItem('userData', JSON.stringify(userData));
      onAuthSuccess();
    }
  };

  // Logic: Handle OTP Sent
  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Password updated successfully.");
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] flex items-center justify-center font-sans overflow-hidden p-4">
      <div className="flex w-full max-w-[1000px] h-full max-h-[650px] bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        
        {/* LEFT PANEL: DYNAMIC AUTH CONTENT */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative overflow-y-auto no-scrollbar">
          
          <AnimatePresence mode="wait">
            {/* 1. LOGIN & SIGNUP FLOW */}
            {(step === 'login' || step === 'signup') && (
              <motion.div key="auth" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-black tracking-tightest mb-2 text-white">
                    {step === 'login' ? "Log in to Klip" : "Join Klip Studio"}
                  </h1>
                  <p className="text-zinc-500 text-sm font-bold">
                    {step === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setStep(step === 'login' ? 'signup' : 'login')} className="text-blue-500 ml-2 hover:underline">
                      {step === 'login' ? "Sign up" : "Log in"}
                    </button>
                  </p>
                </div>

                <div className="flex gap-4 mb-8">
                  <SocialBtn icon={<Chrome size={20} />} />
                  <SocialBtn icon={<Apple size={20} />} />
                  <SocialBtn icon={<Spotify size={20} />} />
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <Input icon={<Mail size={18}/>} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                  <Input icon={<Lock size={18}/>} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95">
                    {step === 'login' ? "Log in" : "Create Account"}
                  </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-4 text-center">
                  <button className="text-xs font-black text-blue-500/70 hover:text-blue-500 flex items-center gap-2"><Key size={14} /> SSO LOGIN</button>
                  <button onClick={() => setStep('forgot')} className="text-xs text-zinc-600 hover:text-zinc-400 font-bold underline underline-offset-4">Forgot password?</button>
                </div>
              </motion.div>
            )}

            {/* 2. FORGOT PASSWORD FLOW */}
            {step === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <button onClick={() => setStep('login')} className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4"><ArrowLeft size={16}/> Back</button>
                <h2 className="text-3xl font-black tracking-tightest">Reset password</h2>
                <p className="text-zinc-500 text-sm font-medium">Enter your email and we'll send you a 6-digit code.</p>
                <form onSubmit={handleForgot} className="space-y-4">
                  <Input icon={<Mail size={18}/>} type="email" placeholder="Email" />
                  <button type="submit" className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase">Send Code</button>
                </form>
              </motion.div>
            )}

            {/* 3. OTP VERIFICATION */}
            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center">
                <ShieldCheck size={48} className="text-blue-500 mx-auto" />
                <h2 className="text-2xl font-black">Check your email</h2>
                <p className="text-zinc-500 text-sm">We sent a code to <span className="text-white">{email || 'your email'}</span></p>
                <input 
                   maxLength={6} 
                   className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-6 text-center text-4xl font-black tracking-[0.5em] focus:border-blue-500 outline-none"
                   placeholder="000000"
                   onChange={(e) => e.target.value.length === 6 && setStep('reset')}
                />
                <button className="text-xs font-bold text-zinc-500 hover:text-white flex items-center gap-2 mx-auto"><RefreshCw size={12}/> Resend Code</button>
              </motion.div>
            )}

            {/* 4. SUCCESS MESSAGE */}
            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-black tracking-tightest uppercase italic">Done!</h2>
                <p className="text-zinc-400 font-medium">{message}</p>
                <button onClick={() => setStep('login')} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase">Back to login</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: PREVIEW */}
        <div className="hidden lg:flex w-1/2 bg-zinc-950 relative border-l border-white/5 overflow-hidden group">
            <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
               <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" alt="Studio" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
            </div>
            <div className="absolute bottom-12 left-12 right-12 bg-black/40 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-blue-600 rounded-lg"><Sparkles size={16} className="text-white" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Production Mode</span>
              </div>
              <p className="text-2xl font-black italic tracking-tighter text-white uppercase mb-2 leading-none">Studio quality. <br /> Zero lag.</p>
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
            </div>
        </div>
      </div>
    </div>
  );
}

// Helper: Custom Input with Icon
function Input({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors">{icon}</div>
      <input 
        required 
        className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700 font-medium" 
        {...props} 
      />
    </div>
  );
}

function SocialBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="flex-1 flex items-center justify-center py-3 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all active:scale-95 shadow-lg">
      {icon}
    </button>
  );
}