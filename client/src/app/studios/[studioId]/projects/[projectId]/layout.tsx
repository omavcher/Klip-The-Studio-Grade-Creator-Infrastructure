import Sidebar from '@/components/dashboard/Sidebar';
import React from 'react';

/**
 * KLIP STUDIO WORKSPACE LAYOUT
 * Optimized for high-fidelity media production.
 */
export default function StudioProjectLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    // 1. Root Container: Force-locks the viewport to prevent body scroll
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden selection:bg-blue-500/30">
      
      {/* 2. PERSISTENT SIDEBAR
          Handles its own internal minimize/maximize state and mobile drawer logic. */}
      <Sidebar />

      {/* 3. DYNAMIC WORKSPACE
          The 'flex-1' ensures it fills all remaining space when the sidebar minimizes. */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        
        {/* MOBILE TOP-PADDING
            Adjusts for the mobile header height (h-16) to prevent content overlap. */}
        <div className="flex-1 overflow-y-auto no-scrollbar pt-16 md:pt-0">
          
          {/* CONTENT WRAPPER
              We remove the fixed 'p-12' here because the Riverside-style 
              Studio page handles its own inner padding and full-bleed panels. */}
          <div className="h-full w-full">
            {children}
          </div>
        </div>

        {/* OPTIONAL: GLOBAL STUDIO STATUS BAR
            Perfect for showing "Uploading 4K Source..." globally across the studio. */}
        <div id="studio-status-portal" className="fixed bottom-0 right-0 z-[100]" />
      </main>
    </div>
  );
}