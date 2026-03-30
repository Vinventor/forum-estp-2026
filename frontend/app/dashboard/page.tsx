'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forum-estp-2026.onrender.com';

// --- CATALOGUES POUR LES PDF ---
const OPTIONS_CATALOG = [
  { id: '88', label: 'Vidéo de présentation entreprise', price: 375 },
  { id: '89', label: 'Placement du Logo entreprise sur les affiches', price: 700 },
  { id: '90', label: 'Placement du logo entreprise sur les pellicules du photowall', price: 650 },
  { id: '91', label: 'Offre communication', price: 1500 },
  { id: '95', label: 'Logo entreprise sur le tote bag', price: 1500 },
  { id: '100', label: 'Logo entreprise sur la pochette d\'ordinateur', price: 1500 },
  { id: '99', label: 'Logo entreprise sur la sacoche', price: 4000 },
  { id: '102', label: 'Offre visibilité', price: 6250 },
  { id: '93', label: 'Mise en avant sur le plan du forum', price: 320 },
  { id: '94', label: 'Accès à l\'espace VIP toute la journée pour 2 personnes', price: 60 },
  { id: '111', label: 'Promotion de votre entreprise en Story Instagram', price: 150 },
  { id: '112', label: 'Bannière suspendue', price: 495 },
  { id: '113', label: 'Adhésivage sur cloison', price: 280 },
  { id: '114', label: 'Toile imprimée sur châssis', price: 290 },
];

const pricingData: any = {
  simple: { 9: 1680, 12: 2200, 15: 2590, 18: 3085, 21: 3600, 24: 4120, 28: 4740, 32: 5420, 36: 6030 },
  plus: { 9: 2650, 12: 3770, 15: 4160, 18: 4780, 21: 5270, 24: 5890, 28: 6440, 32: 7250, 36: 8280, 40: 9410, 46: 9870, 52: 10900, 60: 12200, 70: 13700, 80: 15290, 90: 17010, 100: 18610, 110: 20320, 120: 21810, 144: 30770, 150: 37450 },
  premium: { 9: 3680, 12: 4710, 15: 5200, 18: 6000 }
};

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

  // Data pour la vue Admin/Sales
  const [companies, setCompanies] = useState([]);
  
  // Data pour la vue User
  const [stats, setStats] = useState({ isBc1Valid: false, isBc2Valid: false });
  const [fullData, setFullData] = useState<any>(null);

  const formatPrice = (num: number) => Math.round(num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedEmail = localStorage.getItem('userEmail');
    const storedId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('user_name');
    const storedCompany = localStorage.getItem('companyName');

    if (!storedEmail) return router.push('/login');

    setRole(storedRole);
    setUserName(storedName || 'Collaborateur');
    setCompanyName(storedCompany || 'Forum ESTP');

    const fetchData = async () => {
      try {
        if (storedRole === 'ADMIN' || storedRole === 'SALES') {
          // APPEL API POUR LE STAFF
          const res = await fetch(`${API_URL}/api/admin/companies?userId=${storedId}&role=${storedRole}`);
          const data = await res.json();
          setCompanies(data);
        } else {
          // APPEL API POUR L'EXPOSANT
          const resStatus = await fetch(`${API_URL}/api/company-status?email=${encodeURIComponent(storedEmail)}`);
          const statusData = await resStatus.json();
          setStats({ isBc1Valid: statusData.isBc1Valid, isBc2Valid: statusData.isBc2Valid });

          const resDetails = await fetch(`${API_URL}/api/company-details?email=${encodeURIComponent(storedEmail)}`);
          const detailsData = await resDetails.json();
          setFullData(detailsData);
        }
      } catch (err) {
        console.error("Erreur de synchronisation :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- LOGIQUE GÉNÉRATION PDF (Partagée Admin/User) ---
  const downloadBC1 = (targetCompany: any) => {
    const doc = new jsPDF();
    const c = targetCompany.company || targetCompany; // Gère les deux structures de données
    const name = c.name || companyName;

    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(22);
    doc.setTextColor(0, 43, 92);
    doc.text("FORUM ESTP 2026", 14, 22);
    doc.setFontSize(9);
    doc.text("BON DE COMMANDE N°1 - STAND & OPTIONS", 14, 30);
    doc.line(14, 35, 196, 35);

    const pack = c.pack?.toLowerCase();
    const surface = c.surface;
    const standHT = (pricingData[pack] && pricingData[pack][surface]) ? pricingData[pack][surface] : 0;
    
    const rows = [[`Pack ${c.pack?.toUpperCase()}`, `${surface} m²`, `${formatPrice(standHT)} €`, `${formatPrice(standHT)} €`]];
    if (c.options) {
      Object.entries(c.options).forEach(([label, qty]: [string, any]) => {
        const item = OPTIONS_CATALOG.find(o => o.label === label);
        const up = item ? item.price : 0;
        rows.push([label, String(qty), `${formatPrice(up)} €`, `${formatPrice(up * qty)} €`]);
      });
    }

    autoTable(doc, {
      startY: 50,
      head: [['Désignation', 'Qté', 'Unit. HT', 'Total HT']],
      body: rows,
      foot: [['', '', 'TOTAL HT', `${formatPrice(c.totalHT || 0)} €`]],
      headStyles: { fillColor: [0, 43, 92] }
    });

    doc.save(`BC1_${name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black italic text-[#002B5C] animate-pulse">Synchronisation du portail...</div>;

  // ==========================================
  // VUE STAFF (ADMIN & SALES)
  // ==========================================
  if (role === 'ADMIN' || role === 'SALES') {
    const totalHT = companies.reduce((acc, c: any) => acc + (c.totalHT || 0) + (c.bc2TotalHT || 0), 0);

    return (
      <div className="min-h-screen bg-gray-50 flex font-sans italic text-[#002B5C]">
        {/* Sidebar Staff */}
        <aside className="w-72 bg-[#002B5C] text-white p-8 flex flex-col h-screen sticky top-0 shadow-2xl">
          <div className="mb-12">
            <h2 className="text-2xl font-black uppercase italic leading-none">Espace<br/>Staff</h2>
            <p className="text-[10px] font-black uppercase text-blue-400 mt-2 tracking-[0.3em] not-italic">{role}</p>
          </div>
          <nav className="flex-1 space-y-2 not-italic">
            <div className="bg-white/10 p-4 rounded-2xl font-bold border border-white/10 flex items-center gap-3">📊 Inscriptions</div>
            <div className="p-4 rounded-2xl text-white/50 flex items-center gap-3">👥 Équipe Commerciale</div>
          </nav>
          <button onClick={handleLogout} className="text-red-400 font-bold uppercase text-xs text-left">← Déconnexion</button>
        </aside>

        {/* Main Content Staff */}
        <main className="flex-1 p-12">
          <header className="flex justify-between items-end mb-16">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Vue d'ensemble</h1>
              <p className="mt-2 text-gray-400 font-bold not-italic">Connecté en tant que {userName}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 text-right">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">CA Total Confirmé</p>
                <p className="text-4xl font-black">{totalHT.toLocaleString()} € <span className="text-xs opacity-30">HT</span></p>
            </div>
          </header>

          <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#002B5C] text-white">
                <tr className="text-[10px] font-black uppercase tracking-widest">
                  <th className="p-6">Entreprise</th>
                  <th className="p-6">Contact</th>
                  <th className="p-6">Stand / Pack</th>
                  <th className="p-6 text-center">Dossier</th>
                  <th className="p-6 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="not-italic">
                {companies.map((c: any) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-blue-50 transition-all group">
                    <td className="p-6 font-black uppercase text-sm">{c.name}</td>
                    <td className="p-6 text-xs font-bold text-gray-500">
                      {c.users?.[0]?.firstName || '---'} <br/>
                      <span className="opacity-50 lowercase">{c.users?.[0]?.email || '---'}</span>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-xs uppercase">{c.pack || 'Non défini'}</p>
                      <p className="text-[10px] text-gray-400">{c.surface ? `${c.surface} m²` : ''}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black ${c.bc1Status === 'VALIDATED' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-300'}`}>BC1</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black ${c.bc2Status === 'VALIDATED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300'}`}>BC2</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <p className="font-black text-sm">{((c.totalHT || 0) + (c.bc2TotalHT || 0)).toLocaleString()} €</p>
                      {c.bc1Status === 'VALIDATED' && (
                        <button onClick={() => downloadBC1(c)} className="text-[9px] font-bold text-blue-600 uppercase hover:underline">Télécharger BC1</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {companies.length === 0 && <p className="p-20 text-center text-gray-400 italic">Aucune entreprise rattachée pour le moment.</p>}
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VUE EXPOSANT (USER)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans italic text-[#002B5C]">
      {/* Sidebar User */}
      <aside className="w-72 bg-[#002B5C] text-white p-8 flex flex-col h-screen sticky top-0 shadow-2xl">
        <div className="mb-12">
          <h2 className="text-2xl font-black uppercase leading-none">Forum<br/>ESTP</h2>
          <p className="text-[10px] font-black text-blue-400 mt-2 tracking-[0.3em] not-italic">EXPOSANT 2026</p>
        </div>
        <nav className="flex-1 space-y-3 not-italic">
          <Link href="/dashboard" className="bg-white/10 p-4 rounded-2xl font-bold border border-white/10 flex items-center gap-3">📊 Dashboard</Link>
          <Link href="/dashboard/bc1" className="p-4 rounded-2xl flex items-center gap-3 hover:bg-white/5 transition-all">🎪 Mon Stand (BC1)</Link>
          <Link href={stats.isBc1Valid ? "/dashboard/bc2" : "#"} className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${stats.isBc1Valid ? 'hover:bg-white/5' : 'opacity-20 cursor-not-allowed'}`}>📦 Logistique (BC2)</Link>
        </nav>
        <button onClick={handleLogout} className="text-red-400 font-bold uppercase text-xs text-left">← Déconnexion</button>
      </aside>

      <main className="flex-1 p-12">
        <header className="mb-16">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Bonjour, <span className="text-blue-600">{userName}</span></h1>
          <p className="mt-2 text-gray-400 font-bold uppercase text-sm tracking-widest not-italic">{companyName}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CARTE BC1 */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <span className="text-6xl font-black opacity-5">01</span>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${stats.isBc1Valid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                {stats.isBc1Valid ? 'Validé' : 'À faire'}
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-8 leading-tight flex-1">Mon Stand &<br/>Options</h3>
            <div className="space-y-3">
              <Link href="/dashboard/bc1" className="block w-full bg-[#002B5C] text-white text-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">Accéder</Link>
              {stats.isBc1Valid && (
                <button onClick={() => downloadBC1(fullData)} className="w-full bg-white text-[#002B5C] border-2 border-[#002B5C] py-4 rounded-2xl font-black uppercase text-xs hover:bg-gray-50 transition-all italic">📥 Télécharger BC1</button>
              )}
            </div>
          </div>

          {/* CARTE BC2 */}
          <div className={`bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col ${!stats.isBc1Valid ? 'opacity-40 grayscale' : ''}`}>
            <div className="flex justify-between items-start mb-10">
              <span className="text-6xl font-black opacity-5">02</span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-400 rounded-full text-[10px] font-black uppercase not-italic">
                {!stats.isBc1Valid ? 'Bloqué' : (stats.isBc2Valid ? 'Validé' : 'À faire')}
              </span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-8 leading-tight flex-1">Logistique &<br/>Mobilier</h3>
            <Link href={stats.isBc1Valid ? "/dashboard/bc2" : "#"} className={`block w-full text-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${stats.isBc1Valid ? 'bg-[#002B5C] text-white hover:bg-black' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>Accéder</Link>
          </div>

          {/* CARTE DOCUMENTS */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <span className="text-6xl font-black opacity-5">03</span>
              <span className="px-4 py-1.5 bg-red-50 text-red-400 rounded-full text-[10px] font-black uppercase not-italic">À faire</span>
            </div>
            <h3 className="text-2xl font-black uppercase mb-8 leading-tight flex-1">Documents &<br/>Logo</h3>
            <Link href="/dashboard/documents" className="block w-full bg-[#002B5C] text-white text-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">Gérer</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
