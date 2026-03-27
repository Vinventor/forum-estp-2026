'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CoordonneesPage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setError("Veuillez vous reconnecter.");
      return;
    }

    fetch(`http://localhost:3001/api/company-details?email=${encodeURIComponent(email)}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erreur ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => {
        console.error(err);
        setError("Erreur de connexion au serveur (Port 3001)");
      });
  }, []);

  if (error) return <div className="p-20 text-red-500 font-bold text-center italic">{error}</div>;

  if (!profile) return <div className="p-20 italic font-black text-[#002B5C] text-center animate-pulse tracking-widest">RÉCUPÉRATION DES DONNÉES...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans italic text-[#002B5C]">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Fiche Exposant</h1>
          <Link href="/dashboard" className="bg-white px-8 py-3 rounded-full text-[10px] font-black uppercase border">← Retour</Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* SOCIÉTÉ - L'utilisation de ?. évite le crash si la donnée est absente */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
            <span className="text-[10px] font-black uppercase text-blue-500 not-italic tracking-widest">Société</span>
            <Info label="Nom" value={profile.company?.name} />
            <Info label="SIREN" value={profile.company?.siren} />
            <Info label="Adresse" value={profile.company?.address} />
          </div>

          {/* CONTACT */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
            <span className="text-[10px] font-black uppercase text-blue-500 not-italic tracking-widest">Contact</span>
            <Info label="Interlocuteur" value={`${profile.user?.firstName} ${profile.user?.lastName}`} />
            <Info label="Email" value={profile.user?.email} />
            <Info label="Téléphone" value={profile.user?.phone} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-[#002B5C] not-italic">{value || "Non renseigné"}</p>
    </div>
  );
}