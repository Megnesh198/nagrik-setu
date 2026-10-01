'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, Cpu, Lock, Unlock, CheckCircle2, 
  Key, LogOut, Database, Users, Shield, FileText, Search, RefreshCw, X, Minus, Square
} from 'lucide-react';

interface Complaint {
  id: string;
  name: string;
  email: string;
  location: string;
  category: string;
  description: string;
  date: string;
  status: string;
  isFrozen?: boolean;
  unfreezeRequested?: boolean;
}

export default function HackerTechPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeModal, setActiveModal] = useState<'none' | 'adminDb' | 'userActivity'>('none');
  const [searchTerm, setSearchTerm] = useState('');

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'INITIALIZING SECURE SOCKET LAYER [SSL/TLS 1.3]...',
    'ESTABLISHING ENCRYPTED TUNNEL TO NAGRIKSETU CORE...',
    'AWAITING MUNICIPAL OPERATOR CREDENTIALS...'
  ]);

  useEffect(() => {
    // Check session storage authentication
    const isAdminAuth = sessionStorage.getItem('nagrik_admin_auth') === 'true';
    if (isAdminAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = () => {
      const saved = localStorage.getItem('nagrik_complaints');
      if (saved) {
        try {
          setComplaints(JSON.parse(saved));
        } catch {
          setComplaints([]);
        }
      }
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'techsrinix-2026' && passwordInput === 'Srinix@2026') {
      sessionStorage.setItem('nagrik_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      setTerminalLogs(prev => [
        'ROOT PRIVILEGES GRANTED FOR MUNICIPAL ADMIN NODE...',
        ...prev
      ]);
    } else {
      setLoginError('[ACCESS DENIED] Invalid Operator ID or Security Key.');
      setTerminalLogs(prev => [
        `[SECURITY WARNING] Failed login attempt for ID: ${usernameInput}`,
        ...prev
      ]);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nagrik_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setTerminalLogs(prev => [
      'SESSION TERMINATED BY OPERATOR.',
      ...prev
    ]);
  };

  const approveUnfreeze = (id: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, isFrozen: false, unfreezeRequested: false } : c);
    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    setTerminalLogs(prev => [
      `[EXEC_SUCCESS] UNFREEZE COMMAND DEPLOYED FOR RECORD: ${id}`,
      ...prev
    ]);
    alert(`[SECURE] Grievance ${id} successfully unfreezed and synced across nodes!`);
  };

  const pendingUnfreezes = complaints.filter(c => c.isFrozen && c.unfreezeRequested);

  // Agar user authenticated nahi hai, toh login portal render karega
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-emerald-500 font-mono flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-md w-full bg-zinc-950 border border-emerald-500/60 rounded-3xl p-8 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-950 border border-emerald-500 rounded-2xl text-emerald-400 shadow-inner">
              <Shield className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-sm font-black text-emerald-400 tracking-widest uppercase">NAGRIKSETU // ADMIN AUTH</h1>
            <p className="text-[10px] text-emerald-600">Enter secure operational credentials to access root node.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Operator ID</label>
              <div className="relative">
                <Users className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="techsrinix-2026"
                  className="w-full bg-black border border-emerald-800 rounded-xl pl-10 pr-4 py-3 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Security Key / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                <input 
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black border border-emerald-800 rounded-xl pl-10 pr-4 py-3 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-[11px] text-red-400 bg-red-950/40 border border-red-900 p-2.5 rounded-xl font-mono text-center">
                {loginError}
              </p>
            )}

            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest transition cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>Authenticate & Initialize</span>
            </button>
          </form>

          <div className="bg-black p-3 rounded-xl border border-emerald-950 text-[10px] text-emerald-600 space-y-1 font-mono">
            <p className="text-emerald-500 font-bold">&gt; SYSTEM LOG:</p>
            {terminalLogs.slice(0, 2).map((log, idx) => (
              <p key={idx} className="truncate">&bull; {log}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredComplaints = complaints.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-emerald-500 font-mono flex flex-col selection:bg-emerald-500 selection:text-black">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* macOS Style Header Bar */}
      <header className="bg-zinc-950 border-b border-emerald-500/40 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_20px_rgba(16,185,129,0.1)]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleLogout}
              className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition flex items-center justify-center group cursor-pointer shadow-sm"
              title="Close Session & Logout"
            >
              <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition" />
            </button>
            <button 
              onClick={() => alert('[SYSTEM] Terminal minimized.')}
              className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 transition flex items-center justify-center group cursor-pointer shadow-sm"
              title="Minimize"
            >
              <Minus className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition" />
            </button>
            <button 
              onClick={() => alert('[SYSTEM] Terminal maximized.')}
              className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 transition flex items-center justify-center group cursor-pointer shadow-sm"
              title="Maximize"
            >
              <Square className="w-2 h-2 text-black opacity-0 group-hover:opacity-100 transition" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-emerald-950"></div>

          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-emerald-950 border border-emerald-500 rounded-lg text-emerald-400">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xs font-black tracking-wider text-emerald-400">NAGRIKSETU // ADMIN-COMMAND</h1>
                <span className="bg-emerald-950 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">ONLINE</span>
              </div>
              <p className="text-[9px] text-emerald-600">OPERATOR: techsrinix-2026 &bull; ROOT NODE SECURED</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Terminate Session</span>
        </button>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setActiveModal('adminDb')}
            className="bg-zinc-950 hover:bg-emerald-950/40 border border-emerald-500/60 p-5 rounded-2xl flex items-center space-x-4 transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)] group text-left"
          >
            <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-400 group-hover:scale-110 transition">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider">Access Admin Database Core</h3>
              <p className="text-[10px] text-emerald-600">Inspect raw JSON records, status flags, and system telemetry</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveModal('userActivity')}
            className="bg-zinc-950 hover:bg-emerald-950/40 border border-emerald-500/60 p-5 rounded-2xl flex items-center space-x-4 transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)] group text-left"
          >
            <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-400 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-black text-emerald-300 uppercase tracking-wider">Inspect User Activity Database</h3>
              <p className="text-[10px] text-emerald-600">View user submissions, contact trails, and grievance history</p>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl p-5 space-y-1 shadow-md">
            <p className="text-[10px] text-emerald-600 uppercase font-bold">Encrypted Queue Status</p>
            <h3 className="text-2xl font-black text-emerald-400">{pendingUnfreezes.length} Pending</h3>
            <p className="text-[10px] text-emerald-500">Admin Unfreeze Requests Awaiting Auth</p>
          </div>

          <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl p-5 space-y-1 shadow-md">
            <p className="text-[10px] text-emerald-600 uppercase font-bold">Total System Records</p>
            <h3 className="text-2xl font-black text-emerald-400">{complaints.length} Records</h3>
            <p className="text-[10px] text-emerald-500">Synced across Municipal Database</p>
          </div>

          <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl p-5 space-y-1 shadow-md">
            <p className="text-[10px] text-emerald-600 uppercase font-bold">Terminal Security</p>
            <h3 className="text-2xl font-black text-emerald-400">LEVEL 5 ROOT</h3>
            <p className="text-[10px] text-emerald-500">Full Database Privileges Enabled</p>
          </div>
        </div>

        <div className="bg-zinc-950 border border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-900 pb-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-emerald-400 animate-pulse" />
              <div>
                <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Incoming Unfreeze Authorization Queue</h2>
                <p className="text-[10px] text-emerald-600">Verify field evidence and execute unfreeze protocol.</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-3 py-1 rounded border border-emerald-500/40">
              SECURE PORTAL
            </span>
          </div>

          <div className="space-y-4">
            {pendingUnfreezes.length === 0 ? (
              <div className="text-emerald-700 text-xs py-16 text-center bg-black rounded-2xl border border-emerald-950">
                [NO PENDING UNFREEZE REQUESTS IN QUEUE]
              </div>
            ) : (
              pendingUnfreezes.map((item) => (
                <div key={item.id} className="bg-black border border-emerald-500/50 rounded-2xl p-6 space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-950 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-black text-black bg-emerald-500 px-3 py-1 rounded font-mono">{item.id}</span>
                      <div>
                        <h4 className="text-xs font-black text-emerald-300">{item.name} <span className="text-[10px] text-emerald-600 font-normal">({item.email})</span></h4>
                        <p className="text-[11px] text-emerald-500">Location: <span className="text-emerald-300 font-bold">{item.location}</span></p>
                      </div>
                    </div>

                    <button 
                      onClick={() => approveUnfreeze(item.id)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center space-x-2"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Execute Unfreeze Protocol</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-emerald-400">CATEGORY: {item.category}</p>
                    <p className="text-[11px] text-emerald-300 bg-zinc-950 p-3.5 rounded-xl border border-emerald-900 font-mono">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>SYSTEM TERMINAL ACTIVITY LOG</span>
          </div>
          <div className="bg-black p-4 rounded-xl border border-emerald-950 text-[11px] text-emerald-400 space-y-1 font-mono h-32 overflow-y-auto">
            {terminalLogs.map((log, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-emerald-700">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-emerald-500 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden">
            
            <div className="bg-zinc-900 border-b border-emerald-900 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition cursor-pointer" onClick={() => setActiveModal('none')}></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 transition cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 transition cursor-pointer"></div>
                </div>
                <div className="h-4 w-[1px] bg-emerald-900"></div>
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-black text-emerald-300 uppercase tracking-widest">
                    {activeModal === 'adminDb' ? 'ADMIN MASTER DATABASE CORE [RAW JSON]' : 'USER ACTIVITY DATABASE TRAIL'}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal('none')}
                className="bg-red-950 text-red-400 border border-red-800 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-900 cursor-pointer flex items-center space-x-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>CLOSE</span>
              </button>
            </div>

            <div className="p-6 border-b border-emerald-900/50 bg-zinc-900/50 flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter records by ID, name, location or email..." 
                  className="w-full bg-black border border-emerald-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950 px-3 py-2 rounded-xl border border-emerald-800">
                TOTAL: {filteredComplaints.length} RECORDS
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredComplaints.length === 0 ? (
                <div className="text-center text-emerald-700 py-16 text-xs">
                  [NO MATCHING RECORDS FOUND IN LOCAL STORAGE MUNICIPAL DB]
                </div>
              ) : (
                filteredComplaints.map((item) => (
                  <div key={item.id} className="bg-black border border-emerald-500/40 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-emerald-950 text-emerald-400 text-xs font-black px-2.5 py-1 rounded border border-emerald-800">{item.id}</span>
                        <div>
                          <p className="text-xs font-bold text-emerald-300">{item.name} <span className="text-[10px] text-emerald-600 font-normal">({item.email})</span></p>
                          <p className="text-[10px] text-emerald-500">Location: {item.location} | Date: {item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${item.isFrozen ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'}`}>
                          {item.isFrozen ? 'FROZEN' : 'ACTIVE / RESOLVED'}
                        </span>
                        <span className="text-[10px] font-bold bg-zinc-900 text-emerald-400 px-2.5 py-1 rounded border border-emerald-800">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div className="bg-zinc-950 p-3 rounded-xl border border-emerald-950 space-y-1">
                        <span className="text-emerald-600 uppercase text-[9px] font-bold">Category:</span>
                        <p className="text-emerald-300 font-bold">{item.category}</p>
                      </div>
                      <div className="bg-zinc-950 p-3 rounded-xl border border-emerald-950 space-y-1">
                        <span className="text-emerald-600 uppercase text-[9px] font-bold">Description / Issue:</span>
                        <p className="text-emerald-300">{item.description}</p>
                      </div>
                    </div>

                    {activeModal === 'adminDb' && (
                      <div className="bg-zinc-950/80 p-3 rounded-xl border border-emerald-950 text-[10px] font-mono text-emerald-500 overflow-x-auto">
                        <code>{JSON.stringify(item, null, 2)}</code>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="bg-black border-t border-emerald-900 px-6 py-3 text-[10px] text-emerald-600 flex justify-between">
              <span>DATABASE CONNECTOR: LOCAL_STORAGE_ACTIVE</span>
              <span>SECURE MUNICIPAL NODE // ROOT ACCESS</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}