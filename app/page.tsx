'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen text-gray-900 relative overflow-hidden animated-tricolor-bg flex flex-col justify-between">
      
      {/* Traditional Indian Motifs & Moving Tricolor Animation Styles */}
      <style jsx global>{`
        @keyframes tricolorWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-tricolor-bg {
          background: linear-gradient(-45deg, rgba(255,153,51,0.25), rgba(255,255,255,0.9), rgba(19,136,8,0.25), rgba(255,153,51,0.25));
          background-size: 400% 400%;
          animation: tricolorWave 14s ease infinite;
        }
      `}</style>

      {/* Top Royal Tricolor Strip Bar */}
      <div className="h-3 w-full bg-gradient-to-r from-orange-600 via-amber-200 to-emerald-700 fixed top-0 z-50 shadow-lg"></div>

      {/* Top Header Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-orange-300 shadow-md sticky top-3 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-700 text-white p-2.5 rounded-xl font-bold text-xl shadow-lg border border-amber-300 flex items-center justify-center">
              NS
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-orange-700 via-amber-800 to-emerald-800 bg-clip-text text-transparent">
                NagrikSetu
              </h1>
              <p className="text-[11px] text-orange-700 font-bold uppercase tracking-wider">
                🇮🇳 National Public Service & Utility Portal
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="text-sm font-extrabold text-orange-900 hover:text-orange-950 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition shadow-sm border border-orange-300"
            >
              Login
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="text-sm font-extrabold text-white bg-gradient-to-r from-orange-600 to-emerald-700 hover:from-orange-700 hover:to-emerald-800 px-4 py-2 rounded-xl transition shadow-md border border-amber-300"
            >
              Register Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-16 text-center relative z-10 space-y-8 my-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 via-amber-100 to-emerald-100 border-2 border-orange-300 px-4 py-1.5 rounded-full shadow-md">
          <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
          <span className="text-xs font-black text-orange-900 uppercase tracking-widest">
            ✨ Heritage Inspired • Advanced Technology • Smart Governance ✨
          </span>
        </div>

        {/* Main Headings */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 leading-tight">
            Empowering <span className="bg-gradient-to-r from-orange-600 via-amber-700 to-emerald-700 bg-clip-text text-transparent">Citizens</span>, <br />
            Bridging <span className="bg-gradient-to-r from-emerald-700 via-amber-700 to-orange-600 bg-clip-text text-transparent">Governance</span>
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-700 font-medium leading-relaxed">
            A secure, state-inspired platform connecting citizens with administration and field technicians to resolve civic issues with verified accountability and AI assistance across all Indian regions.
          </p>
        </div>

        {/* Action Button - Single Centered */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full sm:w-auto flex items-center justify-center font-extrabold px-10 py-4 rounded-2xl shadow-xl transition transform active:scale-95 text-white bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 hover:from-orange-700 hover:to-emerald-800 border-2 border-amber-300 text-base"
          >
            <span>Raise a Grievance</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="bg-white/80 backdrop-blur p-5 rounded-2xl border-2 border-orange-200 shadow-lg space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black border border-orange-300">🇮🇳</div>
            <h3 className="font-extrabold text-gray-900 text-base">Pan-India Validity</h3>
            <p className="text-xs text-gray-600 font-medium">Strictly validates locations and authentic PIN codes across all states and union territories.</p>
          </div>

          <div className="bg-white/80 backdrop-blur p-5 rounded-2xl border-2 border-amber-200 shadow-lg space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black border border-amber-300">⚡</div>
            <h3 className="font-extrabold text-gray-900 text-base">AI Smart Routing</h3>
            <p className="text-xs text-gray-600 font-medium">Automated grievance categorization and swift routing to appropriate municipal departments.</p>
          </div>

          <div className="bg-white/80 backdrop-blur p-5 rounded-2xl border-2 border-emerald-200 shadow-lg space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black border border-emerald-300">🛡️</div>
            <h3 className="font-extrabold text-gray-900 text-base">Transparent Service</h3>
            <p className="text-xs text-gray-600 font-medium">Real-time status updates with complete accountability and reward points system.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs font-bold text-orange-900 bg-white/60 backdrop-blur border-t border-orange-200 mt-12">
        <p>✨ Truth Alone Triumphs • NagrikSetu Smart Governance Initiative ✨</p>
      </footer>

    </div>
  );
}