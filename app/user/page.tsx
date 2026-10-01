'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldAlert, Award, Globe, Bell, User, LogOut, 
  Send, Mic, MapPin, CheckCircle2, Clock, AlertTriangle, 
  Star, PhoneCall, Shield, Activity, FileText, ChevronRight, X, ExternalLink
} from 'lucide-react';

export default function UserDashboard() {
  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [category, setCategory] = useState('Roads & Infrastructure');
  const [urgency, setUrgency] = useState('Medium Priority');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Advanced Feature States
  const [sammanPoints, setSammanPoints] = useState(150);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: 'ai', text: 'Namaste! Main Setu AI hoon. Aap apni shiqayat yahan likh sakte hain ya bol sakte hain, main aapka form automatically fill kar dunga!' }
  ]);
  
  // Rating Modal State
  const [ratingModalGrievance, setRatingModalGrievance] = useState<any>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  // Dummy Grievance History
  const [grievances, setGrievances] = useState([
    {
      id: 'NS-8492',
      title: 'Broken streetlight near main chowk',
      department: 'Electricity Board',
      urgency: 'Medium',
      location: 'New Delhi, Delhi - 110001',
      status: 'In Progress',
      stepIndex: 3, 
      date: '2026-09-29',
      rating: null,
      feedback: null
    },
    {
      id: 'NS-7321',
      title: 'Pothole leakage on sector 4 road',
      department: 'Municipal Corporation',
      urgency: 'High',
      location: 'Noida, UP - 201301',
      status: 'Resolved & Verified',
      stepIndex: 5,
      date: '2026-09-25',
      rating: 4,
      feedback: 'Quick response by field technician.'
    }
  ]);

  // Load complaints from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nagrik_complaints');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Map to user format if needed
          const mapped = parsed.map((item: any) => ({
            id: item.id || 'NS-9999',
            title: item.description ? item.description.split(':')[0] : 'Civic Grievance',
            department: item.category || 'Municipal Corporation',
            urgency: 'Medium',
            location: item.location || 'Odisha',
            status: item.status || 'Pending',
            stepIndex: item.status === 'Resolved' ? 5 : 2,
            date: item.date || '2026-10-01',
            rating: null,
            feedback: null
          }));
          setGrievances(prev => [...mapped, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Handle Form Submission
  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) {
      alert('Please fill in the grievance title and location.');
      return;
    }
    const newG = {
      id: `NS-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      department: category === 'Roads & Infrastructure' ? 'Municipal Corporation' : 'Electricity Board',
      urgency: urgency.split(' ')[0],
      location: `${location} - ${pincode || '110001'}`,
      status: 'AI Categorized & Assigned',
      stepIndex: 2,
      date: new Date().toISOString().split('T')[0],
      rating: null,
      feedback: null
    };

    const updatedList = [newG, ...grievances];
    setGrievances(updatedList);
    setSammanPoints(prev => prev + 25);

    // Also sync to localStorage so Admin dashboard gets it instantly
    const adminComplaint = {
      id: newG.id,
      name: localStorage.getItem('nagrik_user_name') || 'Ganesh Chandra Sethi',
      email: localStorage.getItem('nagrik_user_email') || 'ganesh@srinix.edu.in',
      govId: 'VERIFIED-ID',
      location: newG.location,
      category: category,
      description: `${title}: ${description}`,
      image: '',
      date: newG.date,
      status: 'Pending',
      isFrozen: false,
      unfreezeRequested: false
    };

    const existingAdmin = JSON.parse(localStorage.getItem('nagrik_complaints') || '[]');
    localStorage.setItem('nagrik_complaints', JSON.stringify([adminComplaint, ...existingAdmin]));

    setTitle('');
    setLocation('');
    setPincode('');
    setDescription('');
    alert('Grievance successfully raised & synced to Command Center! +25 Samman Points added.');
  };

  // Setu AI Assistant Logic
  const handleAiChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userText = aiInput;
    setAiChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setAiInput('');

    setTimeout(() => {
      let reply = "Maine aapki baat samajh li hai.";
      const lower = userText.toLowerCase();

      if (lower.includes('light') || lower.includes('bijli') || lower.includes('pole')) {
        setTitle('Faulty Electric Pole / Streetlight Issue');
        setCategory('Electricity Board');
        setUrgency('High Priority');
        setDescription(userText);
        reply = "Maine 'Electricity Board' category chun li hai aur title set kar diya hai!";
      } else if (lower.includes('water') || lower.includes('paani') || lower.includes('leakage')) {
        setTitle('Water Pipeline Leakage / Supply Issue');
        setCategory('Water & Sanitation');
        setUrgency('High Priority');
        setDescription(userText);
        reply = "Maine water supply issue detect karke form fields update kar diye hain.";
      } else {
        setTitle(userText.slice(0, 40));
        setDescription(userText);
        reply = "Maine aapki shiqayat ka title aur description form mein bhar diya hai. Aap 'Submit Grievance' par click kar sakte hain!";
      }

      setAiChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/55 to-emerald-50 text-gray-900 pb-16">
      
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b-2 border-orange-300 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="bg-gradient-to-tr from-orange-600 via-amber-500 to-emerald-700 text-white p-2 rounded-xl font-bold text-lg shadow-md border border-amber-300">
              NS
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-orange-700 via-amber-800 to-emerald-800 bg-clip-text text-transparent">
                NagrikSetu | Citizen Portal
              </h1>
              <p className="text-[10px] text-orange-700 font-bold uppercase tracking-wider">
                Smart Governance & Grievance Redressal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => setShowPointsModal(true)}
              className="flex items-center space-x-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-extrabold text-amber-900 shadow-sm transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>{sammanPoints} Samman Points</span>
            </button>

            <a 
              href="#emergency-section"
              className="hidden md:flex items-center space-x-1 bg-red-100 hover:bg-red-200 border border-red-300 px-3 py-1.5 rounded-xl text-xs font-extrabold text-red-800 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>Emergency</span>
            </a>

            <div className="flex items-center space-x-2 border-l pl-3 border-gray-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow">
                GS
              </div>
              <a 
                href="/" 
                className="text-xs font-bold text-gray-700 hover:text-red-600 transition flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        
        {/* Setu AI Floating Assistant Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="space-y-2 text-center sm:text-left z-10">
            <div className="inline-flex items-center space-x-1 bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>Setu AI Assistant Active</span>
            </div>
            <h2 className="text-2xl font-black">Need help filing or tracking grievances?</h2>
            <p className="text-xs sm:text-sm text-orange-100 font-medium max-w-xl">
              Talk or chat with Setu AI. It auto-fills forms, checks status instantly, and guides you through municipal procedures.
            </p>
          </div>
          <button 
            onClick={() => setShowAiChat(true)}
            className="z-10 bg-white text-orange-900 hover:bg-amber-100 font-extrabold px-6 py-3 rounded-2xl shadow-lg transition flex items-center space-x-2 text-sm shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Open Setu AI Chat</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Grievance Submission Form */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-orange-100">
              <div>
                <h3 className="text-xl font-black text-gray-900">Raise a New Civic Grievance</h3>
                <p className="text-xs text-gray-600 font-medium">Automated smart routing connects fast administration and redressal.</p>
              </div>
              <span className="text-xs font-bold bg-orange-100 text-orange-800 px-3 py-1 rounded-full border border-orange-300">
                AI-Assisted
              </span>
            </div>

            <form onSubmit={handleSubmitGrievance} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Grievance Title *</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Broken streetlight near main chowk" 
                    className="w-full bg-orange-50/50 border-2 border-orange-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Location & Pincode *</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Search locality..." 
                      className="w-full bg-orange-50/50 border-2 border-orange-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500"
                      required
                    />
                    <input 
                      type="text" 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Pin Code" 
                      className="w-28 bg-orange-50/50 border-2 border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-orange-50/50 border-2 border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option>Roads & Infrastructure</option>
                    <option>Electricity Board</option>
                    <option>Water & Sanitation</option>
                    <option>Public Health & Waste</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Assigned Dept (Auto)</label>
                  <input 
                    type="text" 
                    disabled 
                    value={category === 'Roads & Infrastructure' ? 'Municipal Corporation' : 'Electricity Board'} 
                    className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Urgency Level</label>
                  <select 
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full bg-orange-50/50 border-2 border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500"
                  >
                    <option>Medium Priority</option>
                    <option>High Priority / Urgent</option>
                    <option>Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">Detailed Description & AI Voice Input</label>
                <div className="relative">
                  <textarea 
                    rows={3} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the problem clearly or click mic to speak..." 
                    className="w-full bg-orange-50/50 border-2 border-orange-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-orange-500"
                  ></textarea>
                  <button 
                    type="button"
                    onClick={() => alert('Listening... (Voice-to-Text simulated active)')}
                    className="absolute bottom-3 right-3 bg-orange-200 hover:bg-orange-300 text-orange-900 p-2 rounded-xl transition flex items-center space-x-1 text-xs font-bold cursor-pointer"
                  >
                    <Mic className="w-4 h-4 text-orange-700 animate-pulse" />
                    <span>Voice Input</span>
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-orange-300 rounded-2xl p-4 text-center bg-orange-50/30 hover:bg-orange-50 transition cursor-pointer">
                <p className="text-xs font-bold text-orange-800">📸 Drag & Drop Photo/Evidence or Click to Browse</p>
                <p className="text-[10px] text-gray-500">Supports PNG, JPG, JPEG (Max 15MB)</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-700">Submit Anonymously (Hide identity from public records)</span>
                </label>

                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-orange-600 to-emerald-700 hover:from-orange-700 hover:to-emerald-800 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg transition flex items-center space-x-2 text-sm cursor-pointer"
                >
                  <span>Submit Grievance</span>
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Map Widget & Emergency Bar */}
          <div className="space-y-6">
            
            <div className="bg-white/90 backdrop-blur border-2 border-emerald-200 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <span>Local Area Heatmap</span>
                </h3>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  Live PIN Active
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                Real-time resolved & pending grievances around your current locality.
              </p>
              
              <div className="w-full h-44 bg-gradient-to-tr from-emerald-900 via-teal-800 to-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-emerald-500/40 shadow-inner">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="absolute top-12 left-16 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>Pending Issue</span>
                </div>
                <div className="absolute bottom-10 right-20 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center space-x-1">
                  <span>✓ Resolved</span>
                </div>

                <div className="z-10 text-center bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <p className="text-xs font-bold text-white">📍 Pin 754021 (Jagatpur)</p>
                  <p className="text-[10px] text-emerald-300">3 Active • 12 Resolved Today</p>
                </div>
              </div>
            </div>

            <div id="emergency-section" className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-black text-red-900 flex items-center space-x-2">
                <PhoneCall className="w-5 h-5 text-red-600" />
                <span>Emergency Quick Dial</span>
              </h3>
              <p className="text-xs text-gray-700 font-medium">
                One-click instant helpline numbers for immediate civic and public safety assistance.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <a href="tel:112" className="bg-white hover:bg-red-500 hover:text-white border border-red-200 p-3 rounded-2xl shadow-sm transition flex flex-col items-center text-center group">
                  <span className="text-xs font-bold text-gray-500 group-hover:text-red-100">National Emergency</span>
                  <span className="text-base font-black text-red-700 group-hover:text-white">112</span>
                </a>
                <a href="tel:101" className="bg-white hover:bg-red-500 hover:text-white border border-red-200 p-3 rounded-2xl shadow-sm transition flex flex-col items-center text-center group">
                  <span className="text-xs font-bold text-gray-500 group-hover:text-red-100">Fire & Rescue</span>
                  <span className="text-base font-black text-red-700 group-hover:text-white">101</span>
                </a>
                <a href="tel:102" className="bg-white hover:bg-red-500 hover:text-white border border-red-200 p-3 rounded-2xl shadow-sm transition flex flex-col items-center text-center group">
                  <span className="text-xs font-bold text-gray-500 group-hover:text-red-100">Ambulance</span>
                  <span className="text-base font-black text-red-700 group-hover:text-white">102</span>
                </a>
                <a href="tel:1912" className="bg-white hover:bg-red-500 hover:text-white border border-red-200 p-3 rounded-2xl shadow-sm transition flex flex-col items-center text-center group">
                  <span className="text-xs font-bold text-gray-500 group-hover:text-red-100">Municipal Helpline</span>
                  <span className="text-base font-black text-red-700 group-hover:text-white">1912</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Grievance History */}
        <div className="bg-white/90 backdrop-blur border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4 border-orange-100">
            <div>
              <h3 className="text-xl font-black text-gray-900">Your Grievance History & Live Status</h3>
              <p className="text-xs text-gray-600 font-medium">Track real-time progress, step-by-step timelines, and provide feedback after resolution.</p>
            </div>
            <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-xl border border-amber-300">
              Total Filed: {grievances.length}
            </span>
          </div>

          <div className="space-y-6">
            {grievances.map((g, index) => (
              <div key={g.id + '-' + index} className="bg-orange-50/40 border-2 border-orange-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black bg-orange-600 text-white px-2.5 py-0.5 rounded-md">
                        {g.id}
                      </span>
                      <span className="text-xs font-bold text-gray-500">{g.date}</span>
                    </div>
                    <h4 className="font-extrabold text-base text-gray-900">{g.title}</h4>
                    <p className="text-xs text-gray-600 font-medium">📍 {g.location} • Dept: <span className="font-bold text-orange-800">{g.department}</span></p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                      g.stepIndex === 5 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {g.status}
                    </span>
                    
                    {g.stepIndex === 5 && !g.rating && (
                      <button 
                        onClick={() => setRatingModalGrievance(g)}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow hover:opacity-90 transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Rate Service</span>
                      </button>
                    )}
                    {g.rating && (
                      <span className="text-xs font-bold bg-amber-50 text-amber-800 px-2 py-1 rounded-lg border border-amber-200 flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span>{g.rating} / 5 Rated</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Step-by-Step Visual Timeline */}
                <div className="pt-2 border-t border-orange-200/60">
                  <p className="text-[11px] font-black uppercase text-gray-500 tracking-wider mb-3">Live Progress Timeline</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className={`p-2 rounded-xl border ${g.stepIndex >= 1 ? 'bg-orange-100 border-orange-300 text-orange-900' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                      <div className="text-xs font-black">1. Submitted</div>
                      <div className="text-[10px]">Received & Logged</div>
                    </div>
                    <div className={`p-2 rounded-xl border ${g.stepIndex >= 2 ? 'bg-orange-100 border-orange-300 text-orange-900' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                      <div className="text-xs font-black">2. AI Routed</div>
                      <div className="text-[10px]">Sent to Dept</div>
                    </div>
                    <div className={`p-2 rounded-xl border ${g.stepIndex >= 3 ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                      <div className="text-xs font-black">3. Tech Assigned</div>
                      <div className="text-[10px]">Field Team Dispatched</div>
                    </div>
                    <div className={`p-2 rounded-xl border ${g.stepIndex >= 4 ? 'bg-teal-100 border-teal-300 text-teal-900' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                      <div className="text-xs font-black">4. In Progress</div>
                      <div className="text-[10px]">Action underway</div>
                    </div>
                    <div className={`col-span-2 sm:col-span-1 p-2 rounded-xl border ${g.stepIndex >= 5 ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                      <div className="text-xs font-black">5. Resolved</div>
                      <div className="text-[10px]">Verified & Closed</div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs font-bold text-orange-900 bg-white/60 backdrop-blur border-t border-orange-200 mt-12">
        <p>✨ NagrikSetu Smart Governance • Empowering Citizens with Complete Accountability ✨</p>
      </footer>

      {/* --- MODALS --- */}

      {/* Samman Points & Rewards Modal */}
      {showPointsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border-2 border-amber-300 animate-in fade-in zoom-in">
            <div className="flex justify-between items-center border-b pb-3 border-amber-100">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-black text-gray-900">Samman Points & Rewards</h3>
              </div>
              <button onClick={() => setShowPointsModal(false)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-5 text-center space-y-1 shadow-md">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-100">Your Current Balance</p>
              <h2 className="text-4xl font-black">{sammanPoints} Points</h2>
              <p className="text-xs text-amber-100">Civic Champion Tier • Level 2 Contributor</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase text-gray-600 tracking-wider">Redeemable Digital Badges</p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center font-bold text-amber-900">🛡️</div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Civic Guardian Certificate</h4>
                    <p className="text-[10px] text-gray-600">Cost: 100 Points (Unlocked)</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Owned</span>
              </div>
            </div>

            <button 
              onClick={() => setShowPointsModal(false)}
              className="w-full bg-gray-900 text-white font-extrabold py-3 rounded-xl hover:bg-gray-800 transition text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Setu AI Real Chat Assistant Modal */}
      {showAiChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[550px] flex flex-col shadow-2xl border-2 border-orange-300 overflow-hidden animate-in fade-in zoom-in">
            <div className="bg-gradient-to-r from-orange-600 to-emerald-700 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                <h3 className="font-black text-base">Setu AI Assistant</h3>
              </div>
              <button onClick={() => setShowAiChat(false)} className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-orange-50/30">
              {aiChatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-orange-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-orange-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAiChatSubmit} className="p-3 bg-white border-t border-orange-200 flex gap-2">
              <input 
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Type your issue or prompt Setu AI..."
                className="flex-1 bg-orange-50/50 border border-orange-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
              <button 
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingModalGrievance && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border-2 border-amber-300">
            <div className="flex justify-between items-center border-b pb-3 border-amber-100">
              <h3 className="text-lg font-black text-gray-900">Rate Resolved Service</h3>
              <button onClick={() => setRatingModalGrievance(null)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-xs text-gray-600">Please rate how quickly and effectively the field team resolved your grievance ({ratingModalGrievance.id}).</p>

            <div className="flex justify-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className={`p-1 cursor-pointer transition transform hover:scale-110 ${star <= ratingStars ? 'text-amber-500' : 'text-gray-300'}`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>

            <textarea 
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write optional feedback or comments..."
              className="w-full bg-orange-50/50 border border-orange-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-orange-500"
            ></textarea>

            <button 
              onClick={() => {
                const updated = grievances.map(item => item.id === ratingModalGrievance.id ? { ...item, rating: ratingStars, feedback: feedbackText } : item);
                setGrievances(updated);
                setSammanPoints(prev => prev + 10);
                setRatingModalGrievance(null);
                setFeedbackText('');
                alert('Thank you! Rating submitted successfully and +10 Samman points added.');
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold py-3 rounded-xl hover:opacity-95 transition text-xs shadow-md cursor-pointer"
            >
              Submit Rating & Feedback
            </button>
          </div>
        </div>
      )}

    </div>
  );
}








/* yaha se mobile responsive add kya gaya hai */

