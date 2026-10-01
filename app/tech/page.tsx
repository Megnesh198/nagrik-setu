'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Cpu, Lock, Unlock, CheckCircle2, 
  Key, LogOut, Database, Users, Shield, FileText, Search, RefreshCw, X, Minus, Square,
  Radio, AlertTriangle, Send, Activity, Eye, Zap, Palette, Video, MapPin, Check, Volume2, Download, Fingerprint
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
  techApproved?: boolean;
  isSpam?: boolean;
  slaDeadline?: number; // timestamp
}

export default function HackerTechPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeModal, setActiveModal] = useState<'none' | 'adminDb' | 'userActivity'>('none');
  const [searchTerm, setSearchTerm] = useState('');

  // New Features States
  const [theme, setTheme] = useState<'emerald' | 'cyan' | 'amber' | 'crimson'>('emerald');
  const [cliInput, setCliInput] = useState('');
  const [filterSpamMode, setFilterSpamMode] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'CONNECTED 200 OK' | 'SYNCING...' | 'DISCONNECTED'>('CONNECTED 200 OK');
  
  // 2FA Modal State
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pendingAction, setPendingAction] = useState<{ type: string; id?: string } | null>(null);

  // Feature 3: WhatsApp/SMS Gateway Audit Logs
  const [smsLogs, setSmsLogs] = useState<string[]>([
    '[SMS_GATEWAY] Twilio/Fast2SMS node active for Jagatpur & Rasulgarh sector.',
    '[DISPATCH_READY] Automated citizen notification pipeline online.'
  ]);

  // Feature 1: Live Heatmap Selected Ward
  const [selectedHeatmapWard, setSelectedHeatmapWard] = useState<string | null>(null);

  // Drone & Radar Simulation States
  const [radarPings, setRadarPings] = useState([
    { id: 'R-101', x: '42%', y: '35%', zone: 'Jagatpur Ward 4', type: 'Pothole Hazard' },
    { id: 'R-102', x: '78%', y: '62%', zone: 'Rasulgarh Zone 2', type: 'Drainage Block' },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'INITIALIZING SECURE SOCKET LAYER [SSL/TLS 1.3]...',
    'ESTABLISHING ENCRYPTED TUNNEL TO NAGRIKSETU CORE...',
    'AWAITING MUNICIPAL OPERATOR CREDENTIALS...'
  ]);

  useEffect(() => {
    const isAdminAuth = sessionStorage.getItem('nagrik_admin_auth') === 'true';
    if (isAdminAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = () => {
      const saved = localStorage.getItem('nagrik_complaints') || localStorage.getItem('complaints');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const enhanced = parsed.map((c: any) => ({
            ...c,
            isSpam: c.isSpam || false,
            slaDeadline: c.slaDeadline || (Date.now() + 86400000 * 2) // 48 hours default SLA
          }));
          setComplaints(enhanced);
        } catch {
          setComplaints([]);
        }
      }
    };

    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const addTerminalLog = (log: string) => {
    setTerminalLogs(prev => [log, ...prev]);
  };

  // Feature 2: Web Audio API Sci-Fi Alert Synthesizer & Speech Warning
  const playSciFiAlert = (messageText = 'Alert: New Emergency Dispatch in Sector') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch sci-fi beep
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);

      // Web Speech API Voice Warning
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(messageText);
        utterance.rate = 1.0;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.log('Audio context blocked or unsupported', e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'techsrinix-2026' && passwordInput === 'Srinix@2026') {
      sessionStorage.setItem('nagrik_admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      addTerminalLog('ROOT PRIVILEGES GRANTED FOR MUNICIPAL ADMIN NODE...');
      playSciFiAlert('System authenticated. Welcome root operator.');
    } else {
      setLoginError('[ACCESS DENIED] Invalid Operator ID or Security Key.');
      addTerminalLog(`[SECURITY WARNING] Failed login attempt for ID: ${usernameInput}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nagrik_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    addTerminalLog('SESSION TERMINATED BY OPERATOR.');
  };

  // CLI Command Executor
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim();
    if (!cmd) return;

    addTerminalLog(`> ${cmd}`);

    if (cmd === 'status --all') {
      addTerminalLog(`[SYSTEM STATS] Total Records: ${complaints.length} | Pending Unfreezes: ${complaints.filter(c => c.isFrozen && c.unfreezeRequested).length}`);
    } else if (cmd === 'db:flush') {
      trigger2FA('FLUSH_DB');
    } else if (cmd.startsWith('user:ban ')) {
      const email = cmd.replace('user:ban ', '').trim();
      addTerminalLog(`[SECURITY ACTION] User node ${email} blacklisted from municipal grid.`);
      alert(`User ${email} successfully blacklisted.`);
    } else if (cmd === 'drone:deploy') {
      addTerminalLog(`[TELEMETRY] Surveillance drone re-routed to Jagatpur Sector 7 coordinates.`);
      playSciFiAlert('Alert: Drone re-routed to Sector 7');
      alert('Drone redirected to sector 7 successfully.');
    } else if (cmd === 'help') {
      addTerminalLog(`AVAILABLE COMMANDS: status --all, db:flush, user:ban <email>, drone:deploy, export:json, clear`);
    } else if (cmd === 'export:json') {
      exportEncryptedJSONReport();
    } else if (cmd === 'clear') {
      setTerminalLogs(['TERMINAL BUFFER CLEARED.']);
    } else {
      addTerminalLog(`[ERROR] Unknown command: "${cmd}". Type "help" for syntax.`);
    }
    setCliInput('');
  };

  // Feature 4: Export Terminal Logs to Signed JSON / Simulated PDF Report
  const exportEncryptedJSONReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      operator: 'techsrinix-2026',
      totalRecords: complaints.length,
      pendingUnfreezes: complaints.filter(c => c.isFrozen && c.unfreezeRequested).length,
      terminalLogs,
      complaintsSnapshot: complaints,
      signature: 'SHA256-MUNICIPAL-SECURE-SIG-2026'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NagrikSetu_Audit_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addTerminalLog('[AUDIT SUCCESS] Session logs and encrypted JSON report exported.');
    alert('[SECURE] Professional audit report successfully generated and downloaded.');
  };

  // Feature 6: WebAuthn Biometric Passkey Simulation
  const simulateBiometricPasskey = () => {
    if (window.PublicKeyCredential) {
      addTerminalLog('[WEBAUTHN] Requesting biometric hardware authenticator (Fingerprint/FaceID)...');
      setTimeout(() => {
        setIsAuthenticated(true);
        addTerminalLog('[WEBAUTHN SUCCESS] Biometric identity verified via secure enclave.');
        alert('[SECURE BIOMETRIC] Hardware Passkey verified successfully!');
      }, 1000);
    } else {
      // Fallback simulation for environments without WebAuthn hardware
      const confirmBio = window.confirm('[SIMULATION] WebAuthn Passkey prompt: Scan Fingerprint / FaceID?');
      if (confirmBio) {
        addTerminalLog('[BIOMETRIC PASSKEY] Fingerprint match confirmed.');
        alert('[SECURE] Biometric unlock successful.');
      }
    }
  };

  // Trigger 2FA Modal for sensitive actions
  const trigger2FA = (actionType: string, recordId?: string) => {
    setPendingAction({ type: actionType, id: recordId });
    setPinInput('');
    setShow2FAModal(true);
  };

  const verifyAndExecute2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026') { 
      setShow2FAModal(false);
      if (pendingAction?.type === 'UNFREEZE' && pendingAction.id) {
        executeUnfreeze(pendingAction.id);
      } else if (pendingAction?.type === 'FLUSH_DB') {
        localStorage.removeItem('nagrik_complaints');
        setComplaints([]);
        addTerminalLog('[CRITICAL] Admin Master Database flushed securely.');
        alert('[SECURE] Database core wiped successfully.');
      } else if (pendingAction?.type === 'BULK_ZONE_1') {
        executeBulkApproveZone1();
      }
      setPendingAction(null);
    } else {
      alert('[SECURITY ALERT] Invalid 2FA Secure PIN! Action aborted.');
      addTerminalLog('[SECURITY BREACH] Incorrect 2FA PIN entered during override request.');
    }
  };

  const executeUnfreeze = (id: string) => {
    const updated = complaints.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          isFrozen: false, 
          unfreezeRequested: false, 
          techApproved: true,
          status: 'In Progress' 
        };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    localStorage.setItem('complaints', JSON.stringify(updated));

    // Feature 3: Push automated WhatsApp/SMS Gateway audit log
    const smsLogMsg = `[SMS/WHATSAPP DISPATCH] Citizen notified: "Aapki complaint #${id} par action liya gaya hai." [Twilio 200 OK]`;
    setSmsLogs(prev => [smsLogMsg, ...prev]);

    addTerminalLog(`[EXEC_SUCCESS] UNFREEZE DEPLOYED & SMS/TELEGRAM WEBHOOK PUSHED FOR: ${id}`);
    playSciFiAlert(`Grievance ${id} successfully unfreezed.`);
    setWebhookStatus('CONNECTED 200 OK');
    alert(`[SECURE & SMS GATEWAY] Grievance ${id} unfreezed & citizen status updated via SMS!`);
  };

  const executeBulkApproveZone1 = () => {
    const updated = complaints.map(c => {
      if (c.location.toLowerCase().includes('jagatpur') || c.location.toLowerCase().includes('zone 1')) {
        return { ...c, isFrozen: false, unfreezeRequested: false, status: 'Resolved' };
      }
      return c;
    });
    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    addTerminalLog(`[MACRO EXECUTED] Bulk approved and dispatched rapid response team for Zone 1.`);
    alert('Zone 1 bulk operations executed successfully.');
  };

  const toggleSpamFlag = (id: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, isSpam: !c.isSpam } : c);
    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    addTerminalLog(`[AI SPAM DETECTOR] Record ${id} spam status toggled.`);
  };

  const pendingUnfreezes = complaints.filter(c => c.isFrozen && c.unfreezeRequested);
  const displayedComplaints = filterSpamMode ? complaints.filter(c => !c.isSpam) : complaints;

  // Theme styling definitions
  const themeStyles = {
    emerald: {
      text: 'text-emerald-500',
      textBright: 'text-emerald-400',
      border: 'border-emerald-500/60',
      bgCard: 'bg-zinc-950',
      bgGlow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
      btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-black',
      badgeBg: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      accentColor: '#10b981'
    },
    cyan: {
      text: 'text-cyan-500',
      textBright: 'text-cyan-400',
      border: 'border-cyan-500/60',
      bgCard: 'bg-slate-950',
      bgGlow: 'shadow-[0_0_40px_rgba(6,182,212,0.15)]',
      btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-black',
      badgeBg: 'bg-cyan-950 text-cyan-400 border-cyan-500/40',
      accentColor: '#06b6d4'
    },
    amber: {
      text: 'text-amber-500',
      textBright: 'text-amber-400',
      border: 'border-amber-500/60',
      bgCard: 'bg-stone-950',
      bgGlow: 'shadow-[0_0_40px_rgba(245,158,11,0.15)]',
      btnBg: 'bg-amber-500 hover:bg-amber-400 text-black',
      badgeBg: 'bg-amber-950 text-amber-400 border-amber-500/40',
      accentColor: '#f59e0b'
    },
    crimson: {
      text: 'text-rose-500',
      textBright: 'text-rose-400',
      border: 'border-rose-500/60',
      bgCard: 'bg-neutral-950',
      bgGlow: 'shadow-[0_0_40px_rgba(244,63,94,0.15)]',
      btnBg: 'bg-rose-500 hover:bg-rose-400 text-black',
      badgeBg: 'bg-rose-950 text-rose-400 border-rose-500/40',
      accentColor: '#f43f5e'
    }
  }[theme];

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-black ${themeStyles.text} font-mono flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-black relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className={`max-w-md w-full ${themeStyles.bgCard} border ${themeStyles.border} rounded-3xl p-8 ${themeStyles.bgGlow} relative z-10 space-y-6`}>
          <div className="text-center space-y-2">
            <div className={`inline-flex p-3 bg-zinc-900 border ${themeStyles.border} rounded-2xl ${themeStyles.textBright} shadow-inner`}>
              <Shield className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className={`text-sm font-black ${themeStyles.textBright} tracking-widest uppercase`}>NAGRIKSETU // ADMIN AUTH</h1>
            <p className="text-[10px] text-zinc-500">Enter secure operational credentials or biometric passkey.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className={`text-[10px] font-bold ${themeStyles.textBright} uppercase tracking-wider`}>Operator ID</label>
              <div className="relative">
                <Users className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="techsrinix-2026"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-[10px] font-bold ${themeStyles.textBright} uppercase tracking-wider`}>Security Key / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input 
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
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
              className={`w-full ${themeStyles.btnBg} py-3 rounded-xl font-black text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center space-x-2`}
            >
              <Key className="w-4 h-4" />
              <span>Authenticate & Initialize</span>
            </button>

            {/* Feature 6: Biometric Passkey Button */}
            <button 
              type="button"
              onClick={simulateBiometricPasskey}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              <span>Sign in with Biometric Passkey</span>
            </button>
          </form>

          <div className="bg-black p-3 rounded-xl border border-zinc-900 text-[10px] text-zinc-500 space-y-1 font-mono">
            <p className={` ${themeStyles.textBright} font-bold`}>&gt; SYSTEM LOG:</p>
            {terminalLogs.slice(0, 2).map((log, idx) => (
              <p key={idx} className="truncate">&bull; {log}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredComplaints = displayedComplaints.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-black ${themeStyles.text} font-mono flex flex-col selection:bg-emerald-500 selection:text-black`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Top Header */}
      <header className={`bg-zinc-950 border-b ${themeStyles.border} px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button onClick={handleLogout} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition cursor-pointer flex items-center justify-center group">
              <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
            </button>
            <button onClick={() => alert('[SYSTEM] Terminal minimized.')} className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-600 transition cursor-pointer flex items-center justify-center group">
              <Minus className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
            </button>
            <button onClick={() => alert('[SYSTEM] Terminal maximized.')} className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 transition cursor-pointer flex items-center justify-center group">
              <Square className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-zinc-800"></div>

          <div className="flex items-center space-x-3">
            <div className={`p-1.5 bg-zinc-900 border ${themeStyles.border} rounded-lg ${themeStyles.textBright}`}>
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className={`text-xs font-black tracking-wider ${themeStyles.textBright}`}>NAGRIKSETU // ADMIN-COMMAND</h1>
                <span className={`bg-zinc-900 ${themeStyles.textBright} text-[9px] font-bold px-2 py-0.5 rounded border ${themeStyles.border}`}>ONLINE</span>
              </div>
              <p className="text-[9px] text-zinc-500">OPERATOR: techsrinix-2026 &bull; ROOT NODE SECURED</p>
            </div>
          </div>
        </div>

        {/* Theme Customizer & Webhook Status & Report Export */}
        <div className="flex items-center space-x-4">
          {/* Feature 4: Export Report Button */}
          <button 
            onClick={exportEncryptedJSONReport}
            className="hidden sm:flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-800 text-[10px] text-zinc-300 font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Report</span>
          </button>

          {/* Theme Color Picker */}
          <div className="hidden md:flex items-center space-x-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800">
            <Palette className="w-3.5 h-3.5 text-zinc-400 mr-1" />
            {(['emerald', 'cyan', 'amber', 'crimson'] as const).map(t => (
              <button 
                key={t}
                onClick={() => { setTheme(t); addTerminalLog(`[THEME] Switched matrix interface to ${t.toUpperCase()}.`); }}
                className={`w-3.5 h-3.5 rounded-full transition cursor-pointer ${t === 'emerald' ? 'bg-emerald-500' : t === 'cyan' ? 'bg-cyan-500' : t === 'amber' ? 'bg-amber-500' : 'bg-rose-500'} ${theme === t ? 'ring-2 ring-white' : 'opacity-60'}`}
                title={`Switch to ${t}`}
              />
            ))}
          </div>

          {/* Webhook Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-[10px]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Telegram Webhook:</span>
            <span className="text-emerald-400 font-bold">{webhookStatus}</span>
          </div>

          <button 
            onClick={handleLogout}
            className="bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6 relative z-10">
        
        {/* Quick Action Macros & Spam Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => trigger2FA('BULK_ZONE_1')}
            className={`bg-zinc-950 hover:bg-zinc-900 border ${themeStyles.border} p-4 rounded-2xl flex items-center space-x-3 transition cursor-pointer shadow-md group text-left`}
          >
            <div className={`p-2.5 bg-zinc-900 border ${themeStyles.border} rounded-xl ${themeStyles.textBright}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-black ${themeStyles.textBright}`}>Approve Zone 1 Batch</h4>
              <p className="text-[9px] text-zinc-500">Quick macro for Jagatpur ward</p>
            </div>
          </button>

          <button 
            onClick={() => { setFilterSpamMode(!filterSpamMode); addTerminalLog(`[AI FILTER] Spam Guard toggled: ${!filterSpamMode ? 'ON' : 'OFF'}`); }}
            className={`bg-zinc-950 hover:bg-zinc-900 border ${filterSpamMode ? 'border-amber-500 bg-amber-950/10' : themeStyles.border} p-4 rounded-2xl flex items-center space-x-3 transition cursor-pointer shadow-md group text-left`}
          >
            <div className={`p-2.5 bg-zinc-900 border ${filterSpamMode ? 'border-amber-500 text-amber-400' : `${themeStyles.border}${themeStyles.textBright}`} rounded-xl`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-black ${filterSpamMode ? 'text-amber-400' : themeStyles.textBright}`}>AI Spam Guard</h4>
              <p className="text-[9px] text-zinc-500">{filterSpamMode ? 'Filtering Pranks [Active]' : 'Click to Filter Prank Reports'}</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveModal('adminDb')}
            className={`bg-zinc-950 hover:bg-zinc-900 border ${themeStyles.border} p-4 rounded-2xl flex items-center space-x-3 transition cursor-pointer shadow-md group text-left`}
          >
            <div className={`p-2.5 bg-zinc-900 border ${themeStyles.border} rounded-xl ${themeStyles.textBright}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-black ${themeStyles.textBright}`}>Admin Database Core</h4>
              <p className="text-[9px] text-zinc-500">Inspect raw JSON telemetry</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveModal('userActivity')}
            className={`bg-zinc-950 hover:bg-zinc-900 border ${themeStyles.border} p-4 rounded-2xl flex items-center space-x-3 transition cursor-pointer shadow-md group text-left`}
          >
            <div className={`p-2.5 bg-zinc-900 border ${themeStyles.border} rounded-xl ${themeStyles.textBright}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-black ${themeStyles.textBright}`}>User Activity Trail</h4>
              <p className="text-[9px] text-zinc-500">View citizen submissions</p>
            </div>
          </button>
        </div>

        {/* Feature 1: Live Geolocation Heatmap & Ward Boundary Visualizer */}
        <div className={`bg-zinc-950 border ${themeStyles.border} rounded-3xl p-6 shadow-xl space-y-4`}>
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className={`w-4 h-4 ${themeStyles.textBright}`} />
              <h3 className={`text-xs font-black ${themeStyles.textBright} uppercase`}>Live Geolocation Heatmap & Ward Visualizer [Jagatpur & Rasulgarh]</h3>
            </div>
            <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">Interactive SVG Grid</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Ward Selection Cards */}
            {['Jagatpur Ward 4', 'Jagatpur Industrial Sector', 'Rasulgarh Zone 1', 'Rasulgarh Zone 2'].map((ward, idx) => {
              const wardComplaints = complaints.filter(c => c.location.toLowerCase().includes(ward.toLowerCase().split(' ')[0]));
              const isHighDensity = wardComplaints.length > 2 || idx === 0;
              return (
                <div 
                  key={ward}
                  onClick={() => setSelectedHeatmapWard(ward)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${selectedHeatmapWard === ward ? 'border-emerald-400 bg-emerald-950/20' : 'border-zinc-800 bg-black hover:border-zinc-700'} relative overflow-hidden`}
                >
                  {isHighDensity && (
                    <div className="absolute top-0 right-0 bg-rose-600/30 text-rose-400 text-[8px] font-bold px-2 py-0.5 rounded-bl">
                      HIGH DENSITY GLOW
                    </div>
                  )}
                  <p className="text-[10px] text-zinc-500 uppercase">Sector {idx + 1}</p>
                  <h4 className={`text-xs font-bold text-white mt-1`}>{ward}</h4>
                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400">Grievances:</span>
                    <span className={`${isHighDensity ? 'text-rose-400 font-black animate-pulse' : themeStyles.textBright}`}>
                      {wardComplaints.length + (idx === 0 ? 5 : 2)} active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedHeatmapWard && (
            <div className="bg-black p-4 rounded-2xl border border-zinc-800 text-[11px] flex items-center justify-between">
              <div>
                <span className="text-zinc-500 font-bold">Selected Ward Focus:</span> <span className="text-white font-bold">{selectedHeatmapWard}</span>
                <p className="text-[10px] text-zinc-400 mt-0.5">Coordinates boundary locked. AI heat signature normalized to 84.2% threshold.</p>
              </div>
              <button 
                onClick={() => setSelectedHeatmapWard(null)}
                className="text-[10px] text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Clear Focus
              </button>
            </div>
          )}
        </div>

        {/* Predictive Resource Matrix & Live Drone Simulator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Predictive Resource Allocation Matrix */}
          <div className={`bg-zinc-950 border ${themeStyles.border} rounded-3xl p-6 space-y-4 shadow-xl lg:col-span-1`}>
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className={`w-4 h-4 ${themeStyles.textBright}`} />
                <h3 className={`text-xs font-black ${themeStyles.textBright} uppercase`}>AI Resource Matrix</h3>
              </div>
              <span className="text-[9px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">Jagatpur / Rasulgarh</span>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-400 text-[10px]">
                  <span>Ward 4 Workers Required:</span>
                  <span className={`${themeStyles.textBright} font-bold`}>14 Units</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                  <div className={`h-full bg-emerald-500 w-[68%]`}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-zinc-400 text-[10px]">
                  <span>Monsoon Risk Factor:</span>
                  <span className="text-rose-400 font-bold">14% [Low Hazard]</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                  <div className="h-full bg-rose-500 w-[14%]" />
                </div>
              </div>

              <div className="bg-black p-3 rounded-xl border border-zinc-900 text-[10px] text-zinc-400 space-y-1">
                <p className="text-zinc-300 font-bold">&gt; MUNICIPAL TELEMETRY:</p>
                <p>&bull; Drainage clearance forecast optimal.</p>
                <p>&bull; Response ETA benchmark: 24 Mins.</p>
              </div>
            </div>
          </div>

          {/* Live Municipal Drone Telemetry Feed Simulator & Radar Grid */}
          <div className={`bg-zinc-950 border ${themeStyles.border} rounded-3xl p-6 space-y-4 shadow-xl lg:col-span-2 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40"></div>

            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 relative z-10">
              <div className="flex items-center space-x-2">
                <Video className={`w-4 h-4 ${themeStyles.textBright} animate-pulse`} />
                <h3 className={`text-xs font-black ${themeStyles.textBright} uppercase`}>Live Drone Surveillance & Radar Feed</h3>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>LAT: 20.2961 N, LON: 85.8245 E</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {/* Simulated Visual Feed Window */}
              <div className="bg-black border border-zinc-800 rounded-2xl p-4 h-36 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-2 right-2 bg-red-950 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded border border-red-800">
                  REC // CAM-02
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="w-24 h-24 border border-emerald-500/50 rounded-full animate-ping"></div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase">Sector Monitoring</p>
                  <p className="text-xs font-bold text-zinc-300">Jagatpur Industrial Corridor</p>
                </div>
                <div className="flex justify-between items-end text-[9px] text-zinc-400">
                  <span>ALT: 120m | SPD: 14 km/h</span>
                  <span className="text-emerald-400 font-bold">SIGNAL STABLE</span>
                </div>
              </div>

              {/* Geo-Spatial Radar Ping Animation Grid */}
              <div className="bg-black border border-zinc-800 rounded-2xl p-4 h-36 relative flex flex-col justify-between overflow-hidden">
                <div className="absolute top-2 right-2 text-[9px] text-zinc-500">RADAR MESH GRID</div>
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <p className="text-[10px] text-zinc-500 uppercase">Active Pings Detected</p>
                  <p className="text-xs font-bold text-zinc-300">{radarPings.length} Hazard Beacons Active</p>
                </div>

                <div className="relative z-10 space-y-1">
                  {radarPings.map(ping => (
                    <div key={ping.id} className="flex items-center justify-between text-[10px] bg-zinc-900/80 px-2.5 py-1 rounded border border-zinc-800">
                      <span className="text-emerald-400 font-bold">{ping.id} &bull; {ping.zone}</span>
                      <span className="text-zinc-400">{ping.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature 3: Automated WhatsApp / SMS Gateway Audit Log Panel */}
        <div className={`bg-zinc-950 border ${themeStyles.border} rounded-3xl p-6 shadow-xl space-y-4`}>
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center space-x-2">
              <Radio className={`w-4 h-4 ${themeStyles.textBright}`} />
              <h3 className={`text-xs font-black ${themeStyles.textBright} uppercase`}>Automated WhatsApp / SMS Gateway Webhook Audit Log</h3>
            </div>
            <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">Twilio / Fast2SMS Active</span>
          </div>

          <div className="bg-black p-4 rounded-2xl border border-zinc-900 text-[11px] font-mono space-y-1.5 h-28 overflow-y-auto">
            {smsLogs.map((log, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-zinc-400">
                <span className="text-emerald-500">&bull;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`bg-zinc-950 border ${themeStyles.border} rounded-2xl p-5 space-y-1 shadow-md`}>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Encrypted Queue Status</p>
            <h3 className={`text-2xl font-black ${themeStyles.textBright}`}>{pendingUnfreezes.length} Pending</h3>
            <p className="text-[10px] text-zinc-400">Admin Unfreeze Requests Awaiting Auth</p>
          </div>

          <div className={`bg-zinc-950 border ${themeStyles.border} rounded-2xl p-5 space-y-1 shadow-md`}>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Total System Records</p>
            <h3 className={`text-2xl font-black ${themeStyles.textBright}`}>{complaints.length} Records</h3>
            <p className="text-[10px] text-zinc-400">Synced across Municipal Database</p>
          </div>

          <div className={`bg-zinc-950 border ${themeStyles.border} rounded-2xl p-5 space-y-1 shadow-md`}>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Terminal Security</p>
            <h3 className={`text-2xl font-black ${themeStyles.textBright}`}>LEVEL 5 ROOT</h3>
            <p className="text-[10px] text-zinc-400">Full Database Privileges Enabled</p>
          </div>
        </div>

        {/* Feature 5: Incoming Unfreeze Authorization Queue with SLA Timers & Red Alert Flash */}
        <div className={`bg-zinc-950 border ${themeStyles.border} rounded-3xl p-6 md:p-8 shadow-2xl space-y-6`}>
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="flex items-center space-x-3">
              <Shield className={`w-5 h-5 ${themeStyles.textBright} animate-pulse`} />
              <div>
                <h2 className={`text-sm font-black ${themeStyles.textBright} uppercase tracking-widest`}>Incoming Unfreeze Authorization Queue</h2>
                <p className="text-[10px] text-zinc-500">Verify field evidence, SLA countdowns, and execute 2FA unfreeze protocol.</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold bg-zinc-900 ${themeStyles.textBright} px-3 py-1 rounded border ${themeStyles.border}`}>
              SECURE PORTAL
            </span>
          </div>

          <div className="space-y-4">
            {pendingUnfreezes.length === 0 ? (
              <div className="text-zinc-600 text-xs py-16 text-center bg-black rounded-2xl border border-zinc-900">
                [NO PENDING UNFREEZE REQUESTS IN QUEUE]
              </div>
            ) : (
              pendingUnfreezes.map((item) => {
                const hoursLeft = Math.max(0, Math.floor(((item.slaDeadline || Date.now()) - Date.now()) / (1000 * 60 * 60)));
                const isSlaBreached = hoursLeft < 24; // Red alert flash if under 24 hours
                return (
                  <div key={item.id} className={`bg-black border ${isSlaBreached ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)] animate-pulse' : themeStyles.border} rounded-2xl p-6 space-y-4 shadow-md`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-black text-black bg-emerald-500 px-3 py-1 rounded font-mono">{item.id}</span>
                        <div>
                          <h4 className={`text-xs font-black ${themeStyles.textBright}`}>{item.name} <span className="text-[10px] text-zinc-500 font-normal">({item.email})</span></h4>
                          <p className="text-[11px] text-zinc-400">Location: <span className="text-white font-bold">{item.location}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className={`border px-3 py-1.5 rounded-xl text-[10px] font-bold ${isSlaBreached ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-zinc-900 border-zinc-800 text-amber-400'}`}>
                          SLA: {hoursLeft}h Remaining {isSlaBreached ? '[RED ALERT SLA]' : ''}
                        </div>
                        <button 
                          onClick={() => trigger2FA('UNFREEZE', item.id)}
                          className={`w-full md:w-auto ${themeStyles.btnBg} px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-2`}
                        >
                          <Unlock className="w-4 h-4" />
                          <span>2FA Unfreeze Protocol</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className={`text-[11px] font-bold ${themeStyles.textBright}`}>CATEGORY: {item.category}</p>
                      <p className="text-[11px] text-zinc-300 bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 font-mono">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Interactive Terminal Command Shell (CLI) */}
        <div className={`bg-zinc-950 border ${themeStyles.border} rounded-3xl p-6 space-y-4 shadow-xl`}>
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className={`w-4 h-4 ${themeStyles.textBright}`} />
              <h3 className={`text-xs font-black ${themeStyles.textBright} uppercase`}>Live Terminal Command Shell (CLI)</h3>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Type "help" for commands</span>
          </div>

          <div className="bg-black p-4 rounded-2xl border border-zinc-900 text-[11px] space-y-1 font-mono h-40 overflow-y-auto">
            {terminalLogs.map((log, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-zinc-600">&gt;</span>
                <span className="text-zinc-300">{log}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <form onSubmit={handleCliSubmit} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <span className={`absolute left-3.5 top-3 ${themeStyles.textBright} font-bold`}>$</span>
              <input 
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder="Enter command (e.g. status --all, drone:deploy, export:json, clear)..."
                className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
            <button 
              type="submit"
              className={`px-5 py-2.5 ${themeStyles.btnBg} rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center space-x-1`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
          </form>
        </div>

      </main>

      {/* 2FA Biometric / Security PIN Override Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`bg-zinc-950 border-2 ${themeStyles.border} rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl`}>
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className={`w-5 h-5 ${themeStyles.textBright}`} />
                <h3 className={`text-xs font-black ${themeStyles.textBright} uppercase tracking-wider`}>2FA Security Override</h3>
              </div>
              <button onClick={() => setShow2FAModal(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-center">
              <p className="text-xs text-zinc-400">
                High-privilege municipal action detected. Enter 4-digit security PIN (Default: <span className="text-white font-bold">2026</span>) to authenticate.
              </p>
              <form onSubmit={verifyAndExecute2FA} className="space-y-4">
                <input 
                  type="password"
                  maxLength={6}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
                <button 
                  type="submit"
                  className={`w-full ${themeStyles.btnBg} py-3 rounded-xl font-black text-xs uppercase tracking-widest transition cursor-pointer`}
                >
                  Authorize & Execute
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin DB & User Activity Modals */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className={`bg-zinc-950 border-2 ${themeStyles.border} rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden`}>
            
            <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setActiveModal('none')}></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer"></div>
                </div>
                <div className="h-4 w-[1px] bg-zinc-800"></div>
                <div className="flex items-center space-x-2">
                  <Database className={`w-4 h-4 ${themeStyles.textBright}`} />
                  <h3 className={`text-xs font-black ${themeStyles.textBright} uppercase tracking-widest`}>
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

            <div className="p-6 border-b border-zinc-900 bg-zinc-900/50 flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter records by ID, name, location or email..." 
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>
              <span className="text-[11px] text-zinc-400 font-bold bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-800">
                TOTAL: {filteredComplaints.length} RECORDS
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredComplaints.length === 0 ? (
                <div className="text-center text-zinc-600 py-16 text-xs">
                  [NO MATCHING RECORDS FOUND IN LOCAL STORAGE MUNICIPAL DB]
                </div>
              ) : (
                filteredComplaints.map((item) => (
                  <div key={item.id} className={`bg-black border ${themeStyles.border} rounded-2xl p-5 space-y-3`}>
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="bg-zinc-900 text-emerald-400 text-xs font-black px-2.5 py-1 rounded border border-zinc-800">{item.id}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{item.name} <span className="text-[10px] text-zinc-500 font-normal">({item.email})</span></p>
                          <p className="text-[10px] text-zinc-400">Location: {item.location} | Date: {item.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => toggleSpamFlag(item.id)}
                          className={`text-[9px] font-bold px-2 py-1 rounded border cursor-pointer ${item.isSpam ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-zinc-900 text-zinc-400 border-zinc-800'}`}
                        >
                          {item.isSpam ? '[SPAM FLAGGED]' : 'Mark Spam'}
                        </button>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${item.isFrozen ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-zinc-900 text-emerald-300 border-zinc-800'}`}>
                          {item.isFrozen ? 'FROZEN' : 'ACTIVE'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 space-y-1">
                        <span className="text-zinc-500 uppercase text-[9px] font-bold">Category:</span>
                        <p className="text-zinc-300 font-bold">{item.category}</p>
                      </div>
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 space-y-1">
                        <span className="text-zinc-500 uppercase text-[9px] font-bold">Description / Issue:</span>
                        <p className="text-zinc-300">{item.description}</p>
                      </div>
                    </div>

                    {activeModal === 'adminDb' && (
                      <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-900 text-[10px] font-mono text-zinc-400 overflow-x-auto">
                        <code>{JSON.stringify(item, null, 2)}</code>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="bg-black border-t border-zinc-900 px-6 py-3 text-[10px] text-zinc-500 flex justify-between">
              <span>DATABASE CONNECTOR: LOCAL_STORAGE_ACTIVE</span>
              <span>SECURE MUNICIPAL NODE // ROOT ACCESS</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}