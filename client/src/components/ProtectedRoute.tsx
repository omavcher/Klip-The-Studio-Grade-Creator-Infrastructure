"use client";
import React, { useState, useEffect } from 'react';
import AuthOverlay from './AuthOverlay';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check local storage on mount
    const data = localStorage.getItem('userData');
    if (data) {
      const user = JSON.parse(data);
      setIsAuthenticated(!!user.isAuthenticated);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Loading state to prevent flicker
  if (isAuthenticated === null) return <div className="h-screen bg-black" />;

  // If not authenticated, show the login layout component
  if (!isAuthenticated) {
    return <AuthOverlay onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  // If authenticated, show the protected page content
  return <>{children}</>;
}