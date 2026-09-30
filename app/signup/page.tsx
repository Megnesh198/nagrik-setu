'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    govtProofType: 'Aadhaar',
    govtProofNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Registration successful! Welcome email sent.');
        router.push('/login');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col items-center justify-center px-4 py-12 font-sans relative">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center space-x-2 px-4 py-2 bg-white/80 hover:bg-white text-orange-900 border border-orange-200 rounded-lg shadow-sm font-semibold transition"
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200 p-8 mt-6">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-orange-600 rounded-full items-center justify-center text-white font-bold text-2xl shadow-md mb-3">
            न
          </div>
          <h2 className="text-3xl font-black text-stone-900">NagrikSetu Registration</h2>
          <p className="text-sm text-stone-600 mt-1">Verified Smart City Grievance Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-600 focus:outline-none bg-white text-stone-800"
              placeholder="Aapka Naam"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-600 focus:outline-none bg-white text-stone-800"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-600 focus:outline-none bg-white text-stone-800"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">Govt ID Type</label>
              <select
                name="govtProofType"
                value={formData.govtProofType}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-600 focus:outline-none bg-white text-stone-800 text-sm"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="VoterID">Voter ID</option>
                <option value="PAN">PAN Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">ID Number</label>
              <input
                type="text"
                name="govtProofNumber"
                required
                value={formData.govtProofNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-orange-600 focus:outline-none bg-white text-stone-800"
                placeholder="Proof Number"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 bg-orange-700 text-white font-bold rounded-xl shadow-lg hover:bg-orange-800 transition transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? 'Verifying & Registering...' : 'Register Securely'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-orange-700 font-bold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}