'use client';

import React, { useState } from 'react';
import { Landmark, ShieldCheck, FileText, Church, Palette, ArrowRight, User, LogIn, UserPlus, X } from 'lucide-react';

export default function Home() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;

    localStorage.setItem('nagrik_user_email', email);
    localStorage.setItem('nagrik_user_pass', password);
    localStorage.setItem('nagrik_user_name', name);

    alert('Registration successful! Please login with your registered email and password.');
    setAuthModal('login');
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedEmail = localStorage.getItem('nagrik_user_email');
    const savedPass = localStorage.getItem('nagrik_user_pass');
    const savedName = localStorage.getItem('nagrik_user_name') || 'Citizen';

    if (email === savedEmail && password === savedPass) {
      setIsLoggedIn(true);
      setLoggedInUser(savedName);
      setAuthModal(null);
      alert(`Welcome back, ${savedName}! You are now successfully logged in.`);
    } else {
      if (!savedEmail && email && password) {
        localStorage.setItem('nagrik_user_email', email);
        localStorage.setItem('nagrik_user_pass', password);
        setIsLoggedIn(true);
        setLoggedInUser(email.split('@')[0]);
        setAuthModal(null);
        alert('Login successful!');
      } else {
        alert('Invalid email or password. Please check your credentials or register first.');
      }
    }
  };

  const handleRaiseGrievanceClick = () => {
    if (!isLoggedIn) {
      alert('Please Login or Register first to raise and track your grievances.');
      setAuthModal('login');
    } else {
      window.location.href = '/user';
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f5f1] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative">
      {/* Tricolor Top Accent Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500"></div>

      {/* Header */}
      <header className="bg-white/95 border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-orange-600 via-amber-600 to-emerald-600 p-0.5 rounded-2xl shadow-md">
            <div className="bg-white p-2 rounded-[14px]">
              <Landmark className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-wide text-slate-900">NagrikSetu</h1>
              <span className="bg-orange-500/10 text-orange-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-orange-500/30">Srinivix College of Engineering</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">IN NATIONAL PUBLIC SERVICE & UTILITY PORTAL</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 shadow-sm">
              <User className="w-4 h-4 text-emerald-600" />
              <span>{loggedInUser}</span>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setAuthModal('login')}
                className="bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer inline-flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
              <button 
                onClick={() => setAuthModal('register')}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer inline-flex items-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Now</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-between p-6 md:p-12 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-6 pt-6">
          <div className="inline-flex items-center space-x-2 bg-orange-100/80 border border-orange-300 px-4 py-1.5 rounded-full text-orange-800 text-xs font-extrabold tracking-wider shadow-xs">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>HERITAGE INSPIRED &bull; ADVANCED TECHNOLOGY &bull; SMART GOVERNANCE</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Empowering Citizens, <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
              Bridging Governance
            </span>
          </h2>

          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            A secure, state-inspired platform connecting citizens with administration and field technicians to resolve civic issues with verified accountability and AI assistance across all Indian regions.
          </p>

          <div className="pt-3">
            <button 
              onClick={handleRaiseGrievanceClick}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-xl transition inline-flex items-center space-x-2 cursor-pointer transform hover:scale-105"
            >
              <span>Raise a Grievance</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-md space-y-3 hover:shadow-lg transition">
            <div className="bg-orange-50 p-3 rounded-2xl w-fit border border-orange-200">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Pan-India Validity</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">Strictly validates locations and authentic PIN codes across all states and union territories.</p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-md space-y-3 hover:shadow-lg transition">
            <div className="bg-amber-50 p-3 rounded-2xl w-fit border border-amber-200">
              <Church className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Smart Routing</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">Automated grievance categorization and swift routing to appropriate municipal departments.</p>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-md space-y-3 hover:shadow-lg transition">
            <div className="bg-emerald-50 p-3 rounded-2xl w-fit border border-emerald-200">
              <Palette className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Transparent Service</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">Real-time status updates with complete accountability and reward points system.</p>
          </div>
        </div>

        {/* Institutional Copyright Footer */}
        <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-600 pb-4 space-y-1">
          <p className="font-bold text-slate-700">Truth Alone Triumphs &bull; Srinivix College of Engineering &bull; NagrikSetu Smart Governance Initiative</p>
          <p>© 2026 Srinivix College of Engineering. All rights reserved.</p>
        </div>
      </main>

      {/* Auth Modal (Login / Register) */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                {authModal === 'register' ? <UserPlus className="w-5 h-5 text-orange-600" /> : <LogIn className="w-5 h-5 text-orange-600" />}
                <span>{authModal === 'register' ? 'Register New Citizen Account' : 'Citizen Portal Login'}</span>
              </h3>
              <button onClick={() => setAuthModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={authModal === 'register' ? handleRegister : handleLogin} className="space-y-4">
              {authModal === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email ID..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="Enter your secure password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition cursor-pointer"
              >
                {authModal === 'register' ? 'Register Account' : 'Login to Dashboard'}
              </button>

              <div className="text-center pt-2">
                {authModal === 'register' ? (
                  <p className="text-xs text-slate-500 font-medium">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setAuthModal('login')} className="text-orange-600 font-bold hover:underline cursor-pointer">
                      Login here
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setAuthModal('register')} className="text-orange-600 font-bold hover:underline cursor-pointer">
                      Register Now
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}