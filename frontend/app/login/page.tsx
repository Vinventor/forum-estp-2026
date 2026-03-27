'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forum-estp-2026.onrender.com';
      
      // ON ENVOIE LA REQUÊTE (C'est cette ligne qui manquait !)
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json(); 
        localStorage.clear();
        localStorage.setItem('user_name', data.firstName);
        localStorage.setItem('companyName', data.companyName);
        localStorage.setItem('userEmail', data.email);
        router.push('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect.');
      }
    } catch (err) {
      setError('Impossible de joindre le serveur. Vérifiez votre connexion.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-black font-sans italic">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#002B5C] uppercase tracking-tighter">Forum ESTP</h1>
          <p className="text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-widest not-italic">Espace Exposant 2026</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-xs font-bold not-italic">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 not-italic">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email professionnel</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-gray-100 p-3 focus:border-[#002B5C] outline-none font-bold transition-all"
              placeholder="contact@entreprise.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-100 p-3 focus:border-[#002B5C] outline-none font-bold transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-[#002B5C] text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg uppercase tracking-widest mt-4">
            Se connecter
          </button>
        </form>

        <div className="mt-10 text-center text-[10px] border-t pt-8 border-gray-100 font-bold uppercase tracking-widest">
          <p className="text-gray-400">Pas encore inscrit ? <Link href="/register" className="text-blue-600 hover:underline">Créer un compte</Link></p>
        </div>
      </div>
    </div>
  );
}
