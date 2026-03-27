'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Utilisation de l'URL dynamique pour Render/Vercel
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forum-estp-2026.onrender.com';

const CATALOGUE = {
  "Mise en avant": [
    { id: 73, name: "Adhésivage sur cloison", price: 280 },
    { id: 74, name: "Toile imprimée sur chassis", price: 290 },
    { id: 4, name: "Bannière suspendue", price: 495 },
    { id: 2, name: "Mise en avant sur le plan", price: 320 },
    { id: 76, name: "Logo sur les pellicules du Photobooth", price: 650 },
    { id: 79, name: "Promotion story Instagram", price: 150 },
    { id: 78, name: "Logo sur le tote bag", price: 1500 },
    { id: 1, name: "Pancarte 40x40", price: 55 },
    { id: 81, name: "Placement d'éléments publicitaires", price: 750 },
    { id: 80, name: "Vidéo de présentation", price: 375 },
    { id: 87, name: "Exposition maquette ou innovation", price: 0 },
  ],
  "Pack Mobilier": [
    { id: 5, name: "Pack DECOUVERTE", price: 385 },
    { id: 88, name: "Pack DECOUVERTE Black", price: 385 },
    { id: 6, name: "Pack RECEPTION", price: 510 },
    { id: 8, name: "Pack RESEAU", price: 600 },
    { id: 9, name: "Pack CONFORT", price: 580 },
    { id: 97, name: "Pack BERGERET", price: 225 },
  ],
  "Mobilier Supplémentaire": [
    { id: 70, name: "Ecran de télévision", price: 450 },
    { id: 45, name: "Machine à café", price: 232 },
    { id: 75, name: "Plante Strelitzia", price: 75 },
    { id: 47, name: "Moquette de couleur noire", price: 16 },
    { id: 69, name: "Moquette de couleur beige", price: 16 },
    { id: 89, name: "Plante Aquatila", price: 95 },
    { id: 11, name: "Tabouret SOHO", price: 70 },
    { id: 56, name: "Tabouret ASPEN", price: 59 },
    { id: 68, name: "Plante Dracaena marginata 3 pieds", price: 80 },
    { id: 57, name: "Table haute ORION", price: 80 },
    { id: 58, name: "Table haute SCANDINAVE", price: 84 },
    { id: 49, name: "Chaise SPIRIT", price: 45 },
    { id: 37, name: "Fauteuil MIDGARD", price: 75 },
    { id: 62, name: "Chaise COSY", price: 64 },
    { id: 65, name: "Fauteuil YOU", price: 84 },
    { id: 61, name: "Table GOYA", price: 62 },
    { id: 60, name: "Table basse FREDERICK", price: 65 },
    { id: 50, name: "Fauteuil BROADWAY", price: 170 },
    { id: 54, name: "Canapé SATELLITE", price: 240 },
    { id: 53, name: "Canapé BARYTON", price: 249 },
    { id: 59, name: "Table basse ORION", price: 70 },
    { id: 64, name: "Réfrigérateur", price: 120 },
  ],
  "Electricité et Internet": [
    { id: 26, name: "Electricité - 3kW 4A", price: 575 },
    { id: 27, name: "Electricité - 4kW 6A", price: 699 },
    { id: 28, name: "Electricité - 6kW 9A", price: 875 },
    { id: 29, name: "Electricité - 8kW 12A", price: 925 },
    { id: 30, name: "Electricité - 10kW 15A", price: 1028 },
    { id: 31, name: "Electricité - 20kW 32A", price: 1233 },
    { id: 32, name: "Elingue non électrique", price: 247 },
    { id: 33, name: "Elingue - Descente d'alimentation 3 à 4kW", price: 232 },
    { id: 34, name: "Elingue - Descente d'alimentation 6 à 10kW", price: 247 },
    { id: 71, name: "Palan manuel", price: 205 },
    { id: 72, name: "Palan motorisé", price: 258 },
    { id: 14, name: "Wifi - 9 à 20 m²", price: 50 },
    { id: 23, name: "Wifi - 24 à 52 m²", price: 100 },
    { id: 24, name: "Wifi - 52 à 80 m²", price: 150 },
    { id: 25, name: "Wifi - >80 m²", price: 200 },
    { id: 100, name: "Coffret de Chantier 3kW", price: 110 },
  ],
  "Standistes": [
    { id: 98, name: "Zones de Stockage (2x6x6m²)", price: 1800 },
    { id: 22, name: "J'ai un standiste", price: 0 },
    { id: 15, name: "Je ne souhaite pas de standiste", price: 0 },
    { id: 21, name: "Je souhaite avoir un standiste", price: 0 },
  ],
  "Restauration & Parking": [
    { id: 16, name: "Déjeuner traiteur", price: 56 },
    { id: 17, name: "Déjeuner traiteur - Végétarien", price: 56 },
    { id: 67, name: "Espace VIP (2 pers.)", price: 60 },
    { id: 19, name: "Place de parking", price: 29 },
  ],
  "Book": [
    { id: 99, name: "Page de Book", price: 720 },
  ]
};

export default function BC2Page() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [openCategory, setOpenCategory] = useState<string | null>("Mise en avant");
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. CHARGEMENT DE L'HISTORIQUE
  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) return router.push('/login');

      try {
        const res = await fetch(`${API_URL}/api/company-details?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        
        if (data.company?.logisticsData) {
          const initialQty: Record<number, number> = {};
          data.company.logisticsData.forEach((savedItem: any) => {
            const catalogItem = Object.values(CATALOGUE).flat().find(i => i.name === savedItem.name);
            if (catalogItem) {
              initialQty[catalogItem.id] = savedItem.qty;
            }
          });
          setQuantities(initialQty);
        }
      } catch (err) {
        console.error("Erreur chargement BC2:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const updateQty = (id: number, delta: number) => {
    setQuantities(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }));
    setMsg('');
  };

  const totalHT = Object.values(CATALOGUE).flat().reduce((acc, item) => {
    return acc + (quantities[item.id] || 0) * item.price;
  }, 0);

  // 2. SAUVEGARDE
  const handleSave = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    
    setMsg("⏳ Validation...");

    const summary = Object.entries(quantities)
      .filter(([_, q]) => q > 0)
      .map(([id, q]) => {
        const item = Object.values(CATALOGUE).flat().find(i => i.id === parseInt(id));
        return { name: item?.name, qty: q, priceUnitHT: item?.price };
      });

    try {
      const res = await fetch(`${API_URL}/api/save-bc2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, logisticsData: summary, totalHT })
      });

      if (res.ok) {
        setMsg("✅ ENREGISTRÉ !");
        setTimeout(() => setMsg(''), 3000);
      } else {
        setMsg("❌ Erreur lors de l'enregistrement.");
      }
    } catch (e) { 
      setMsg("❌ Erreur serveur."); 
    }
  };

  if (loading) return <div className="p-20 font-black italic text-[#002B5C] text-center">Chargement de votre historique...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans italic text-[#002B5C]">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Logistique BC2</h1>
            <p className="text-[10px] font-bold text-gray-400 not-italic uppercase mt-2 tracking-widest">Mobilier & Services 2026</p>
          </div>
          <Link href="/dashboard" className="bg-white px-8 py-2 rounded-full shadow-sm text-[10px] font-black uppercase not-italic border hover:bg-gray-50 transition-all">← Dashboard</Link>
        </header>

        <div className="space-y-4">
          {Object.entries(CATALOGUE).map(([name, items]) => (
            <div key={name} className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
              <button onClick={() => setOpenCategory(openCategory === name ? null : name)} className="w-full p-6 text-left font-black uppercase text-sm flex justify-between group hover:bg-gray-50 transition-all">
                {name} <span className="text-gray-300 group-hover:text-[#002B5C]">{openCategory === name ? '▲' : '▼'}</span>
              </button>
              {openCategory === name && (
                <div className="p-6 pt-0 border-t overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase text-gray-400 font-black">
                        <th className="pb-4">Article</th>
                        <th className="pb-4">Prix Unit.</th>
                        <th className="pb-4 text-center">Quantité</th>
                      </tr>
                    </thead>
                    <tbody className="not-italic">
                      {items.map(i => (
                        <tr key={i.id} className="border-b last:border-0 hover:bg-gray-50 transition-all">
                          <td className="py-4 font-bold">{i.name}</td>
                          <td className="py-4 font-black">{i.price} €</td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button onClick={() => updateQty(i.id, -1)} className="w-7 h-7 bg-gray-100 rounded-lg font-black hover:bg-red-50 hover:text-red-500 transition-all">–</button>
                              <span className="font-black w-4 text-center text-lg">{quantities[i.id] || 0}</span>
                              <button onClick={() => updateQty(i.id, 1)} className="w-7 h-7 bg-[#002B5C] text-white rounded-lg font-black hover:bg-blue-600 transition-all">+</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#002B5C] text-white p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center shadow-2xl gap-8 border-4 border-white">
          <div className="flex gap-10">
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Total HT</p>
              <p className="text-4xl font-black">{totalHT.toLocaleString()} €</p>
            </div>
            <div className="border-l border-white/10 pl-10">
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest text-blue-300">Total TTC (20%)</p>
              <p className="text-4xl font-black text-blue-200">{(totalHT * 1.2).toLocaleString()} €</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
             {msg && <p className="font-bold text-sm text-blue-300 animate-pulse">{msg}</p>}
             <button 
                onClick={handleSave} 
                disabled={totalHT === 0} 
                className={`w-full md:w-auto px-16 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl ${totalHT === 0 ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-white text-[#002B5C] hover:scale-105 active:scale-95'}`}
             >
               Mettre à jour ma commande
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
