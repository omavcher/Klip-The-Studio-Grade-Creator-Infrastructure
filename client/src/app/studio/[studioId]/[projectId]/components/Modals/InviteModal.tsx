'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check, Mail, Link, Shield, UserPlus, Users, Globe, Lock } from 'lucide-react';

interface InviteModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  onSendInvite: (email: string) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  projectId,
  isOpen,
  onClose,
  inviteEmail,
  setInviteEmail,
  onSendInvite,
}) => {
  const [copied, setCopied] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<'link' | 'email'>('link');
  const [permissionLevel, setPermissionLevel] = useState<'viewer' | 'editor' | 'host'>('editor');

  const inviteLink = `https://klip.studio/join/${projectId}`;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSendInvite = () => {
    if (inviteEmail.trim()) {
      onSendInvite(inviteEmail);
    }
  };

  const permissionOptions = [
    { id: 'viewer', label: 'Viewer', description: 'Can watch only', icon: <Users size={16} /> },
    { id: 'editor', label: 'Editor', description: 'Can edit and collaborate', icon: <UserPlus size={16} /> },
    { id: 'host', label: 'Host', description: 'Full control', icon: <Globe size={16} /> },
  ];

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="bg-gradient-to-br from-[#121212] to-black border border-white/10 p-8 rounded-3xl max-w-lg w-full relative shadow-2xl shadow-blue-500/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-zinc-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={20}/>
        </button>
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Invite People
          </h2>
          <p className="text-zinc-400">Share this studio with others</p>
        </div>
        
        {/* Invite Method Tabs */}
        <div className="flex border-b border-white/5 mb-6">
          <button
            onClick={() => setInviteMethod('link')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              inviteMethod === 'link'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Link size={18} />
            Share Link
          </button>
          <button
            onClick={() => setInviteMethod('email')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              inviteMethod === 'email'
                ? 'text-blue-400 border-b-2 border-blue-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Mail size={18} />
            Email Invite
          </button>
        </div>

        {/* Content based on selected method */}
        {inviteMethod === 'link' ? (
          <div className="space-y-6">
            {/* Permission Settings */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300 block">Permission Level</label>
              <div className="grid grid-cols-3 gap-2">
                {permissionOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setPermissionLevel(option.id as any)}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                      permissionLevel === option.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    {option.icon}
                    <div className="text-xs font-medium">{option.label}</div>
                    <div className="text-[10px] text-zinc-500 text-center">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Share Link */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300 block">Share this link</label>
              <div className="flex gap-2 p-3 bg-zinc-900/50 rounded-xl border border-white/5">
                <input 
                  readOnly 
                  value={inviteLink} 
                  className="flex-1 bg-transparent outline-none text-zinc-300 text-sm truncate" 
                />
                <button 
                  onClick={copyInviteLink}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Anyone with this link can join your studio with {permissionLevel} permissions
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-2">
                <div className="text-lg">📱</div>
                <span className="text-sm">Share via SMS</span>
              </button>
              <button className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl hover:bg-zinc-800/50 transition-colors flex items-center justify-center gap-2">
                <div className="text-lg">💬</div>
                <span className="text-sm">Share via WhatsApp</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-300 block">Email addresses</label>
              <div className="flex gap-2">
                <input 
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com, colleague@company.com" 
                  className="flex-1 bg-zinc-900/50 p-4 rounded-xl border border-white/5 outline-none focus:border-blue-500/50 text-white placeholder-zinc-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendInvite()}
                />
                <button 
                  onClick={handleSendInvite}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  disabled={!inviteEmail.trim()}
                >
                  <Mail size={18} />
                  Send
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Separate multiple emails with commas
              </p>
            </div>

            {/* Email Template Preview */}
            <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm font-bold">KS</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Studio Invitation</p>
                  <p className="text-xs text-zinc-500">You're invited to join a recording session</p>
                </div>
              </div>
              <div className="text-sm text-zinc-300 mb-3">
                Hello! You've been invited to join <span className="text-blue-400">"{projectId}"</span> studio.
                Click the link below to join the session.
              </div>
              <div className="text-xs text-zinc-500">
                This invitation expires in 24 hours
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
            <Shield size={18} className="text-blue-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-300">Secure Studio</p>
              <p className="text-xs text-blue-400/70">All communications are end-to-end encrypted</p>
            </div>
            <Lock size={16} className="text-blue-400" />
          </div>
        </div>

        {/* Recent Invites */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-300">Recent Invites</span>
            <span className="text-xs text-zinc-500">3 pending</span>
          </div>
          <div className="space-y-2">
            {['alex@example.com', 'sarah@company.com', 'mike@team.com'].map((email, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Mail size={12} className="text-zinc-400" />
                  </div>
                  <span className="text-sm">{email}</span>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};