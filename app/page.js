"use client";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import Header from "@/components/Header";
import MainContent from "@/components/MainContent";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col overflow-hidden">
        {/* Background Video */}
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/main-bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-purple-black/60"></div>
        </div>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <MainContent />
      </div>
    </LanguageProvider>
  );
}
