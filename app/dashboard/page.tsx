'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldAlert, Award, Globe, Bell, User, LogOut, 
  Send, Mic, MapPin, CheckCircle2, Clock, AlertTriangle, 
  Star, PhoneCall, Shield, Activity, FileText, ChevronRight, X, ExternalLink,
  Search, Filter, Upload, Image as ImageIcon, Calendar
} from 'lucide-react';

export default function UserDashboard() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [category, setCategory] = useState('Roads & Infrastructure');
  const [urgency, setUrgency] = useState('Medium Priority');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Digital Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Interactive Features State
  const [mapPinnedCoords, setMapPinnedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [sammanPoints, setSammanPoints] = useState(150);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: 'ai', text: 'Namaste! Main Setu AI hoon. Aap apni shiqayat yahan likh sakte hain ya bol sakte hain, main aapka form automatically fill kar dunga!' }
  ]);

  const [grievances, setGrievances] = useState<Array<{
    id: string;
    title: string;
    department: string;
    urgency: string;
    location: string;
    status: string;
    stepIndex: number;
    date: string;
    image: string | null;
  }>>([
    {
      id: 'NS-8492',
      title: 'Broken streetlight near main chowk',
      department: 'Electricity Board',
      urgency: 'Medium',
      location: 'New Delhi, Delhi - 110001',
      status: 'In Progress',
      stepIndex: 3, 
      date: '2026-09-29',
      image: null
    }
  ]);

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nagrik_complaints');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const mapped = parsed.map((item: any) => ({
            id: item.id || 'NS-9999',
            title: item.description ? item.description.split(':')[0] : 'Civic Grievance',
            department: item.category || 'Municipal Corporation',
            urgency: 'Medium',
            location: item.location || 'Odisha',
            status: item.status || 'Pending',
            stepIndex: item.status === 'Resolved' ? 5 : 2,
            date: item.date || '2026-10-01',
            image: item.image ? String(item.image) : null
          }));
          setGrievances(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Handle Photo Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Map Click Simulation
  const handleMapClickSim = () => {
    const simulatedLat = 20.4625 + (Math.random() - 0.5) * 0.05;
    const simulatedLng = 85.8828 + (Math.random() - 0.5) * 0.05;
    setMapPinnedCoords({ lat: simulatedLat, lng: simulatedLng });
    setLocation(`Jagatpur Industrial Area (Pinned: ${simulatedLat.toFixed(4)}, ${simulatedLng.toFixed(4)})`);
    setPincode('754021');
    alert(`📍 GPS Pin Dropped Successfully!\nLatitude: ${simulatedLat.toFixed(4)}, Longitude: ${simulatedLng.toFixed(4)}`);
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) {
      alert('Please fill in the grievance title and location.');
      return;
    }

    const newId = `NS-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentDate = new Date().toISOString().split('T')[0];

    const newAdminComplaint = {
      id: newId,
      name: localStorage.getItem('nagrik_user_name') || 'Ganesh Chandra Sethi',
      email: localStorage.getItem('nagrik_user_email') || 'ganesh@srinix.edu.in',
      govId: 'AADHAAR-VERIFIED',
      location: `${location} - ${pincode || '110001'}`,
      category: category,
      description: `${title}: ${description}`,
      image: imagePreview || '',
      date: currentDate,
      status: 'Pending',
      isFrozen: false,
      unfreezeRequested: false
    };

    const existingAdmin = JSON.parse(localStorage.getItem('nagrik_complaints') || '[]');
    const updatedAdminList = [newAdminComplaint, ...existingAdmin];
    localStorage.setItem('nagrik_complaints', JSON.stringify(updatedAdminList));

    const newUserItem = {
      id: newId,
      title,
      department: category,
      urgency: urgency.split(' ')[0],
      location: `${location} - ${pincode || '110001'}`,
      status: 'Pending',
      stepIndex: 1,
      date: currentDate,
      image: imagePreview
    };
    setGrievances([newUserItem, ...grievances]);
    setSammanPoints(prev => prev + 25);

    setTitle('');
    setLocation('');
    setPincode('');
    setDescription('');
    setSelectedImage(null);
    setImagePreview(null);
    setMapPinnedCoords(null);
    alert('Grievance successfully submitted and instantly synced! +25 Samman Points added.');
  };

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

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.id.toLowerCase().includes(searchQuery.toLowerCase()) || g.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || g.department === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/55 to-emerald-50 text-gray-900 pb-16">
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
            <div className="hidden xl:flex items-center space-x-1.5 bg-orange-100/70 border border-orange-300 px-3 py-1.5 rounded-xl text-xs font-black text-orange-900">
              <Clock className="w-4 h-4 text-orange-700" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>

            <button 
              onClick={() => setShowPointsModal(true)}
              className="flex items-center space-x-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-extrabold text-amber-900 shadow-sm transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>{sammanPoints} Samman Points</span>
            </button>

            <div className="flex items-center space-x-2 border-l pl-3 border-gray-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow">
                GS
              </div>
              <a href="/" className="text-xs font-bold text-gray-700 hover:text-red-600 transition flex items-center space-x-1">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        
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
                      placeholder="Search locality or use Pin button..." 
                      className="w-full bg-orange-50/50 border-2 border-orange-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500"
                      required
                    />
                    <input 
                      type="text" 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Pin" 
                      className="w-24 bg-orange-50/50 border-2 border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-emerald-900 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Interactive OpenStreetMap Pinpoint Widget</span>
                  </span>
                  <button 
                    type="button"
                    onClick={handleMapClickSim}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition cursor-pointer flex items-center space-x-1"
                  >
                    <span>📍 Drop Pin on Map</span>
                  </button>
                </div>
                <div className="w-full h-32 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-emerald-400">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:14px_14px]"></div>
                  {mapPinnedCoords ? (
                    <div className="z-10 text-center bg-emerald-950/90 border border-emerald-400 px-4 py-2 rounded-xl text-white shadow-lg">
                      <p className="text-xs font-bold text-emerald-300">✓ Exact GPS Captured</p>
                      <p className="text-[10px] text-gray-300">Lat: {mapPinnedCoords.lat.toFixed(4)} | Lng: {mapPinnedCoords.lng.toFixed(4)}</p>
                    </div>
                  ) : (
                    <div className="z-10 text-center text-gray-300">
                      <p className="text-xs font-bold">Click "Drop Pin on Map" to automatically capture exact coordinates</p>
                    </div>
                  )}
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

              <div className="border-2 border-dashed border-orange-300 rounded-2xl p-4 text-center bg-orange-50/30 hover:bg-orange-50 transition relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                  <ImageIcon className="w-8 h-8 text-orange-600" />
                  <p className="text-xs font-bold text-orange-800">
                    {selectedImage ? `Selected: ${selectedImage.name}` : 'Click to Upload Photo Evidence or Drag & Drop'}
                  </p>
                  <p className="text-[10px] text-gray-500">Supports PNG, JPG, JPEG (Max 15MB)</p>
                  {imagePreview && (
                    <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-orange-400 shadow">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-700">Submit Anonymously</span>
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

        <div className="bg-white/90 backdrop-blur border-2 border-orange-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-4 border-orange-100">
            <div>
              <h3 className="text-xl font-black text-gray-900">Your Grievance History & Live Status</h3>
              <p className="text-xs text-gray-600 font-medium">Click on any grievance card to view Step-by-Step Stepper Timeline Modal.</p>
            </div>
            <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-xl border border-amber-300">
              Total Filed: {grievances.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-orange-50/70 p-4 rounded-2xl border border-orange-200">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-orange-600" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, title, or location..."
                className="w-full bg-white border border-orange-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-orange-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-orange-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-white border border-orange-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-orange-500"
              >
                <option value="All">All Departments</option>
                <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                <option value="Electricity Board">Electricity Board</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredGrievances.length === 0 ? (
              <p className="text-center text-xs font-bold text-gray-500 py-6">No matching grievances found.</p>
            ) : (
              filteredGrievances.map((g) => (
                <div 
                  key={g.id} 
                  onClick={() => setSelectedTimelineItem(g)}
                  className="bg-orange-50/40 hover:bg-orange-100/60 border-2 border-orange-200/80 rounded-2xl p-5 space-y-4 shadow-sm transition cursor-pointer"
                >
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
                      <span className="text-xs font-bold text-orange-700 underline">View Timeline ➔</span>
                    </div>
                  </div>

                  {g.image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-orange-300">
                      <img src={g.image} alt="Evidence" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      <footer className="py-6 text-center text-xs font-bold text-orange-900 bg-white/60 backdrop-blur border-t border-orange-200 mt-12">
        <p>✨ NagrikSetu Smart Governance • Empowering Citizens with Complete Accountability ✨</p>
      </footer>

      {selectedTimelineItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 border-2 border-orange-300">
            <div className="flex justify-between items-center border-b pb-3 border-orange-100">
              <div>
                <span className="text-xs font-bold bg-orange-600 text-white px-2 py-0.5 rounded">{selectedTimelineItem.id}</span>
                <h3 className="text-base font-black text-gray-900 mt-1">{selectedTimelineItem.title}</h3>
              </div>
              <button onClick={() => setSelectedTimelineItem(null)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Step-by-Step Live Redressal Timeline</p>
              
              <div className="space-y-3">
                <div className={`p-3 rounded-2xl border flex items-center space-x-3 ${selectedTimelineItem.stepIndex >= 1 ? 'bg-orange-50 border-orange-300 text-orange-900' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${selectedTimelineItem.stepIndex >= 1 ? 'text-orange-600' : 'text-gray-300'}`} />
                  <div>
                    <p className="text-xs font-black">Step 1: Submitted</p>
                    <p className="text-[10px]">Grievance successfully received and logged into portal.</p>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border flex items-center space-x-3 ${selectedTimelineItem.stepIndex >= 2 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${selectedTimelineItem.stepIndex >= 2 ? 'text-amber-600' : 'text-gray-300'}`} />
                  <div>
                    <p className="text-xs font-black">Step 2: AI Verified & Routed</p>
                    <p className="text-[10px]">AI analyzed severity and assigned to {selectedTimelineItem.department}.</p>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border flex items-center space-x-3 ${selectedTimelineItem.stepIndex >= 3 ? 'bg-teal-50 border-teal-300 text-teal-900' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${selectedTimelineItem.stepIndex >= 3 ? 'text-teal-600' : 'text-gray-300'}`} />
                  <div>
                    <p className="text-xs font-black">Step 3: Assigned to Ward Officer</p>
                    <p className="text-[10px]">Field technician team dispatched to location.</p>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border flex items-center space-x-3 ${selectedTimelineItem.stepIndex >= 5 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  <CheckCircle2 className={`w-5 h-5 ${selectedTimelineItem.stepIndex >= 5 ? 'text-emerald-600' : 'text-gray-300'}`} />
                  <div>
                    <p className="text-xs font-black">Step 4: Resolved with Photo Proof</p>
                    <p className="text-[10px]">Action completed and verified by municipal authority.</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTimelineItem(null)}
              className="w-full bg-gray-900 text-white font-extrabold py-3 rounded-xl hover:bg-gray-800 transition text-sm cursor-pointer"
            >
              Close Timeline
            </button>
          </div>
        </div>
      )}

      {showPointsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border-2 border-amber-300">
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

            <button 
              onClick={() => setShowPointsModal(false)}
              className="w-full bg-gray-900 text-white font-extrabold py-3 rounded-xl hover:bg-gray-800 transition text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAiChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[550px] flex flex-col shadow-2xl border-2 border-orange-300 overflow-hidden">
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
              {aiChatMessages.link ? null : aiChatMessages.map((msg, index) => (
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
    </div>
  );
}