'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Landmark, Users, FileText, Award, LogOut, Sparkles, Church, 
  Palette, Calendar, ShieldCheck, Download, Bot, Send, X, 
  MapPin, CloudSun, AlertTriangle, RefreshCcw, Lock, Unlock, CheckCircle2 
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('grievances');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Detailed Grievances State with User Info & Status History
  const [grievances, setGrievances] = useState([
    {
      id: 'NS-9481',
      name: 'Rajesh Kumar Sharma',
      phone: '+91 98765 43210',
      email: 'rajesh.sharma@gov.in',
      location: 'Varanasi Ghat, Uttar Pradesh',
      category: 'Culture & Infrastructure',
      issue: 'Lighting and cleanliness restoration needed near Dashashwamedh Ghat.',
      status: 'Resolved',
      isFrozen: true,
      unfreezeRequested: false,
      reason: ''
    },
    {
      id: 'NS-9482',
      name: 'Priya Mohapatra',
      phone: '+91 94370 12345',
      email: 'priya.m@gmail.com',
      location: 'Bhubaneswar, Odisha',
      category: 'Heritage Preservation',
      issue: 'Ancient temple corridor restoration delay report.',
      status: 'In Progress',
      isFrozen: false,
      unfreezeRequested: false,
      reason: ''
    },
    {
      id: 'NS-9483',
      name: 'Amitabh Verma',
      phone: '+91 99112 88776',
      email: 'verma.amit@outlook.com',
      location: 'Ayodhya, Uttar Pradesh',
      category: 'Tourism & Facilities',
      issue: 'Pilgrim guidance signboards missing near main heritage route.',
      status: 'Pending Review',
      isFrozen: false,
      unfreezeRequested: false,
      reason: ''
    }
  ]);

  // Unfreeze Modal State
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [unfreezeReasonText, setUnfreezeReasonText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { sender: 'ai', text: 'Namaste! I am NagrikSetu AI Assistant. You can monitor live citizen complaints and status logs here.' }
  ]);

  useEffect(() => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const hasSession = cookies.some(cookie => cookie.startsWith('admin_session=authenticated'));
    
    if (!hasSession) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; max-age=0;";
    router.push('/admin/login');
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setGrievances(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleOpenUnfreezeModal = (grievance: any) => {
    setSelectedGrievance(grievance);
    setUnfreezeReasonText('');
    setIsModalOpen(true);
  };

  const submitUnfreezeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unfreezeReasonText.trim()) return;

    setGrievances(prev => prev.map(item => {
      if (item.id === selectedGrievance.id) {
        return { ...item, unfreezeRequested: true, reason: unfreezeReasonText };
      }
      return item;
    }));

    setIsModalOpen(false);
    alert(`Unfreeze request for Complaint #${selectedGrievance.id} successfully sent to the Tech Team with reason: "${unfreezeReasonText}"`);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatLogs(prev => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');

    setTimeout(() => {
      let reply = "I have logged your query. All citizen complaint statuses are synced live.";
      if (userText.toLowerCase().includes('status') || userText.toLowerCase().includes('complaint')) {
        reply = "Currently there are 3 active high-priority citizen dossiers visible in the admin command center.";
      }
      setChatLogs(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1000);
  };

  const downloadReport = () => {
    const reportData = "NagrikSetu Official Administrative & Citizen Grievance Report\nTotal Grievances: 1,248\nManaged by: Srinix College of Engineering\nStatus: Verified Ministry Record";
    const blob = new Blob([reportData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NagrikSetu_Citizen_Grievances_Report.txt';
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-950 via-slate-900 to-emerald-950 flex items-center justify-center text-white font-bold text-sm tracking-widest">
        VERIFYING REPUBLIC & CULTURAL CLEARANCE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d131a] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative">
      {/* Tricolor Top Accent Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500"></div>

      {/* Emergency Alert Ticker */}
      <div className="bg-orange-950/80 border-b border-orange-500/30 text-orange-200 text-xs py-1.5 px-4 overflow-hidden whitespace-nowrap flex items-center shadow-inner">
        <span className="flex items-center space-x-1 font-black text-orange-400 mr-3 uppercase tracking-wider bg-orange-900/60 px-2 py-0.5 rounded border border-orange-500/40">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Live Alert:
        </span>
        <div className="inline-block animate-marquee font-medium">
          🔔 Kumbh Mela crowd management optimal &bull; Varanasi Ghat lighting verified &bull; GI Tag grant released for Odisha weavers &bull; Ayodhya heritage corridor expansion review in progress
        </div>
      </div>

      {/* Top Header with Stable Ashoka Chakra Emblem */}
      <header className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-2xl relative z-10 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-orange-600 via-amber-600 to-emerald-600 p-0.5 rounded-2xl shadow-lg">
            <div className="bg-slate-900 p-2 rounded-[14px]">
              <Landmark className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-wide text-white drop-shadow">NagrikSetu Command Center</h1>
              <span className="bg-orange-500/20 text-orange-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-orange-500/40">Srinivix College of Engineering</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Satyameva Jayate • Empowering Citizens of India</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={downloadReport}
            className="hidden sm:flex items-center space-x-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export Official Report</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-800 p-4 space-y-2">
          <div className="flex items-center space-x-1.5 px-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Governance Portal</p>
          </div>
          
          <button 
            onClick={() => setActiveTab('grievances')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'grievances' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-900/40 border border-orange-400/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>Public Grievances</span>
          </button>

          <button 
            onClick={() => setActiveTab('heritage')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'heritage' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-900/40 border border-orange-400/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Church className="w-4 h-4 text-amber-300" />
            <span>Temple & Heritage Sites</span>
          </button>

          <button 
            onClick={() => setActiveTab('artisans')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'artisans' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-900/40 border border-orange-400/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Traditional Artisans (Hastakala)</span>
          </button>

          <button 
            onClick={() => setActiveTab('festivals')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'festivals' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-900/40 border border-orange-400/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>Grand Utsav & Festivals</span>
          </button>

          <button 
            onClick={() => setActiveTab('citizens')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'citizens' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-900/40 border border-orange-400/40' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Citizen Registry</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {activeTab === 'grievances' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/90 border-t-4 border-orange-500 border-x border-b border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-sm">
                  <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Total Grievances</p>
                  <h3 className="text-2xl font-black text-white mt-1">1,248</h3>
                  <span className="text-[10px] text-emerald-400 font-bold">+12% new applications</span>
                </div>
                <div className="bg-slate-900/90 border-t-4 border-slate-200 border-x border-b border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-sm">
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Resolved Cases</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">1,120</h3>
                  <span className="text-[10px] text-slate-400 font-bold">89.7% Success Rate</span>
                </div>
                <div className="bg-slate-900/90 border-t-4 border-emerald-500 border-x border-b border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-sm">
                  <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Pending Review</p>
                  <h3 className="text-2xl font-black text-orange-400 mt-1">128</h3>
                  <span className="text-[10px] text-emerald-300 font-bold">Action in progress</span>
                </div>
              </div>

              {/* Detailed Citizen Complaints List */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center space-x-2">
                      <Award className="w-5 h-5 text-orange-400" />
                      <span>Detailed Citizen Grievances & Live Status Control</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Citizens can view live status updates. Admins can request tech unfreeze if status changes erroneously.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {grievances.map((item) => (
                    <div key={item.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 transition hover:border-slate-700">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">{item.id}</span>
                            <h3 className="text-sm font-bold text-white">{item.name}</h3>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">📞 {item.phone} &bull; ✉️ {item.email} &bull; 📍 {item.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400 font-medium">Live Status:</span>
                          <select 
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs text-white font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-amber-300">Category: {item.category}</p>
                        <p className="text-xs text-slate-300 mt-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">{item.issue}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                        <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Synced to Citizen Portal: Status is currently <strong className="text-white underline">{item.status}</strong></span>
                        </div>

                        <div>
                          {item.unfreezeRequested ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold text-[11px] inline-flex items-center space-x-1">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Unfreeze Requested to Tech Team</span>
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleOpenUnfreezeModal(item)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer inline-flex items-center space-x-1.5"
                            >
                              <RefreshCcw className="w-3.5 h-3.5 text-orange-400" />
                              <span>Mistaken Status? Request Tech Unfreeze</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {item.unfreezeRequested && item.reason && (
                        <div className="bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-xl text-[11px] text-amber-200/80">
                          <strong>Tech Request Reason:</strong> {item.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'heritage' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500"></div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 pt-1">
                <Church className="w-5 h-5 text-amber-400" />
                <span>Temple & Historical Monument Conservation</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Monitor nationwide ancient architecture restoration projects, pilgrim crowd management networks, and digital preservation logs of protected monuments.
              </p>
            </div>
          )}

          {activeTab === 'artisans' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500"></div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 pt-1">
                <Palette className="w-5 h-5 text-emerald-400" />
                <span>Traditional Artisans & Weavers (Hastakala)</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Empowering local handloom weavers, traditional pottery makers, and rural craftsmen with direct digital marketplace connectivity and government grants.
              </p>
            </div>
          )}

          {activeTab === 'festivals' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500"></div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 pt-1">
                <Calendar className="w-5 h-5 text-orange-400" />
                <span>Grand Utsav & Cultural Festival Management</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Command center for planning and coordinating security, sanitation, and logistics for massive spiritual gatherings and state-level cultural festivals.
              </p>
            </div>
          )}

          {activeTab === 'citizens' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-500"></div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 pt-1">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Citizen Database & Verified Registry</span>
              </h2>
              <p className="text-sm text-slate-300">Total active registered citizens utilizing NagrikSetu portal services across India: <span className="text-emerald-400 font-bold">45,210+</span></p>
            </div>
          )}

          {/* Institutional Copyright Footer */}
          <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 pb-2">
            <p>© 2026 Srinivix College of Engineering. All rights reserved.</p>
            <p className="text-[10px] text-slate-600 mt-0.5">NagrikSetu Command Center • Designed & Managed for Academic Excellence & Public Governance.</p>
          </div>
        </main>
      </div>

      {/* Unfreeze Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-orange-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Lock className="w-4 h-4 text-orange-400" />
                <span>Request Tech Team to Unfreeze Complaint #{selectedGrievance?.id}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Please specify the reason why this complaint status was updated erroneously and requires correction by the technical department:
            </p>

            <form onSubmit={submitUnfreezeRequest} className="space-y-4">
              <textarea 
                rows={3}
                value={unfreezeReasonText}
                onChange={(e) => setUnfreezeReasonText(e.target.value)}
                placeholder="Enter clear reason (e.g. Status changed to Resolved by mistake before field verification)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                required
              />

              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition shadow-lg"
                >
                  Submit Request to Tech Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Cultural Assistant Widget (NagrikSetu AI) */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white p-4 rounded-full shadow-2xl flex items-center space-x-2 border border-orange-300/40 cursor-pointer transition transform hover:scale-105"
          >
            <Bot className="w-6 h-6" />
            <span className="text-xs font-bold pr-1">NagrikSetu AI</span>
          </button>
        ) : (
          <div className="bg-slate-900 border border-orange-500/40 rounded-3xl w-80 sm:w-96 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-orange-950 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-orange-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">NagrikSetu AI Assistant</h3>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 h-64 overflow-y-auto space-y-3 bg-slate-950/60 text-xs">
              {chatLogs.map((log, idx) => (
                <div key={idx} className={`flex ${log.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] ${log.sender === 'user' ? 'bg-orange-600 text-white rounded-br-none' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'}`}>
                    {log.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about citizen grievances..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <button 
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-xl cursor-pointer transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}