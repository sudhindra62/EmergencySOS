import React from "react";
import {
  Shield,
  Activity,
  MapPin,
  Zap,
  Bot,
  ArrowRight,
  HeartPulse,
} from "lucide-react";

export default function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="min-h-screen bg-[#020512] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Premium Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-rose-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay opacity-20 pointer-events-none"></div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl w-full px-6 py-12 flex flex-col items-center text-center">
        {/* Logo Mark */}
        <div className="relative mb-8 animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse" />
          <div className="w-20 h-20 bg-gradient-to-br from-[#0c1a38] to-[#040b1c] border border-blue-500/30 rounded-2xl flex items-center justify-center relative shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <Shield className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
          </div>
        </div>

        {/* Hero Typography */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">
            RoadGuardian AI
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-light text-slate-400 mb-4 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
          Agentic AI Golden Hour Emergency Response
        </p>
        <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] mb-12 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]" />
          <span className="text-rose-400">10-Agent Autonomous Network</span>
        </div>

        {/* Action Button */}
        <button
          onClick={onLaunch}
          className="group relative px-8 py-4 mb-20 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-700"
        >
          <div className="absolute inset-0 bg-blue-600 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-3 bg-gradient-to-b from-blue-500 to-blue-700 border border-blue-400/50 hover:bg-gradient-to-b hover:from-blue-400 hover:to-blue-600 text-white font-bold rounded-full px-8 py-4 uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(37,99,235,0.5)] transform group-hover:scale-105">
            Launch Platform
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-1000">
          
          {/* Box 1: Golden Hour Routing */}
          <div className="relative group h-full hover:-translate-y-2 transition-transform duration-500">
            {/* Lightning Blur Glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-rose-500 via-pink-600 to-red-500 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 group-hover:blur-xl animate-pulse transition-all duration-500" />
            {/* Hard Lightning Edge */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-rose-500 via-pink-600 to-red-500 rounded-3xl opacity-100 transition-all duration-500" />
            
            {/* Inner Content Container */}
            <div className="relative h-full bg-slate-950/95 backdrop-blur-2xl rounded-[22px] p-8 flex flex-col z-10 border border-white/5">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500/20 to-pink-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/30 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all duration-500">
                <HeartPulse className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-rose-200 mb-3">
                Golden Hour Routing
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Real-time PostGIS dispatch engine prioritizing Level 1 Trauma
                centers based on AI-assessed injury severity.
              </p>
            </div>
          </div>

          {/* Box 2: Multi-Agent Swarm */}
          <div className="relative group h-full hover:-translate-y-2 transition-transform duration-500">
            {/* Lightning Blur Glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-600 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 group-hover:blur-xl animate-pulse transition-all duration-500" style={{ animationDelay: '200ms' }} />
            {/* Hard Lightning Edge */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-600 rounded-3xl opacity-100 transition-all duration-500" />
            
            {/* Inner Content Container */}
            <div className="relative h-full bg-slate-950/95 backdrop-blur-2xl rounded-[22px] p-8 flex flex-col z-10 border border-white/5">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-500">
                <Bot className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 mb-3">
                Multi-Agent Swarm
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                10 autonomous agents orchestrating police, ambulance, routing, and
                family notifications concurrently.
              </p>
            </div>
          </div>

          {/* Box 3: Resilient Edge */}
          <div className="relative group h-full hover:-translate-y-2 transition-transform duration-500">
            {/* Lightning Blur Glow */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-600 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 group-hover:blur-xl animate-pulse transition-all duration-500" style={{ animationDelay: '400ms' }} />
            {/* Hard Lightning Edge */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-600 rounded-3xl opacity-100 transition-all duration-500" />
            
            {/* Inner Content Container */}
            <div className="relative h-full bg-slate-950/95 backdrop-blur-2xl rounded-[22px] p-8 flex flex-col z-10 border border-white/5">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/30 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all duration-500">
                <Zap className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-200 mb-3">
                Resilient Edge
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Offline cryptography module compressing incident reports to
                160-character hashes for remote operations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-6 left-0 w-full text-center text-xs text-slate-600 font-bold uppercase tracking-[0.2em] pointer-events-none">
        Developed for Government-Grade Emergency Infrastructure
      </div>
    </div>
  );
}
