'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credentials check
    if (adminId === 'adminsrinix-2026' && password === 'Srinix@2026') {
      // Session storage mein auth set karna
      sessionStorage.setItem('nagrik_admin_auth', 'true');
      
      // Seedhe admin dashboard par redirect karna
      router.push('/admin/dashboard');
    } else {
      setError('Invalid Admin ID or Password!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-emerald-400">Admin Portal Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Admin ID</label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
              placeholder="Enter Admin ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 text-white"
              placeholder="Enter Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 transition-colors font-medium rounded-lg text-white shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}