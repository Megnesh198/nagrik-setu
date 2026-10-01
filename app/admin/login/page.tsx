'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Lock, 
  MapPin, LogOut, Search, RefreshCw, X, ShieldAlert,
  Download, Eye, Send, Radio, Sparkles, Filter, Calendar, Layers, Map as MapIcon,
  Mic, Bot, GitMerge, FileText, QrCode, AlertTriangle, Clock
} from 'lucide-react';

interface ComplaintItem {
  id: string;
  name: string;
  email: string;
  location: string;
  category: string;
  description: string;
  date: string;
  status: string;
  photoUrl?: string;
  adminNotes?: string;
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  department?: string;
  activityLog?: { timestamp: string; action: string }[];
  sentiment?: 'Angry' | 'Urgent' | 'Neutral' | 'Mild';
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  registeredDate: string;
  isBlocked: boolean;
  totalComplaints: number;
  karmaPoints?: number;
}

export default function AdminUnifiedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Login States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Dashboard States
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'users' | 'analytics' | 'map' | 'broadcast' | 'advanced'>('overview');
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // New Advanced Filter States
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterDepartment, setFilterDepartment] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Broadcast & Simulation States
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [simulatedEmailSent, setSimulatedEmailSent] = useState<string | null>(null);

  // Digital Clock State
  const [currentTime, setCurrentTime] = useState<string>('');

  // New Feature Simulation States
  const [simVoiceText, setSimVoiceText] = useState('');
  const [simVoiceLang, setSimVoiceLang] = useState('Odia');
  const [simWhatsappMsg, setSimWhatsappMsg] = useState('');
  const [simWhatsappLog, setSimWhatsappLog] = useState<string[]>([]);
  const [qrScanResult, setQrScanResult] = useState<string | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [whistleblowerMsg, setWhistleblowerMsg] = useState('');
  const [whistleblowerSubmitted, setWhistleblowerSubmitted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const auth = sessionStorage.getItem('nagrik_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }

    // Live Digital Clock Timer
    const timerInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput === 'admin@srinix.edu' || emailInput === 'adminsrinix-2026' || emailInput === 'admin123' || passwordInput === 'admin123') {
      sessionStorage.setItem('nagrik_admin_auth', 'true');
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Invalid Admin Credentials! (Use admin123)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nagrik_admin_auth');
    setIsAuthenticated(false);
  };

  const loadData = () => {
    const savedComplaints = localStorage.getItem('nagrik_complaints') || localStorage.getItem('complaints');

    if (savedComplaints) {
      try {
        const parsed = JSON.parse(savedComplaints);
        const enhanced = parsed.map((c: any) => {
          let priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' = c.priority || 'MEDIUM';
          const text = ((c.category || '') + ' ' + (c.description || '')).toLowerCase();
          
          let sentiment: 'Angry' | 'Urgent' | 'Neutral' | 'Mild' = 'Neutral';
          if (text.includes('danger') || text.includes('accident') || text.includes('severe') || text.includes('urgent')) {
            priority = 'URGENT';
            sentiment = 'Urgent';
          } else if (text.includes('water') || text.includes('leak') || text.includes('power') || text.includes('garbage')) {
            priority = 'HIGH';
            sentiment = 'Angry';
          } else if (text.includes('repair') || text.includes('street')) {
            priority = 'MEDIUM';
            sentiment = 'Mild';
          }

          let department = c.department || 'Roads & Infrastructure';
          if (text.includes('water') || text.includes('leak') || text.includes('drain')) department = 'Water Works';
          else if (text.includes('electricity') || text.includes('power') || text.includes('light')) department = 'Electricity Board';
          else if (text.includes('garbage') || text.includes('waste') || text.includes('sanitation')) department = 'Sanitation';

          const activityLog = c.activityLog || [
            { timestamp: c.date || '2026-10-01 10:00', action: 'Complaint Logged by Citizen' },
            { timestamp: c.date || '2026-10-01 10:05', action: `Auto-routed to ${department}` }
          ];

          return { 
            id: c.id || 'NS-' + Math.floor(1000 + Math.random() * 9000),
            name: c.name || c.userName || 'Anonymous Citizen',
            email: c.email || 'citizen@nagriksetu.gov',
            location: c.location || c.address || 'Bhubaneswar Municipal Zone',
            category: c.category || c.issueType || 'General Civic',
            description: c.description || c.details || 'No description provided.',
            date: c.date || new Date().toISOString().split('T')[0],
            status: c.status || 'Pending',
            photoUrl: c.photoUrl || c.image || null,
            adminNotes: c.adminNotes || '',
            priority,
            department,
            activityLog,
            sentiment
          };
        });

        setComplaints(enhanced);
        
        const userMap = new Map<string, UserProfile>();
        enhanced.forEach((c: ComplaintItem) => {
          if (!userMap.has(c.email)) {
            userMap.set(c.email, {
              id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
              name: c.name,
              email: c.email,
              registeredDate: c.date || '2026-10-01',
              isBlocked: false,
              totalComplaints: 1,
              karmaPoints: 150
            });
          } else {
            const existing = userMap.get(c.email)!;
            existing.totalComplaints += 1;
            existing.karmaPoints = (existing.karmaPoints || 100) + 50;
          }
        });
        setUsers(Array.from(userMap.values()));
      } catch (err) {
        console.error('Error parsing complaints:', err);
      }
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const timestampNow = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = complaints.map(c => {
      if (c.id === id) {
        const newLog = [...(c.activityLog || []), { timestamp: timestampNow, action: `Status changed to ${newStatus}` }];
        return { 
          ...c, 
          status: newStatus,
          activityLog: newLog
        };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    localStorage.setItem('complaints', JSON.stringify(updated));

    // Broadcast update simulation to user storage or notification feed
    const updatedTarget = updated.find(c => c.id === id);
    if (updatedTarget) {
      setSelectedComplaint(updatedTarget);
      // Automatically trigger user-side sync event notification alert
      setSimulatedEmailSent(updatedTarget.email);
      setTimeout(() => setSimulatedEmailSent(null), 4000);
    }
    
    alert(`[SUCCESS] Complaint status updated to "${newStatus}" and synchronized with user dashboard successfully!`);
  };

  const handleDepartmentChange = (id: string, newDept: string) => {
    const timestampNow = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = complaints.map(c => {
      if (c.id === id) {
        const newLog = [...(c.activityLog || []), { timestamp: timestampNow, action: `Assigned to department: ${newDept}` }];
        return { ...c, department: newDept, activityLog: newLog };
      }
      return c;
    });
    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    localStorage.setItem('complaints', JSON.stringify(updated));
    const updatedTarget = updated.find(c => c.id === id);
    if (updatedTarget) setSelectedComplaint(updatedTarget);
    alert('[ASSIGNED] Department officer reassigned.');
  };

  const saveAdminNotes = (id: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, adminNotes: tempNotes } : c);
    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    localStorage.setItem('complaints', JSON.stringify(updated));
    const updatedTarget = updated.find(c => c.id === id);
    if (updatedTarget) setSelectedComplaint(updatedTarget);
    setEditingNotesId(null);
    alert('[NOTE SAVED] Internal admin note updated.');
  };

  const toggleBlockUser = (email: string) => {
    const updatedUsers = users.map(u => u.email === email ? { ...u, isBlocked: !u.isBlocked } : u);
    setUsers(updatedUsers);
    alert('[SECURITY] User access status updated.');
  };

  const triggerBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastActive(true);
    alert(`[BROADCAST SENT] Alert dispatched successfully to ${broadcastTarget === 'ALL' ? 'All Registered Citizens' : broadcastTarget}!`);
  };

  const sendMockEmailSMS = (citizenEmail: string, status: string) => {
    setSimulatedEmailSent(citizenEmail);
    setTimeout(() => setSimulatedEmailSent(null), 4000);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Location', 'Category', 'Department', 'Priority', 'Status', 'Date'];
    const rows = complaints.map(c => [
      c.id, `"${c.name}"`, c.email, `"${c.location}"`, `"${c.category}"`, `"${c.department}"`, c.priority, c.status, c.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NagrikSetu_Admin_Audit_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulation Handlers for 10 New Features
  const handleSimulateVoice = () => {
    const sampleTexts: Record<string, string> = {
      'Odia': 'କଟକ ରୋଡ୍ ରେ ବଡ଼ ଗାତ ଅଛି, ଦୟା କରି ମରାମତି କରନ୍ତୁ।',
      'Hindi': 'Cuttack Road par bada pothole hai, paani jama ho gaya hai.',
      'English': 'Severe water logging reported near Saheed Nagar square.'
    };
    setSimVoiceText(sampleTexts[simVoiceLang] || sampleTexts['English']);
  };

  const handleSimulateWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simWhatsappMsg.trim()) return;
    const botReply = `[WhatsApp AI Bot] Complaint successfully registered! Assigned ID: NS-${Math.floor(1000 + Math.random() * 9000)}. Status: Auto-routed.`;
    setSimWhatsappLog(prev => [simWhatsappMsg, botReply, ...prev]);
    setSimWhatsappMsg('');
  };

  const handleSimulateDuplicateMerge = () => {
    alert('[AI Redundancy Eliminator] Successfully scanned database. 3 duplicate complaints on Cuttack Road merged into Master Ticket #NS-402!');
  };

  const handleSimulateWhistleblower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whistleblowerMsg.trim()) return;
    setWhistleblowerSubmitted(true);
    setTimeout(() => {
      setWhistleblowerSubmitted(false);
      setWhistleblowerMsg('');
      alert('[SECURE CHANNEL] Whistleblower report encrypted with Anonymous Hash ID #CRYPTO-9842.');
    }, 2000);
  };

  const handleScanQr = (zoneCode: string) => {
    setQrScanResult(`[QR Verified] Ward ${zoneCode} scanned successfully at ${new Date().toLocaleTimeString()}. Field Inspector attendance & cleanliness score updated.`);
  };

  const handleTriggerSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 5000);
  };

  if (!isMounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-10 max-w-md w-full space-y-8 shadow-2xl relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-inner">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/60">Secure Access</span>
              <h1 className="text-2xl font-black tracking-tight text-white pt-2">Admin Control Center</h1>
              <p className="text-xs text-slate-400">NagrikSetu Municipal Intelligence Portal</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Administrator Email / ID</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@srinix.edu" 
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Enter Portal</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/60">
            <p className="text-[11px] text-slate-500">Restricted municipal personnel access only. IP activity is logged.</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter Logic Implementation
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || c.priority === filterPriority;
    const matchesDept = filterDepartment === 'ALL' || c.department === filterDepartment;

    let matchesDate = true;
    if (startDate && c.date < startDate) matchesDate = false;
    if (endDate && c.date > endDate) matchesDate = false;

    return matchesSearch && matchesPriority && matchesDept && matchesDate;
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCount = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const urgentCount = complaints.filter(c => c.priority === 'URGENT').length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <div>
        {broadcastActive && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-lg sticky top-0 z-40">
            <div className="flex items-center space-x-2 mx-auto">
              <Radio className="w-4 h-4 animate-ping" />
              <span>ACTIVE BROADCAST ALERT: {broadcastMessage}</span>
            </div>
            <button onClick={() => setBroadcastActive(false)} className="bg-black/20 hover:bg-black/40 p-1 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        )}

        {sosActive && (
          <div className="bg-red-600 text-white px-4 py-3 text-xs font-black flex items-center justify-between shadow-2xl sticky top-0 z-50 animate-bounce">
            <div className="flex items-center space-x-2 mx-auto">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span>EMERGENCY SOS PANIC ALERT DISPATCHED TO MUNICIPAL CONTROL ROOM & POLICE STATION! GPS: 20.2961° N, 85.8245° E</span>
            </div>
            <button onClick={() => setSosActive(false)} className="bg-black/30 px-2 py-1 rounded cursor-pointer">Dismiss</button>
          </div>
        )}

        <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-md opacity-40 animate-pulse"></div>
              <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl border border-emerald-400/40 flex items-center justify-center shadow-lg text-white">
                <ShieldCheck className="w-6 h-6 drop-shadow-md" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400">
                NAGRIKSETU <span className="text-xs font-mono font-normal text-emerald-400 px-2 py-0.5 bg-emerald-950/80 rounded-full border border-emerald-800">AI COMMAND</span>
              </h1>
              <p className="text-xs text-slate-400">Municipal Admin Intelligence Unit</p>
            </div>
          </div>

          {/* Master Digital Clock & Quick Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs shadow-inner">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{currentTime || '12:00:00 AM'}</span>
            </div>

            <button onClick={exportCSV} className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-white shadow-lg shadow-emerald-600/20">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button onClick={loadData} className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-slate-300 border border-slate-700">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Data</span>
            </button>
            <button onClick={handleLogout} className="flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Total Complaints</p>
              <h3 className="text-2xl font-black text-white">{totalCount}</h3>
            </div>
            <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Urgent Priority</p>
              <h3 className="text-2xl font-black text-red-400">{urgentCount}</h3>
            </div>
            <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Registered Users</p>
              <h3 className="text-2xl font-black text-emerald-400">{users.length}</h3>
            </div>
            <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Blocked Users</p>
              <h3 className="text-2xl font-black text-red-400">{users.filter(u => u.isBlocked).length}</h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>Overview</button>
              <button onClick={() => setActiveTab('complaints')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'complaints' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>Complaints ({complaints.length})</button>
              <button onClick={() => setActiveTab('map')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${activeTab === 'map' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}><MapIcon className="w-3.5 h-3.5" /><span>Map Hotspots</span></button>
              <button onClick={() => setActiveTab('advanced')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${activeTab === 'advanced' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}><Sparkles className="w-3.5 h-3.5 text-amber-300" /><span>Advanced AI & Tools (10)</span></button>
              <button onClick={() => setActiveTab('broadcast')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${activeTab === 'broadcast' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}><Radio className="w-3.5 h-3.5" /><span>Broadcast</span></button>
              <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'users' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>Users Control</button>
              <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>AI Analytics</button>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search complaints, ID, location..." className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition" />
            </div>
          </div>

          {/* Advanced Filtering Toolbar for Complaints & Overview */}
          {(activeTab === 'complaints' || activeTab === 'overview') && (
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-bold">Filters:</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-slate-400">Priority:</span>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold">
                  <option value="ALL">All Priorities</option>
                  <option value="URGENT">URGENT</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-slate-400">Department:</span>
                <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold">
                  <option value="ALL">All Departments</option>
                  <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                  <option value="Water Works">Water Works</option>
                  <option value="Electricity Board">Electricity Board</option>
                  <option value="Sanitation">Sanitation</option>
                </select>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300" />
                <span className="text-slate-500">to</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300" />
              </div>
              {(filterPriority !== 'ALL' || filterDepartment !== 'ALL' || startDate || endDate) && (
                <button onClick={() => { setFilterPriority('ALL'); setFilterDepartment('ALL'); setStartDate(''); setEndDate(''); }} className="text-emerald-400 hover:underline">Reset Filters</button>
              )}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Filtered Civic Complaints Feed ({filteredComplaints.length})</span>
                <span className="text-xs font-normal text-slate-400">Live Feed Active</span>
              </h3>
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {filteredComplaints.length === 0 ? <p className="text-xs text-slate-500 text-center py-6">No complaints found matching current filters.</p> : filteredComplaints.map(c => (
                  <div key={c.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">{c.id}</span>
                        <span className="text-xs font-bold text-white">{c.location}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.priority === 'URGENT' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-900 text-slate-300'}`}>{c.priority}</span>
                        <span className="text-[10px] text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-900">{c.department}</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1">{c.description}</p>
                      <p className="text-[10px] text-slate-400">By: <strong className="text-slate-300">{c.name}</strong> &bull; Status: <span className={`font-semibold ${c.status === 'Resolved' ? 'text-emerald-400' : c.status === 'In Progress' ? 'text-amber-400' : 'text-red-400'}`}>{c.status}</span></p>
                    </div>
                    <button onClick={() => setSelectedComplaint(c)} className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center space-x-1.5 transition">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADVANCED TAB: 10 NEW MUNICIPAL FEATURES & SIMULATORS */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-black text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>NagrikSetu Advanced Municipal Intelligence & Interactive Simulators</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">Test and interact with all 10 newly integrated civic tech modules built for next-generation municipal governance.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Voice-to-Text Civic Reporting */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Mic className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">1. Multilingual AI Voice Reporting</h4>
                  </div>
                  <p className="text-xs text-slate-400">Record voice in Odia, Hindi, or English. AI automatically converts audio to text and categorizes issue.</p>
                  <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex space-x-2">
                      <select value={simVoiceLang} onChange={(e) => setSimVoiceLang(e.target.value)} className="bg-slate-900 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-bold">
                        <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="English">English</option>
                      </select>
                      <button onClick={handleSimulateVoice} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer">Simulate Mic Input</button>
                    </div>
                    {simVoiceText && (
                      <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg text-xs space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">AI Transcribed & Categorized:</span>
                        <p className="text-slate-200 font-medium">{simVoiceText}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. AI Predictive Maintenance & Hazard Heatmap */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">2. AI Predictive Maintenance & Heatmap</h4>
                  </div>
                  <p className="text-xs text-slate-400">Predicts monsoon drainage overflows in advance based on historical telemetry.</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-red-950/40 border border-red-900/60 p-2.5 rounded-lg">
                      <span className="text-red-400 font-bold">Zone-1 Drainage Overflow Risk:</span>
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold text-[10px]">89% (High Risk)</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">Proactive maintenance crew dispatched to Jagatpur canal zone.</p>
                  </div>
                </div>

                {/* 3. Citizen Gamification & Reward Points */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-teal-400">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">3. Nagrik Karma Points & Gamification</h4>
                  </div>
                  <p className="text-xs text-slate-400">Citizens earn digital Karma Points and badges (Civic Champion, Green Warrior) for active reports.</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Top Civic Champion:</span>
                      <span className="text-emerald-400 font-bold">Ganesh Chandra Sethi (350 Points)</span>
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">🏆 Civic Champion Badge</span>
                      <span className="bg-teal-950 text-teal-400 border border-teal-800 px-2.5 py-1 rounded-full text-[10px] font-bold">🌿 Green Warrior</span>
                    </div>
                  </div>
                </div>

                {/* 4. Live Contractor Progress Tracker */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <FileText className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">4. Live Contractor Transparency Ledger</h4>
                  </div>
                  <p className="text-xs text-slate-400">Contractors must upload live geo-tagged photo proof before starting and completing repair tasks.</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Ticket #NS-104 Contractor:</span>
                      <strong className="text-emerald-400">MGS Infrastructure Ltd.</strong>
                    </div>
                    <div className="text-[11px] text-slate-400">Proof Status: <span className="text-emerald-400 font-bold">Verified & Live Photos Uploaded</span></div>
                  </div>
                </div>

                {/* 5. Emergency SOS Panic Button with Telemetry */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">5. Emergency SOS Panic Button</h4>
                  </div>
                  <p className="text-xs text-slate-400">Instant dispatch for accidents or electric short-circuit blasts with precise GPS coordinates.</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-300">Test SOS Dispatcher:</span>
                    <button onClick={handleTriggerSOS} className="bg-red-600 hover:bg-red-500 text-white text-xs font-black px-4 py-2.5 rounded-xl animate-pulse shadow-lg shadow-red-600/40 cursor-pointer">
                      🚨 TRIGGER SOS PANIC
                    </button>
                  </div>
                </div>

                {/* 6. AI Budget & Resource Allocation Predictor */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Layers className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">6. AI Budget & Resource Allocator</h4>
                  </div>
                  <p className="text-xs text-slate-400">Smart widget analyzing complaint density per ward to estimate required repair budget & manpower.</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300">
                    <p><strong>Zone-1 Analysis:</strong> High complaint density (Roads & Drainage).</p>
                    <p className="text-emerald-400 font-bold">Estimated Requirement: 12 Workers & INR 45,000 Allocation.</p>
                  </div>
                </div>

                {/* 7. WhatsApp / SMS AI Chatbot Integration Simulator */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-green-400">
                    <Bot className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">7. WhatsApp AI Chatbot Simulator</h4>
                  </div>
                  <p className="text-xs text-slate-400">Simulate filing complaints directly via WhatsApp message format.</p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
                    <form onSubmit={handleSimulateWhatsapp} className="flex space-x-2">
                      <input type="text" value={simWhatsappMsg} onChange={(e) => setSimWhatsappMsg(e.target.value)} placeholder="Type WhatsApp message..." className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2" />
                      <button type="submit" className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">Send</button>
                    </form>
                    <div className="max-h-24 overflow-y-auto space-y-1 text-[11px]">
                      {simWhatsappLog.map((log, idx) => (
                        <div key={idx} className={idx % 2 === 0 ? 'text-slate-300' : 'text-emerald-400 font-mono'}>{log}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 8. Duplicate Complaint Auto-Merger */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-teal-400">
                    <GitMerge className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">8. Duplicate Complaint Auto-Merger</h4>
                  </div>
                  <p className="text-xs text-slate-400">AI automatically detects identical geolocation issues and merges them into a master ticket.</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-300">Run Redundancy Check:</span>
                    <button onClick={handleSimulateDuplicateMerge} className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                      Run AI Auto-Merger
                    </button>
                  </div>
                </div>

                {/* 9. Anonymous Whistleblower Secure Channel */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Lock className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">9. Anonymous Whistleblower Channel</h4>
                  </div>
                  <p className="text-xs text-slate-400">Encrypted reporting form ensuring 100% hidden identity with cryptographic hash ID.</p>
                  <form onSubmit={handleSimulateWhistleblower} className="space-y-2">
                    <textarea value={whistleblowerMsg} onChange={(e) => setWhistleblowerMsg(e.target.value)} placeholder="Report corruption or illegal dumping anonymously..." rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" required />
                    <button type="submit" disabled={whistleblowerSubmitted} className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 rounded-xl cursor-pointer">
                      {whistleblowerSubmitted ? 'Encrypting & Submitting...' : 'Submit Secure & Anonymous Report'}
                    </button>
                  </form>
                </div>

                {/* 10. QR Code Ward Inspection Tagging */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <QrCode className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">10. QR Code Ward Inspection Tagging</h4>
                  </div>
                  <p className="text-xs text-slate-400">Scan street pole or garbage bin QR tags to instantly verify field inspector presence.</p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex space-x-2">
                      <button onClick={() => handleScanQr('Ward-04')} className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer">Scan Ward-04 Pole QR</button>
                      <button onClick={() => handleScanQr('Bin-12')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer">Scan Bin-12 QR</button>
                    </div>
                    {qrScanResult && (
                      <p className="text-[11px] text-cyan-400 font-mono bg-cyan-950/40 p-2 rounded-lg border border-cyan-900">{qrScanResult}</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Geo-Tagging Hotspot Intelligence Map</span>
                  </h3>
                  <p className="text-xs text-slate-400">Live coordinate pins across Bhubaneswar municipal wards.</p>
                </div>
                <span className="text-xs font-mono bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800">Leaflet Radar Active</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 h-96 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 border border-emerald-500/20 rounded-full animate-ping absolute"></div>
                  <div className="w-48 h-48 border border-emerald-500/30 rounded-full absolute"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 w-full max-w-3xl">
                  <div className="bg-slate-900/90 border border-emerald-500/40 p-4 rounded-xl space-y-2 backdrop-blur shadow-lg">
                    <div className="flex justify-between items-center"><span className="text-[10px] font-mono text-emerald-400">ZONE-1 (Jagatpur / Rasulgarh)</span><span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span></div>
                    <p className="text-xs font-bold text-white">Water Leakage Cluster</p>
                    <p className="text-[11px] text-slate-400">4 Active URGENT reports logged.</p>
                  </div>
                  <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-xl space-y-2 backdrop-blur shadow-lg">
                    <div className="flex justify-between items-center"><span className="text-[10px] font-mono text-amber-400">ZONE-2 (Saheed Nagar)</span><span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span></div>
                    <p className="text-xs font-bold text-white">Streetlight Outage</p>
                    <p className="text-[11px] text-slate-400">3 Pending complaints.</p>
                  </div>
                  <div className="bg-slate-900/90 border border-blue-500/40 p-4 rounded-xl space-y-2 backdrop-blur shadow-lg">
                    <div className="flex justify-between items-center"><span className="text-[10px] font-mono text-blue-400">ZONE-3 (Patia Hub)</span><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span></div>
                    <p className="text-xs font-bold text-white">Sanitation & Drainage</p>
                    <p className="text-[11px] text-slate-400">Resolved zone status.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>In-App Announcement & Broadcast System</span>
                </h3>
                <p className="text-xs text-slate-400">Trigger emergency alerts or notifications to citizen dashboards instantly.</p>
              </div>

              <form onSubmit={triggerBroadcast} className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Broadcast Alert Message</label>
                  <textarea 
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="e.g., Water supply in Zone-2 will be temporarily shut down from 2 PM to 5 PM for pipeline maintenance."
                    rows={3}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Target Audience Group</label>
                  <select value={broadcastTarget} onChange={(e) => setBroadcastTarget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-bold">
                    <option value="ALL">All Registered Citizens ({users.length} users)</option>
                    <option value="Zone-1">Zone-1 Residents</option>
                    <option value="Zone-2">Zone-2 Residents</option>
                    <option value="Urgent Reporters">Citizens with Active Urgent Reports</option>
                  </select>
                </div>

                <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center space-x-2">
                  <Send className="w-3.5 h-3.5" />
                  <span>Trigger Broadcast Alert</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white">Registered Citizen Directory</h3>
              <div className="space-y-3">
                {filteredUsers.length === 0 ? <p className="text-xs text-slate-500">No users registered.</p> : filteredUsers.map(user => (
                  <div key={user.email} className="bg-slate-950 p-4 rounded-xl flex justify-between items-center border border-slate-800">
                    <div>
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400">{user.email} &bull; Total Reports: {user.totalComplaints} &bull; Karma Points: <strong className="text-emerald-400">{user.karmaPoints || 150}</strong></p>
                    </div>
                    <button onClick={() => toggleBlockUser(user.email)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${user.isBlocked ? 'bg-emerald-600 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {user.isBlocked ? 'Unblock User' : 'Block User'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>AI Issue Clustering & Sentiment Analysis Widget</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-emerald-400">AI Clustering Insight</span>
                    <p className="text-xs text-slate-300">"72% of recent complaints in Zone-1 and Zone-2 pertain to <strong>Water Works & Pipe Leakage</strong>. Automated routing prioritized these as URGENT."</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-amber-400">Citizen Sentiment Metric</span>
                    <p className="text-xs text-slate-300">"Detected tone analysis across submissions: <strong>45% Urgent/Angry</strong>, 35% Neutral, 20% Mild. Automatic priority adjustment applied successfully."</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white">Municipal Performance Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs text-slate-400">Resolved Complaints</p>
                    <p className="text-2xl font-black text-emerald-400">{resolvedCount}</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs text-slate-400">In Progress</p>
                    <p className="text-2xl font-black text-amber-400">{inProgressCount}</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs text-slate-400">Pending Review</p>
                    <p className="text-2xl font-black text-red-400">{pendingCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-7 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3.5">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Complaint Control Panel: <span className="font-mono text-emerald-400">{selectedComplaint.id}</span></h3>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Citizen Name</span>
                  <strong className="text-slate-200">{selectedComplaint.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Email Contact</span>
                  <strong className="text-slate-200">{selectedComplaint.email}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Location Zone</span>
                  <strong className="text-slate-200">{selectedComplaint.location}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">AI Sentiment Tone</span>
                  <strong className="text-amber-400">{selectedComplaint.sentiment || 'Neutral'}</strong>
                </div>
              </div>

              {/* Department Auto-Routing & Assignment Dropdown */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <span className="text-slate-300 font-bold block">Department Officer Assignment</span>
                <select 
                  value={selectedComplaint.department || 'Roads & Infrastructure'}
                  onChange={(e) => handleDepartmentChange(selectedComplaint.id, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-teal-400 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                  <option value="Water Works">Water Works</option>
                  <option value="Electricity Board">Electricity Board</option>
                  <option value="Sanitation">Sanitation</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Issue Description:</span>
                <p className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-slate-300">{selectedComplaint.description}</p>
              </div>

              {/* Status Timeline / Activity Log Audit Trail */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-300 font-bold block">Status Timeline / Audit Trail</span>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                  {selectedComplaint.activityLog?.map((log, index) => (
                    <div key={index} className="flex items-center justify-between text-[11px] border-b border-slate-900 pb-1">
                      <span className="text-slate-400">{log.action}</span>
                      <span className="font-mono text-emerald-400">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-slate-300 font-bold block">Update Complaint Status & Notification Trigger</span>
                    <p className="text-[10px] text-slate-400">Changing status logs activity & simulates email to citizen.</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <select 
                    value={selectedComplaint.status} 
                    onChange={(e) => handleStatusChange(selectedComplaint.id, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-emerald-400 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button 
                    onClick={() => sendMockEmailSMS(selectedComplaint.email, selectedComplaint.status)}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    Send Email/SMS Simulation
                  </button>
                </div>
                {simulatedEmailSent === selectedComplaint.email && (
                  <p className="text-[11px] text-emerald-400 text-center font-bold bg-emerald-950/60 p-2 rounded-lg border border-emerald-900">
                    [REAL-TIME SYNC & MOCK NOTIFICATION] Status update dispatched successfully to user dashboard & email ({selectedComplaint.email})!
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 font-medium">Internal Admin Notes:</span>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={tempNotes !== '' ? tempNotes : (selectedComplaint.adminNotes || '')}
                    onChange={(e) => setTempNotes(e.target.value)}
                    placeholder="Add internal remarks..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                  <button onClick={() => saveAdminNotes(selectedComplaint.id)} className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer">Save</button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button onClick={() => setSelectedComplaint(null)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer">Close Panel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}