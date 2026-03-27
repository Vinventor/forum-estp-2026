'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forum-estp-2026.onrender.com';

const OPTIONS_CATALOG = [
  { id: '88', label: 'Vidéo de présentation entreprise', price: 375 },
  { id: '89', label: 'Placement du Logo entreprise sur les affiches', price: 700 },
  { id: '90', label: 'Placement du logo entreprise sur les pellicules du photowall', price: 650 },
  { id: '91', label: 'Offre communication', price: 1500 },
  { id: '93', label: 'Mise en avant sur le plan du forum', price: 320 },
  { id: '94', label: 'Accès VIP pour 2 personnes', price: 60 },
  { id: '111', label: 'Story Instagram', price: 150 },
  { id: '112', label: 'Bannière suspendue', price: 495 },
  { id: '113', label: 'Adhésivage sur cloison', price: 280 }
];

export default function BC1Page() {
  const router = useRouter();
  const [selection, setSelection] = useState({ pack: 'simple', surface: 9 });
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({});
  const [totalHT, setTotalHT] = useState(0);
  const [loading, setLoading] = useState(true);

  const pricingData: any = {
    simple: { 9: 1680, 12: 2200, 15: 2590, 18: 3085, 21: 3600, 24: 4120, 28: 4740, 32: 5420, 36: 6030 },
    plus: { 9: 2650, 12: 3770, 15: 4160, 18: 4780, 21: 5270, 24: 5890, 28: 6440, 32: 7250, 36: 8280, 40: 9410, 46: 9870, 52: 10900, 60: 12200, 70: 13700, 80: 15290, 90: 17010, 100: 18610, 110: 20320, 120: 21810, 144: 30770, 150: 37450 },
    premium: { 9: 3680, 12: 4710, 15: 5200, 18: 6000 }
  };

  useEffect(() => {
    const loadData = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) return router.push('/login');
      try {
        const res = await fetch(`${API_URL}/api/company-details?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.company) {
            if (data.company.pack) setSelection({ pack: data.company.pack.toLowerCase(), surface: data.company.surface || 9 });
            if (data.company.options) {
              const restored: any = {};
              Object.entries(data.company.options).forEach(([label, qty]) => {
                const opt = OPTIONS_CATALOG.find(o => o.label === label);
                if (opt) restored[opt.id] = qty;
              });
              setSelectedOptions(restored);
            }
          }
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    loadData();
  }, [router]);

  useEffect(() => {
    const standPrice = pricingData[selection.pack][selection.surface] || 0;
    const optionsPrice = OPTIONS_CATALOG.reduce((acc, opt) => acc + (opt.price * (selectedOptions[opt.id] || 0)), 0);
    setTotalHT(standPrice + optionsPrice);
  }, [selection, selectedOptions]);

  const handleSave = async () => {
    const email = localStorage.getItem('userEmail');
    const optionsToSave: any = {};
    Object.entries(selectedOptions).forEach(([id, qty]) => {
      const opt = OPTIONS_CATALOG.find(o => o.id === id);
      if (opt && qty > 0) optionsToSave[opt.label] = qty;
    });

    try {
      const res = await fetch(`${API_URL}/api/save-bc1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pack: selection.pack, surface: selection.surface, options: optionsToSave, totalHT })
      });
      if (res.ok) { router.push('/dashboard'); }
    } catch (e) { alert("Erreur de connexion"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black italic text-[#002B5C]">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-48 font-sans italic text-[#002B5C]">
      <div className="max-w-6xl mx-auto pt-10 px-6">
        <Link href="/dashboard" className="inline-block bg-white px-4 py-2 rounded-full shadow-sm hover:bg-[#002B5C] hover:text-white transition-all mb-10 text-[10px] font-black uppercase not-italic tracking-widest">← Dashboard</Link>
        <h1 className="text-4xl font-black uppercase italic mb-10">Votre Stand 2026</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] shadow-xl h-fit">
            <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Type de Pack</label>
            <select value={selection.pack} onChange={(e) => setSelection({...selection, pack: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl mb-6 font-bold">
              <option value="simple">Pack Simple</option>
              <option value="plus">Pack Plus</option>
              <option value="premium">Pack Premium</option>
            </select>
            <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Surface (m²)</label>
            <select value={selection.surface} onChange={(e) => setSelection({...selection, surface: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 rounded-xl font-bold">
              {Object.keys(pricingData[selection.pack]).map(s => <option key={s} value={s}>{s} m²</option>)}
            </select>
          </div>
          <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPTIONS_CATALOG.map(opt => (
                <div key={opt.id} className="p-6 bg-gray-50 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-black text-[11px] uppercase">{opt.label}</p>
                    <p className="text-blue-500 font-bold not-italic text-[10px]">{opt.price} € HT</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg">
                    <button onClick={() => setSelectedOptions({...selectedOptions, [opt.id]: Math.max(0, (selectedOptions[opt.id] || 0) - 1)})} className="font-bold">-</button>
                    <span className="font-black not-italic">{selectedOptions[opt.id] || 0}</span>
                    <button onClick={() => setSelectedOptions({...selectedOptions, [opt.id]: (selectedOptions[opt.id] || 0) + 1})} className="font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 p-6 border-t flex justify-between items-center max-w-6xl mx-auto rounded-t-3xl shadow-2xl">
        <p className="text-4xl font-black italic">{totalHT.toLocaleString()} € <span className="text-xs not-italic opacity-30">HT</span></p>
        <button onClick={handleSave} className="bg-[#002B5C] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Valider</button>
      </div>
    </div>
  );
}
