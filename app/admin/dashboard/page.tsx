'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, AlertCircle, Lock, Unlock, CheckCircle2, 
  XCircle, MapPin, FileText, LogOut, Search, RefreshCw, X, ShieldAlert,
  Download, BarChart3, MessageSquare, Globe, ExternalLink, Activity, Eye
} from 'lucide-react';

interface ComplaintItem {
  id: string;
  name: string;
  email: string;
  location: string;
  category: string;
  description: string;
  date: string;
  status: string; // 'Pending' | 'In Progress' | 'Resolved'
  photoUrl?: string;
  isFrozen?: boolean;
  unfreezeRequested?: boolean;
  adminNotes?: string;
  priority?: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  techApproved?: boolean; // Tech approval flag added
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  registeredDate: string;
  isBlocked: boolean;
  totalComplaints: number;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'users' | 'analytics'>('overview');
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Detailed complaint preview modal state
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  useEffect(() => {
    // Verify Admin Session
    const auth = sessionStorage.getItem('nagrik_admin_auth');
    if (auth !== 'true') {
      window.location.href = '/admin';
    } else {
      setIsAuthenticated(true);
      loadData();

      // Auto-sync interval to catch new complaints instantly (Live Data Sync)
      const interval = setInterval(() => {
        loadData();
      }, 1500);

      // Listen to storage changes across tabs/portals
      const handleStorageChange = () => {
        loadData();
      };
      window.addEventListener('storage', handleStorageChange);

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  const loadData = () => {
    const savedComplaints = localStorage.getItem('nagrik_complaints') || localStorage.getItem('complaints');
    if (savedComplaints) {
      try {
        const parsed = JSON.parse(savedComplaints);
        
        const enhanced = parsed.map((c: any) => {
          let priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' = c.priority || 'MEDIUM';
          const text = ((c.category || '') + ' ' + (c.description || '')).toLowerCase();
          if (text.includes('water') || text.includes('hazard') || text.includes('leak') || text.includes('accident') || text.includes('danger')) {
            priority = 'URGENT';
          } else if (text.includes('garbage') || text.includes('electricity') || text.includes('drainage') || text.includes('power')) {
            priority = 'HIGH';
          }
          return { 
            id: c.id || 'CMP-' + Math.floor(1000 + Math.random() * 9000),
            name: c.name || c.userName || 'Anonymous Citizen',
            email: c.email || 'citizen@nagriksetu.gov',
            location: c.location || c.address || 'Bhubaneswar Municipal Zone',
            category: c.category || c.issueType || 'General Civic',
            description: c.description || c.details || 'No description provided.',
            date: c.date || new Date().toISOString().split('T')[0],
            status: c.status || 'Pending',
            photoUrl: c.photoUrl || c.image || null,
            isFrozen: c.isFrozen || false,
            unfreezeRequested: c.unfreezeRequested || false,
            adminNotes: c.adminNotes || '',
            priority,
            techApproved: c.techApproved !== undefined ? c.techApproved : false
          };
        });

        setComplaints(enhanced);
        
        // Keep selectedComplaint updated if modal is currently open
        setSelectedComplaint(prev => {
          if (!prev) return null;
          const updatedCurrent = enhanced.find((c: ComplaintItem) => c.id === prev.id);
          return updatedCurrent || prev;
        });
        
        const userMap = new globalThis.Map<string, UserProfile>();
        enhanced.forEach((c: ComplaintItem) => {
          if (!userMap.has(c.email)) {
            userMap.set(c.email, {
              id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
              name: c.name,
              email: c.email,
              registeredDate: c.date || '2026-10-01',
              isBlocked: false,
              totalComplaints: 1
            });
          } else {
            const existing = userMap.get(c.email)!;
            existing.totalComplaints += 1;
          }
        });
        setUsers(Array.from(userMap.values()));
      } catch (err) {
        console.error('Error parsing complaints:', err);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nagrik_admin_auth');
    window.location.href = '/admin';
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const target = complaints.find(c => c.id === id);
    if (target && target.isFrozen) {
      alert('[SECURITY LOCK] Yeh record status lock ki wajah se frozen hai! Pehle unfreeze request bhejein.');
      return;
    }

    // Tech Approval check if status is set to 'Resolved'
    if (newStatus === 'Resolved' && target && !target.techApproved) {
      alert('[TECH APPROVAL REQUIRED] Complaint ko Resolved mark karne ke liye Technical Lead / Tech Approval zaroori hai! Pehle tech approve karein.');
      return;
    }

    const updated = complaints.map(c => {
      if (c.id === id) {
        return { ...c, status: newStatus, isFrozen: true };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    localStorage.setItem('complaints', JSON.stringify(updated));
    
    // Immediately update modal view
    const updatedTarget = updated.find(c => c.id === id);
    if (updatedTarget) {
      setSelectedComplaint(updatedTarget);
    }

    alert('[SUCCESS] Status successfully update ho gaya hai aur record freeze ho chuka hai.');
  };

  // Toggle Tech Approval directly from Admin panel if needed
  const toggleTechApproval = (id: string) => {
    const updated = complaints.map(c => {
      if (c.id === id) {
        const nextState = !c.techApproved;
        return { ...c, techApproved: nextState };
      }
      return c;
    });

    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    localStorage.setItem('complaints', JSON.stringify(updated));

    const updatedTarget = updated.find(c => c.id === id);
    if (updatedTarget) {
      setSelectedComplaint(updatedTarget);
    }

    alert('[TECH STATUS] Technical Approval status update kar diya gaya hai.');
  };

  const requestUnfreeze = (id: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, unfreezeRequested: true } : c);
    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    localStorage.setItem('complaints', JSON.stringify(updated));

    const updatedTarget = updated.find(c => c.id === id);
    if (updatedTarget) {
      setSelectedComplaint(updatedTarget);
    }

    alert('[DISPATCHED] Unfreeze request Tech Command Core (/tech) ko bhej di gayi hai.');
  };

  const saveAdminNotes = (id: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, adminNotes: tempNotes } : c);
    setComplaints(updated);
    localStorage.setItem('nagrik_complaints', JSON.stringify(updated));
    localStorage.setItem('complaints', JSON.stringify(updated));

    const updatedTarget = updated.find(c => c.id === id);
    if (updatedTarget) {
      setSelectedComplaint(updatedTarget);
    }

    setEditingNotesId(null);
    alert('[NOTES SAVED] Admin remarks successfully update ho gaye hain.');
  };

  const toggleBlockUser = (email: string) => {
    const updatedUsers = users.map(u => u.email === email ? { ...u, isBlocked: !u.isBlocked } : u);
    setUsers(updatedUsers);
    alert('[USER CONTROL] User access status update ho gaya hai.');
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Location', 'Category', 'Description', 'Priority', 'Status', 'Date'];
    const rows = complaints.map(c => [
      c.id, `"${c.name}"`, c.email, `"${c.location}"`, `"${c.category}"`, `"${c.description.replace(/"/g, '""')}"`, c.priority, c.status, c.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NagrikSetu_Admin_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) return null;

  const filteredComplaints = complaints.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      
      <div>
        {/* Top Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-md opacity-40 animate-pulse"></div>
              <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl border border-emerald-400/40 flex items-center justify-center shadow-lg text-white">
                <ShieldCheck className="w-6 h-6 drop-shadow-md" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400">
                  NAGRIKSETU <span className="text-xs font-mono font-normal text-emerald-400 px-2 py-0.5 bg-emerald-950/60 rounded-full border border-emerald-800">AI COMMAND</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">Municipal Admin Portal &bull; Logged in: <span className="text-emerald-400 font-mono">adminsrinix-2026</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={exportCSV}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-white shadow-lg shadow-emerald-600/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Report</span>
            </button>

            <button 
              onClick={loadData}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer text-slate-300"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Live Data</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Dashboard Body */}
        <main className="max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Total Complaints</p>
              <h3 className="text-2xl font-black text-white">{totalCount}</h3>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Urgent Priority</p>
              <h3 className="text-2xl font-black text-red-400">{urgentCount}</h3>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Registered Users</p>
              <h3 className="text-2xl font-black text-emerald-400">{users.length}</h3>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Frozen Records</p>
              <h3 className="text-2xl font-black text-amber-400">{complaints.filter(c => c.isFrozen).length}</h3>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-1 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Blocked Users</p>
              <h3 className="text-2xl font-black text-red-400">{users.filter(u => u.isBlocked).length}</h3>
            </div>
          </div>

          {/* Navigation Tabs & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Live Heatmap & Overview
              </button>
              <button 
                onClick={() => setActiveTab('complaints')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'complaints' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Grievances Management ({complaints.length})
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'users' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                User Directory & Blocks
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Analytics & Charts
              </button>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search database..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* TAB 1: OVERVIEW & HEATMAP */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Municipal Region Heatmap Pinned Locations</h3>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">GPS Live Active</span>
                </div>
                <p className="text-xs text-slate-400">Click on any complaint item below to inspect details, update status, or send unfreeze requests:</p>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {complaints.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">Abhi tak koi complaint registered nahi hai.</div>
                  ) : (
                    complaints.map(c => (
                      <div key={c.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-emerald-500/50 transition">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white">{c.location} <span className="text-[10px] text-slate-400 font-normal">({c.category})</span></p>
                            <p className="text-[10px] text-slate-400">Citizen: {c.name} &bull; ID: {c.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setSelectedComplaint(c)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1 shadow-md"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview & Status</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
                <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">AI Threat & Priority Matrix</h3>
                <div className="space-y-3 text-xs">
                  <div className="bg-red-950/30 border border-red-900/50 p-3.5 rounded-xl space-y-1">
                    <span className="text-red-400 font-bold">URGENT SEVERITY ({urgentCount})</span>
                    <p className="text-slate-400 text-[11px]">Water leaks, major road hazards, and critical municipal failures requiring immediate dispatch.</p>
                  </div>
                  <div className="bg-amber-950/30 border border-amber-900/50 p-3.5 rounded-xl space-y-1">
                    <span className="text-amber-400 font-bold">HIGH PRIORITY</span>
                    <p className="text-slate-400 text-[11px]">Sanitation backlogs and electricity disruptions needing 24-hour turnaround.</p>
                  </div>
                  <div className="bg-emerald-950/30 border border-emerald-900/50 p-3.5 rounded-xl space-y-1">
                    <span className="text-emerald-400 font-bold">MEDIUM / STANDARD</span>
                    <p className="text-slate-400 text-[11px]">General civic maintenance and infrastructural upkeep.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPLAINTS & GRIEVANCES MANAGEMENT */}
          {activeTab === 'complaints' && (
            <div className="space-y-4">
              {filteredComplaints.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
                  <p>Abhi tak koi complaints registered nahi hain.</p>
                </div>
              ) : (
                filteredComplaints.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md hover:border-slate-700 transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div className="flex items-center space-x-3">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold px-3 py-1 rounded-lg">
                          {item.id}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-bold text-white">{item.name} <span className="text-xs text-slate-400 font-normal">({item.email})</span></h3>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                              item.priority === 'URGENT' ? 'bg-red-950 text-red-400 border-red-800' :
                              item.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                              'bg-emerald-950 text-emerald-400 border-emerald-800'
                            }`}>
                              {item.priority || 'MEDIUM'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{item.location} &bull; {item.date}</span>
                          </p>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center space-x-3">
                        {item.isFrozen && (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>FROZEN</span>
                          </span>
                        )}
                        
                        <button 
                          onClick={() => setSelectedComplaint(item)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage Status & Preview</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 line-clamp-2">
                      <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Description:</span>
                      {item.description}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: USER DIRECTORY & BLOCKS */}
          {activeTab === 'users' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registered Users & Activity Directory</h3>
                <span className="text-xs text-slate-400 font-mono">Total: {filteredUsers.length} Users</span>
              </div>

              <div className="divide-y divide-slate-800">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">No registered users found.</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.email} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/40 transition">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{user.name}</h4>
                          <p className="text-xs text-slate-400">{user.email} &bull; Registered: {user.registeredDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Total Submissions</span>
                          <span className="text-xs font-bold text-emerald-400">{user.totalComplaints} Complaints</span>
                        </div>

                        <button 
                          onClick={() => toggleBlockUser(user.email)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${user.isBlocked ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'}`}
                        >
                          {user.isBlocked ? 'Unblock User' : 'Block User'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS & CHARTS */}
          {activeTab === 'analytics' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-md">
              <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Municipal Resolution & Performance Analytics</h3>
                  <p className="text-xs text-slate-400">Real-time breakdown of grievance categories and resolution rates.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">Resolved Grievances</span>
                  <h4 className="text-3xl font-black text-emerald-400">{resolvedCount} <span className="text-xs text-slate-500 font-normal">({totalCount ? Math.round((resolvedCount/totalCount)*100) : 0}%)</span></h4>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${totalCount ? (resolvedCount/totalCount)*100 : 0}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">In Progress</span>
                  <h4 className="text-3xl font-black text-amber-400">{inProgressCount} <span className="text-xs text-slate-500 font-normal">({totalCount ? Math.round((inProgressCount/totalCount)*100) : 0}%)</span></h4>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${totalCount ? (inProgressCount/totalCount)*100 : 0}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">Pending Queue</span>
                  <h4 className="text-3xl font-black text-red-400">{pendingCount} <span className="text-xs text-slate-500 font-normal">({totalCount ? Math.round((pendingCount/totalCount)*100) : 0}%)</span></h4>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${totalCount ? (pendingCount/totalCount)*100 : 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-400 mt-12 shadow-inner">
        <p>Srinix College of Engineering &bull; All Rights Reserved &copy; 2026</p>
      </footer>

      {/* DETAILED COMPLAINT PREVIEW MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold px-3 py-1.5 rounded-xl">
                  {selectedComplaint.id}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>Complaint & Citizen Profile Details</span>
                  </h3>
                  <p className="text-xs text-slate-400">Registered on: {selectedComplaint.date}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="w-9 h-9 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: User Details & Complaint Data */}
            <div className="space-y-5 text-xs">
              
              {/* Citizen Information Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Citizen Details</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Full Name:</span>
                    <span className="text-slate-200 font-bold text-sm">{selectedComplaint.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Email Address:</span>
                    <span className="text-slate-200 font-mono">{selectedComplaint.email}</span>
                  </div>
                </div>
              </div>

              {/* Location & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Location / Zone:</span>
                  <p className="text-slate-200 font-medium flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{selectedComplaint.location}</span>
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Category & Priority:</span>
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-slate-200 font-bold">{selectedComplaint.category}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      selectedComplaint.priority === 'URGENT' ? 'bg-red-950 text-red-400 border-red-800' :
                      selectedComplaint.priority === 'HIGH' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                      'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}>
                      {selectedComplaint.priority || 'MEDIUM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Complaint Description / Problem Details:</span>
                <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Status Update & Tech Unfreeze Request (Focused Section) */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Status Control & Tech Unfreeze Command</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    {/* Tech Approval Toggle Button */}
                    <button
                      onClick={() => toggleTechApproval(selectedComplaint.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded border transition cursor-pointer flex items-center space-x-1 ${
                        selectedComplaint.techApproved 
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-700' 
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <ShieldAlert className="w-3 h-3" />
                      <span>{selectedComplaint.techApproved ? 'Tech Approved' : 'Request Tech Approval'}</span>
                    </button>

                    {selectedComplaint.isFrozen && (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>FROZEN</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400 font-medium">Set Status:</span>
                    <select 
                      value={selectedComplaint.status}
                      disabled={selectedComplaint.isFrozen}
                      onChange={(e) => handleStatusChange(selectedComplaint.id, e.target.value)}
                      className={`bg-slate-950 border text-xs rounded-xl px-3 py-2 font-bold focus:outline-none ${selectedComplaint.isFrozen ? 'opacity-50 cursor-not-allowed border-amber-500/50 text-amber-300' : 'border-slate-700 text-emerald-400 focus:border-emerald-500 cursor-pointer'}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  {selectedComplaint.isFrozen && !selectedComplaint.unfreezeRequested && (
                    <button 
                      onClick={() => requestUnfreeze(selectedComplaint.id)}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/20"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Send Tech Unfreeze Request</span>
                    </button>
                  )}

                  {selectedComplaint.unfreezeRequested && (
                    <span className="text-xs text-amber-400 italic bg-amber-950/60 px-3 py-2 rounded-xl border border-amber-900 text-center font-medium">
                      &bull; Unfreeze requested to Tech Command...
                    </span>
                  )}
                </div>
              </div>

              {/* Direct Admin Remarks Section inside Modal */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Admin Remarks / Resolution Notes</span>
                  </span>
                  {editingNotesId !== selectedComplaint.id && (
                    <button 
                      onClick={() => { setEditingNotesId(selectedComplaint.id); setTempNotes(selectedComplaint.adminNotes || ''); }}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      {selectedComplaint.adminNotes ? 'Edit Remarks' : '+ Add Remarks'}
                    </button>
                  )}
                </div>

                {editingNotesId === selectedComplaint.id ? (
                  <div className="space-y-2 pt-1">
                    <textarea 
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Enter verification notes..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => setEditingNotesId(null)} className="px-3 py-1.5 bg-slate-800 text-xs text-slate-300 rounded-lg cursor-pointer">Cancel</button>
                      <button onClick={() => saveAdminNotes(selectedComplaint.id)} className="px-3 py-1.5 bg-emerald-600 text-xs font-bold text-white rounded-lg cursor-pointer">Save & Sync</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 italic">
                    {selectedComplaint.adminNotes ? `"${selectedComplaint.adminNotes}"` : 'No admin remarks added yet.'}
                  </p>
                )}
              </div>

              {/* Attached Photo Evidence Button */}
              {selectedComplaint.photoUrl && (
                <div className="pt-2 flex items-center space-x-3">
                  <span className="text-slate-400">Attached Photo Evidence:</span>
                  <button 
                    onClick={() => setSelectedImage(selectedComplaint.photoUrl!)}
                    className="text-emerald-400 underline hover:text-emerald-300 cursor-pointer font-bold"
                  >
                    View Photo
                  </button>
                </div>
              )}

            </div>

            {/* Modal Footer Close Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="px-6 py.2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Image Modal Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-2xl w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-200">Attached Evidence Preview</h3>
              <button onClick={() => setSelectedImage(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl overflow-hidden flex justify-center">
              <img src={selectedImage} alt="Complaint Evidence" className="max-h-[70vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}