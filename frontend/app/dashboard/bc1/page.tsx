'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const OPTIONS_CATALOG = [
  { id: '88', label: 'Vidéo de présentation entreprise', price: 375 },
  { id: '89', label: 'Placement du Logo entreprise sur les affiches', price: 700 },
  { id: '90', label: 'Placement du logo entreprise sur les pellicules du photowall', price: 650 },
  { id: '91', label: 'Offre communication', price: 1500 },
  { id: '95', label: 'Logo entreprise sur le tote bag', price: 1500 },
  { id: '100', label: 'Logo entreprise sur la pochette d’ordinateur', price: 1500 },
  { id: '99', label: 'Logo entreprise sur la sacoche', price: 4000 },
  { id: '102', label: 'Offre visibilité', price: 6250 },
  { id: '93', label: 'Mise en avant sur le plan du forum', price: 320 },
  { id: '94', label: 'Accès à l\'espace VIP toute la journée pour 2 personnes', price: 60 },
  { id: '96', label: 'Visibilité sur Seekube', price: 900 },
  { id: '101', label: 'Placement d\'éléments publicitaires', price: 750 },
  { id: '103', label: 'Pancarte 40x40 cm', price: 55 },
  { id: '104', label: 'Mise en avant de nouveautés sur stand', price: 0 },
  { id: '111', label: 'Promotion de votre entreprise en Story Instagram', price: 150 },
  { id: '105', label: 'Book - Option 1', price: 720 },
  { id: '106', label: 'Book - Option 2', price: 720 },
  { id: '107', label: 'Book - Option 3', price: 720 },
  { id: '108', label: 'Book - Option 4', price: 2500 },
  { id: '109', label: 'Book - Option 5', price: 3500 },
  { id: '112', label: 'Bannière suspendue', price: 495 },
  { id: '113', label: 'Adhésivage sur cloison', price: 280 },
  { id: '114', label: 'Toile imprimée sur châssis', price: 290 },
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

  // --- 1. CHARGEMENT INITIAL (MÉMOIRE) ---
  useEffect(() => {
    const loadSavedData = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;

      try {
        const res = await fetch(`${API_URL}/api/login`, { ... });
        if (res.ok) {
          const data = await res.json();
          
          // On restaure le stand
          if (data.pack) setSelection({ pack: data.pack, surface: data.surface || 9 });

          // On restaure les options (Traduction Nom -> ID)
          if (data.options) {
            const restoredOptions: { [key: string]: number } = {};
            
            // On boucle sur ce que la DB nous envoie (ex: { "Vidéo...": 1 })
            Object.entries(data.options).forEach(([label, qty]) => {
              const optionFound = OPTIONS_CATALOG.find(o => o.label === label);
              if (optionFound) {
                restoredOptions[optionFound.id] = qty as number;
              }
            });
            setSelectedOptions(restoredOptions);
          }
        }
      } catch (err) {
        console.error("Erreur de chargement", err);
      } finally {
        setLoading(false);
      }
    };
    loadSavedData();
  }, []);

  // --- 2. CALCUL DU TOTAL ---
  useEffect(() => {
    const standPrice = pricingData[selection.pack][selection.surface] || 0;
    const optionsPrice = OPTIONS_CATALOG.reduce((acc, opt) => {
      return acc + (opt.price * (selectedOptions[opt.id] || 0));
    }, 0);
    setTotalHT(standPrice + optionsPrice);
  }, [selection, selectedOptions]);

  const updateOptionQty = (id: string, delta: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handleSave = async () => {
    const userEmail = localStorage.getItem('userEmail');
    
    // On prépare les données avec les NOMS pour la DB
    const optionsToSave: { [key: string]: number } = {};
    Object.entries(selectedOptions).forEach(([id, qty]) => {
      if (qty > 0) {
        const details = OPTIONS_CATALOG.find(o => o.id === id);
        if (details) optionsToSave[details.label] = qty;
      }
    });

    try {
      const res = await fetch(`${API_URL}/api/login`, { ... }), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          pack: selection.pack,
          surface: selection.surface,
          options: optionsToSave,
          totalHT: totalHT
        })
      });

      if (res.ok) {
        alert("✅ Choix mémorisés avec succès !");
        router.push('/dashboard');
      }
    } catch (e) {
      alert("Erreur de connexion");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center italic font-black text-[#002B5C]">Chargement de vos choix...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-48 font-sans italic text-[#002B5C]">
      {/* ... (Le reste du code HTML reste identique à celui d'avant) ... */}
      <div className="max-w-6xl mx-auto pt-10 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <Link href="/dashboard" className="font-black uppercase text-[10px] tracking-[0.2em] bg-white px-4 py-2 rounded-full shadow-sm hover:bg-blue-900 hover:text-white transition-all not-italic">
                ← Retour au Dashboard
            </Link>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">Votre Commande 2026</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 block not-italic">01. Configuration</span>
              <div className="space-y-8 not-italic">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-2">Type de Pack</label>
                  <select 
                    value={selection.pack}
                    onChange={(e) => setSelection({...selection, pack: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-900 transition-all appearance-none"
                  >
                    <option value="simple">Pack Simple</option>
                    <option value="plus">Pack Plus</option>
                    <option value="premium">Pack Premium</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-2">Surface du stand</label>
                  <select 
                    value={selection.surface}
                    onChange={(e) => setSelection({...selection, surface: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none focus:border-blue-900 transition-all appearance-none"
                  >
                    {Object.keys(pricingData[selection.pack]).map(size => (
                      <option key={size} value={size}>{size} m² — {pricingData[selection.pack][size].toLocaleString()} €</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-8 block not-italic">02. Catalogue de communication</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {OPTIONS_CATALOG.map((opt) => (
                <div key={opt.id} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-blue-200 hover:bg-white transition-all flex flex-col justify-between min-h-[140px]">
                  <div className="mb-4">
                    <p className="text-[11px] font-black uppercase leading-tight tracking-tight mb-2">{opt.label}</p>
                    <p className="text-blue-500 font-bold not-italic text-[10px] tracking-wider">{opt.price.toLocaleString()} € HT</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/50">
                    <span className="text-[9px] font-black text-gray-300 uppercase not-italic">Quantité</span>
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                      <button onClick={() => updateOptionQty(opt.id, -1)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:text-red-500 transition-colors not-italic">-</button>
                      <span className="font-black not-italic text-sm w-4 text-center">{selectedOptions[opt.id] || 0}</span>
                      <button onClick={() => updateOptionQty(opt.id, 1)} className="w-8 h-8 flex items-center justify-center font-bold text-[#002B5C] hover:text-blue-600 transition-colors not-italic">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-6 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1 not-italic">Total de votre commande</p>
              <p className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">{totalHT.toLocaleString()} € <span className="text-xs not-italic font-bold opacity-30">HT</span></p>
          </div>
          <button 
            onClick={handleSave}
            className="w-full md:w-auto bg-[#002B5C] text-white px-16 py-6 rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl active:scale-95 not-italic"
          >
            Valider la réservation
          </button>
        </div>
      </div>
    </div>
  );
}
