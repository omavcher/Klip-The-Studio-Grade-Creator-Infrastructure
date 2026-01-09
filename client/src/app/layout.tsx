import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Commercial-grade SEO Metadata
export const metadata: Metadata = {
  title: "Klip | Studio-Grade Remote Recording for Creators",
  description: "Capture 4K local source footage while you stream. The professional alternative for YouTubers, Teachers, and Podcasters.",
  keywords: ["Video Recording", "WebRTC", "Content Creation", "Podcast Studio", "4K Recording"],
  authors: [{ name: "Klip Team" }],
  icons: {
    icon: "/favicon.ico", // Ensure you add a favicon later
  },
};

// Optimizing for mobile and professional viewports
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000", // Dark theme for the "Studio" feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-blue-500/30`}
      >
        {/* Global Wrapper for Studio Overlays */}
        <div className="relative min-h-screen flex flex-col">
          
          {/* Main Content Area */}
          <main className="flex-grow">
            {children}
          </main>

          {/* This is where global notifications or "Recording Status" bars will live */}
          <div id="studio-notifications" className="fixed top-4 right-4 z-[9999]" />
        </div>
      </body>
    </html>
  );
}