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
          <div className="relative group h-full hover:-translate-y-2 transition-transform duration-700">
            {/* Massive Ambient Outer Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 rounded-[26px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* 2px Bright Premium Border Wrapper */}
            <div className="relative h-full p-[2px] rounded-[26px] bg-gradient-to-br from-rose-400 via-rose-600 to-rose-900/30 group-hover:from-white group-hover:via-rose-400 group-hover:to-rose-800 transition-colors duration-700 shadow-[inset_0_0_20px_rgba(244,63,94,0.3)]">
              {/* Inner Card Body */}
              <div className="relative h-full bg-gradient-to-br from-[#050b1a] to-[#020512] backdrop-blur-2xl rounded-[24px] p-8 flex flex-col overflow-hidden z-10 shadow-[inset_0_1px_20px_rgba(244,63,94,0.15)] group-hover:shadow-[inset_0_2px_40px_rgba(244,63,94,0.4)] transition-all duration-700">
                
                {/* Glossy Top Glass Reflection */}
                <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                
                {/* Intense Inner Top Glow */}
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-rose-500/25 to-transparent pointer-events-none blur-2xl" />
                
                {/* Glowing Icon Container */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-rose-400/10 to-pink-600/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-300/30 group-hover:scale-110 group-hover:bg-rose-400/20 transition-all duration-500 shadow-[0_0_30px_rgba(244,63,94,0.4)] group-hover:shadow-[0_0_50px_rgba(244,63,94,0.8)] backdrop-blur-md">
                  <HeartPulse className="w-8 h-8 text-rose-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </div>
                
                {/* Text Content */}
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-rose-100 to-rose-400 mb-3 drop-shadow-sm">
                  Golden Hour Routing
                </h3>
                <p className="text-sm text-rose-100/70 leading-relaxed font-medium">
                  Real-time PostGIS dispatch engine prioritizing Level 1 Trauma
                  centers based on AI-assessed injury severity.
                </p>
              </div>
            </div>
          </div>

          {/* Box 2: Multi-Agent Swarm */}
          <div className="relative group h-full hover:-translate-y-2 transition-transform duration-700">
            {/* Massive Ambient Outer Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-[26px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" style={{ animationDelay: '200ms' }} />
            
            {/* 2px Bright Premium Border Wrapper */}
            <div className="relative h-full p-[2px] rounded-[26px] bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-900/40 group-hover:from-white group-hover:via-cyan-400 group-hover:to-blue-800 transition-colors duration-700 shadow-[inset_0_0_20px_rgba(6,182,212,0.3)]">
              {/* Inner Card Body */}
              <div className="relative h-full bg-gradient-to-br from-[#050b1a] to-[#020512] backdrop-blur-2xl rounded-[24px] p-8 flex flex-col overflow-hidden z-10 shadow-[inset_0_1px_20px_rgba(6,182,212,0.15)] group-hover:shadow-[inset_0_2px_40px_rgba(6,182,212,0.4)] transition-all duration-700">
                
                {/* Glossy Top Glass Reflection */}
                <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                
                {/* Intense Inner Top Glow */}
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-cyan-500/25 to-transparent pointer-events-none blur-2xl" />
                
                {/* Glowing Icon Container */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-300/30 group-hover:scale-110 group-hover:bg-cyan-400/20 transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] backdrop-blur-md">
                  <Bot className="w-8 h-8 text-cyan-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </div>
                
                {/* Text Content */}
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-cyan-400 mb-3 drop-shadow-sm">
                  Multi-Agent Swarm
                </h3>
                <p className="text-sm text-cyan-100/70 leading-relaxed font-medium">
                  10 autonomous agents orchestrating police, ambulance, routing, and
                  family notifications concurrently.
                </p>
              </div>
            </div>
          </div>

          {/* Box 3: Resilient Edge */}
          <div className="relative group h-full hover:-translate-y-2 transition-transform duration-700">
            {/* Massive Ambient Outer Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 rounded-[26px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" style={{ animationDelay: '400ms' }} />
            
            {/* 2px Bright Premium Border Wrapper */}
            <div className="relative h-full p-[2px] rounded-[26px] bg-gradient-to-br from-amber-300 via-amber-500 to-orange-900/40 group-hover:from-white group-hover:via-amber-400 group-hover:to-orange-800 transition-colors duration-700 shadow-[inset_0_0_20px_rgba(245,158,11,0.3)]">
              {/* Inner Card Body */}
              <div className="relative h-full bg-gradient-to-br from-[#050b1a] to-[#020512] backdrop-blur-2xl rounded-[24px] p-8 flex flex-col overflow-hidden z-10 shadow-[inset_0_1px_20px_rgba(245,158,11,0.15)] group-hover:shadow-[inset_0_2px_40px_rgba(245,158,11,0.4)] transition-all duration-700">
                
                {/* Glossy Top Glass Reflection */}
                <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                
                {/* Intense Inner Top Glow */}
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-amber-500/25 to-transparent pointer-events-none blur-2xl" />
                
                {/* Glowing Icon Container */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400/10 to-orange-600/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-300/30 group-hover:scale-110 group-hover:bg-amber-400/20 transition-all duration-500 shadow-[0_0_30px_rgba(245,158,11,0.4)] group-hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] backdrop-blur-md">
                  <Zap className="w-8 h-8 text-amber-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </div>
                
                {/* Text Content */}
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-100 to-amber-400 mb-3 drop-shadow-sm">
                  Resilient Edge
                </h3>
                <p className="text-sm text-amber-100/70 leading-relaxed font-medium">
                  Offline cryptography module compressing incident reports to
                  160-character hashes for remote operations.
                </p>
              </div>
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
