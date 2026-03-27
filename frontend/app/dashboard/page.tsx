'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';

// Utilisation de l'URL de ton backend Render
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://forum-estp-2026.onrender.com';

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
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('Chargement...');
  const [fullData, setFullData] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const formatPrice = (num: number) => Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = localStorage.getItem('userEmail');
      const storedName = localStorage.getItem('user_name');
      const storedCompany = localStorage.getItem('companyName');

      if (!userEmail) return router.push('/login');

      // Affichage immédiat depuis le cache
      setUserName(storedName || 'Exposant');
      setCompanyName(storedCompany || 'Votre Entreprise');

      try {
        const resStatus = await fetch(`${API_URL}/api/company-status?email=${encodeURIComponent(userEmail)}`);
        const statusData = await resStatus.json();
        setStatus(statusData);
        if(statusData.companyName) setCompanyName(statusData.companyName);

        const resDetails = await fetch(`${API_URL}/api/company-details?email=${encodeURIComponent(userEmail)}`);
        const detailsData = await resDetails.json();
        setFullData(detailsData);
      } catch (err) {
        console.error("Erreur synchronisation serveur :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // --- HEADER COMMUN AUX PDF ---
  const applyHeader = (doc: jsPDF, title: string) => {
    const navy: [number, number, number] = [0, 43, 92];
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(22);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text("FORUM ESTP 2026", 14, 22);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(title, 14, 30);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 165, 22);
    doc.line(14, 35, 196, 35);
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("EXPOSANT :", 14, 48);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.text(companyName.toUpperCase(), 14, 55);
  };

  const generateBC1PDF = () => {
    if (!fullData || !fullData.company) return;
    const doc = new jsPDF();
    applyHeader(doc, "BON DE COMMANDE N°1 - STAND & OPTIONS");
    
    const pack = fullData.company.pack?.toLowerCase();
    const surface = fullData.company.surface;
    const standHT = (pricingData[pack] && pricingData[pack][surface]) ? pricingData[pack][surface] : 0;
    
    const rows = [[
      `Pack ${fullData.company.pack?.toUpperCase()}`, 
      `${surface} m²`, 
      `${formatPrice(standHT)} €`, 
      `${formatPrice(standHT)} €`
    ]];

    if (fullData.company.options) {
      Object.entries(fullData.company.options).forEach(([label, qty]: [string, any]) => {
        const item = OPTIONS_CATALOG.find(o => o.label === label);
        const up = item ? item.price : 0;
        rows.push([label, String(qty), `${formatPrice(up)} €`, `${formatPrice(up * qty)} €`]);
      });
    }

    autoTable(doc, {
      startY: 65,
      head: [['Désignation', 'Qté', 'Unitaire HT', 'Total HT']],
      body: rows,
      headStyles: { fillColor: [0, 43, 92], textColor: [255, 255, 255], fontStyle: 'bold' },
      foot: [['', '', 'TOTAL HT', `${formatPrice(fullData.company.totalHT || 0)} €`]],
      footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    });

    doc.save(`BC1_${companyName.replace(/\s+/g, '_')}.pdf`);
  };

  const generateBC2PDF = () => {
    if (!fullData || !fullData.company) return;
    const doc = new jsPDF();
    applyHeader(doc, "BON DE COMMANDE N°2 - LOGISTIQUE & MOBILIER");
    
    let bc2TotalHT = 0;
    const rows: any[] = [];

    if (fullData.company.logisticsData && Array.isArray(fullData.company.logisticsData)) {
      fullData.company.logisticsData.forEach((item: any) => {
        const itemTotal = (item.qty || 0) * (item.priceUnitHT || 0);
        bc2TotalHT += itemTotal;
        rows.push([item.name, String(item.qty), `${formatPrice(item.priceUnitHT)} €`, `${formatPrice(itemTotal)} €`]);
      });
    } else {
      rows.push(['Aucun article sélectionné', '-', '-', '0 €']);
    }

    autoTable(doc, {
      startY: 65,
      head: [['Article', 'Quantité', 'Unitaire HT', 'Total HT']],
      body: rows,
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
      foot: [['', '', 'TOTAL HT', `${formatPrice(bc2TotalHT)} €`]],
      footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    });

    doc.save(`BC2_${companyName.replace(/\s+/g, '_')}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black italic text-[#002B5C]">Synchronisation...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans italic text-[#002B5C]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#002B5C] text-white flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-2xl font-black uppercase italic leading-none">Forum</h2>
          <p className="text-xl font-bold text-blue-400 uppercase tracking-widest italic">ESTP</p>
        </div>
        <nav className="flex-1 p-6 space-y-3 not-italic">
          <SidebarLink href="/dashboard" label="Tableau de bord" icon="📊" active />
          <SidebarLink href="/dashboard/bc1" label="Mon Stand (BC1)" icon="🎪" />
          <SidebarLink href={status?.isBc1Valid ? "/dashboard/bc2" : "#"} label="Logistique (BC2)" icon="📦" disabled={!status?.isBc1Valid} />
          <SidebarLink href="/dashboard/documents" label="Documents & Logo" icon="📄" />
        </nav>
        <div className="p-6 border-t border-white/10">
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="text-red-400 font-bold uppercase text-xs">← Déconnexion</button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-black uppercase italic leading-none">
            Bonjour, <span className="text-blue-600">{userName}</span>
          </h1>
          <p className="mt-2 text-gray-500 font-bold uppercase text-xs tracking-widest not-italic">{companyName}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARTE BC1 */}
          <Card title="Mon Stand & Options" step="01" status={status?.isBc1Valid ? 'VALIDÉ' : 'À FAIRE'} color={status?.isBc1Valid ? 'green' : 'orange'}>
            <Link href="/dashboard/bc1" className="block w-full bg-[#002B5C] text-white py-4 rounded-xl font-black uppercase text-center text-xs tracking-widest hover:bg-black transition-all mb-3">Modifier</Link>
            {status?.isBc1Valid && (
              <button onClick={generateBC1PDF} className="w-full bg-white text-[#002B5C] border-2 border-[#002B5C] py-4 rounded-xl font-black uppercase text-xs text-center hover:bg-gray-50 italic">📥 Télécharger le BC1</button>
            )}
          </Card>

          {/* CARTE BC2 */}
          <Card title="Logistique & Mobilier" step="02" status={status?.isBc2Valid ? 'VALIDÉ' : (status?.isBc1Valid ? 'À FAIRE' : 'BLOQUÉ')} color={status?.isBc2Valid ? 'green' : (status?.isBc1Valid ? 'blue' : 'gray')} disabled={!status?.isBc1Valid}>
            <Link href={status?.isBc1Valid ? "/dashboard/bc2" : "#"} className={`block w-full py-4 rounded-xl font-black uppercase text-center text-xs tracking-widest transition-all mb-3 ${status?.isBc1Valid ? 'bg-[#002B5C] text-white hover:bg-black' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              {status?.isBc2Valid ? 'Modifier' : 'Accéder'}
            </Link>
            {status?.isBc2Valid && (
              <button onClick={generateBC2PDF} className="w-full bg-white text-[#002B5C] border-2 border-[#002B5C] py-4 rounded-xl font-black uppercase text-xs text-center hover:bg-gray-50 italic">📥 Télécharger le BC2</button>
            )}
          </Card>

          {/* CARTE DOCUMENTS */}
          <Card title="Documents & Logo" step="03" status="À FAIRE" color="red">
            <Link href="/dashboard/documents" className="w-full block bg-[#002B5C] text-white py-4 rounded-xl font-black uppercase text-center text-xs tracking-widest shadow-lg hover:bg-black transition-all">Gérer</Link>
          </Card>
        </div>
      </main>
    </div>
  );
}

// SOUS-COMPOSANTS DE STRUCTURE
function SidebarLink({ href, label, icon, active = false, disabled = false }: any) {
  return (
    <Link href={href} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${disabled ? 'opacity-30 cursor-not-allowed' : (active ? 'bg-white/10 text-white' : 'text-blue-200 hover:bg-white/5')}`}>
      <span className="text-lg">{icon}</span> {label}
    </Link>
  );
}

function Card({ title, step, status, color, children, disabled = false }: any) {
  const colorMap: any = { green: 'text-green-500 bg-green-50', orange: 'text-orange-500 bg-orange-50', blue: 'text-blue-500 bg-blue-50', red: 'text-red-500 bg-red-50', gray: 'text-gray-400 bg-gray-100' };
  return (
    <div className={`bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col ${disabled ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <span className="text-5xl font-black text-gray-50 italic leading-none">{step}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${colorMap[color]}`}>{status}</span>
      </div>
      <h3 className="text-2xl font-black uppercase italic mb-8 flex-1 leading-tight">{title}</h3>
      {children}
    </div>
  );
}
