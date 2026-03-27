'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';

// Catalogue pour le BC1 (Périmètre Stand)
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

// Catalogue pour le BC2 (Logistique & Mobilier)
const LOGISTICS_CATALOG = [
  { id: 'table', label: 'Table', price: 150 },
  { id: 'chair', label: 'Chaise', price: 25 },
  { id: 'shelving', label: 'Étagère', price: 75 },
  { id: 'counter', label: 'Comptoir', price: 200 },
  { id: 'carpet', label: 'Moquette (m²)', price: 20 },
  { id: 'lighting', label: 'Éclairage', price: 100 },
  { id: 'signage', label: 'Signalétique', price: 80 },
  { id: 'delivery', label: 'Frais de livraison', price: 500 },
  { id: 'setup', label: 'Montage/Démontage', price: 300 },
  { id: 'insurance', label: 'Assurance temporaire', price: 250 },
];

const pricingData: any = {
  simple: { 9: 1680, 12: 2200, 15: 2590, 18: 3085, 21: 3600, 24: 4120, 28: 4740, 32: 5420, 36: 6030 },
  plus: { 9: 2650, 12: 3770, 15: 4160, 18: 4780, 21: 5270, 24: 5890, 28: 6440, 32: 7250, 36: 8280, 40: 9410, 46: 9870, 52: 10900, 60: 12200, 70: 13700, 80: 15290, 90: 17010, 100: 18610, 110: 20320, 120: 21810, 144: 30770, 150: 37450 },
  premium: { 9: 3680, 12: 4710, 15: 5200, 18: 6000 }
};

export default function DashboardEntreprise() {
  const [companyName, setCompanyName] = useState('Chargement...');
  const [fullData, setFullData] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const formatPrice = (num: number) => Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return router.push('/login');

      try {
        const resStatus = await fetch(`http://localhost:3001/api/company-status?email=${encodeURIComponent(userEmail)}`);
        const statusData = await resStatus.json();
        setStatus(statusData);
        setCompanyName(statusData.companyName);

        const resDetails = await fetch(`http://localhost:3001/api/company-details?email=${encodeURIComponent(userEmail)}`);
        const detailsData = await resDetails.json();
        setFullData(detailsData);
      } catch (err) {
        console.error("Erreur sync :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // --- HEADER COMMUN AUX DEUX PDF ---
  const applyHeader = (doc: jsPDF, title: string) => {
    const navy: [number, number, number] = [0, 43, 92];
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(24);
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

  // --- GÉNÉRATION PDF BC1 ---
  const generateBC1PDF = () => {
    if (!fullData) return;
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

    // Ajouter les options sélectionnées
    if (fullData.company.options) {
      Object.entries(fullData.company.options).forEach(([label, qty]: [string, any]) => {
        const item = OPTIONS_CATALOG.find(o => o.label === label);
        const up = item ? item.price : 0;
        rows.push([
          label, 
          String(qty), 
          `${formatPrice(up)} €`, 
          `${formatPrice(up * qty)} €`
        ]);
      });
    }

    autoTable(doc, {
      startY: 65,
      head: [['Désignation', 'Qté', 'Unitaire HT', 'Total HT']],
      body: rows,
      headStyles: { 
        fillColor: [0, 43, 92], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        fontSize: 10
      },
      foot: [['', '', 'TOTAL HT', `${formatPrice(fullData.company.totalHT || 0)} €`]],
      footStyles: { 
        fillColor: [240, 240, 240], 
        fontStyle: 'bold',
        fontSize: 11
      },
      margin: { left: 14, right: 14 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } }
    });

    // Footer page
    const pageSize = doc.internal.pageSize;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page 1 / 1`, pageSize.getWidth() / 2, pageSize.getHeight() - 10, { align: 'center' });

    doc.save(`BC1_${companyName.replace(/\s+/g, '_')}.pdf`);
  };

  // --- GÉNÉRATION PDF BC2 (LOGISTIQUE & MOBILIER) ---
  const generateBC2PDF = () => {
    if (!fullData) return;
    
    const doc = new jsPDF();
    applyHeader(doc, "BON DE COMMANDE N°2 - LOGISTIQUE & MOBILIER");
    
    let bc2TotalHT = 0;
    const rows: any[] = [];

    // Vérifier si des données logistiques existent
    if (fullData.company.logisticsData && Array.isArray(fullData.company.logisticsData) && fullData.company.logisticsData.length > 0) {
      fullData.company.logisticsData.forEach((item: any) => {
        const itemTotal = (item.qty || 0) * (item.priceUnitHT || 0);
        bc2TotalHT += itemTotal;
        rows.push([
          item.name || 'Article sans nom',
          String(item.qty || 0),
          `${formatPrice(item.priceUnitHT || 0)} €`,
          `${formatPrice(itemTotal)} €`
        ]);
      });
    } else {
      // Si pas de données, afficher un message
      rows.push(['Aucun article de logistique sélectionné', '-', '-', '0 €']);
    }

    autoTable(doc, {
      startY: 65,
      head: [['Article', 'Quantité', 'Unitaire HT', 'Total HT']],
      body: rows,
      headStyles: { 
        fillColor: [59, 130, 246], 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        fontSize: 10
      },
      foot: [['', '', 'TOTAL HT', `${formatPrice(bc2TotalHT)} €`]],
      footStyles: { 
        fillColor: [240, 240, 240], 
        fontStyle: 'bold',
        fontSize: 11
      },
      margin: { left: 14, right: 14 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right' } }
    });

    // Footer page
    const pageSize = doc.internal.pageSize;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page 1 / 1`, pageSize.getWidth() / 2, pageSize.getHeight() - 10, { align: 'center' });

    doc.save(`BC2_${companyName.replace(/\s+/g, '_')}.pdf`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black italic text-[#002B5C]">
      Chargement...
    </div>
  );

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
          <SidebarLink 
            href={status?.isBc1Valid ? "/dashboard/bc2" : "#"} 
            label="Logistique (BC2)" 
            icon="📦" 
            disabled={!status?.isBc1Valid} 
          />
          <SidebarLink href="/dashboard/documents" label="Documents & Logo" icon="📄" />
          <SidebarLink href="/dashboard/coordonnees" label="Coordonnées" icon="👤" />
        </nav>
        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => {
              localStorage.clear(); 
              router.push('/login');
            }} 
            className="text-red-400 font-bold uppercase text-xs"
          >
            ← Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-16">
          <h1 className="text-4xl font-black uppercase italic leading-none">
            Bonjour, <span className="text-blue-600">{companyName}</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CARTE 01 : STAND */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-5xl font-black text-gray-50 italic">01</span>
              <Badge 
                status={status?.isBc1Valid ? 'VALIDÉ' : 'À FAIRE'} 
                color={status?.isBc1Valid ? 'green' : 'orange'} 
              />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-8 flex-1 leading-tight">
              Mon Stand & Options
            </h3>
            <div className="space-y-3">
              <Link 
                href="/dashboard/bc1" 
                className="block w-full bg-[#002B5C] text-white py-4 rounded-xl font-black uppercase text-center text-xs tracking-widest hover:bg-black transition-all"
              >
                Modifier
              </Link>
              {status?.isBc1Valid && (
                <button 
                  onClick={generateBC1PDF} 
                  className="w-full bg-white text-[#002B5C] border-2 border-[#002B5C] py-4 rounded-xl font-black uppercase text-xs text-center hover:bg-gray-50 italic"
                >
                  📥 Télécharger le BC1
                </button>
              )}
            </div>
          </div>

          {/* CARTE 02 : LOGISTIQUE */}
          <div className={`bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col ${!status?.isBc1Valid ? 'opacity-40 grayscale' : ''}`}>
            <div className="flex justify-between items-start mb-6">
              <span className="text-5xl font-black text-gray-50 italic">02</span>
              <Badge 
                status={status?.isBc2Valid ? 'VALIDÉ' : (status?.isBc1Valid ? 'À FAIRE' : 'BLOQUÉ')} 
                color={status?.isBc2Valid ? 'green' : 'blue'} 
              />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-8 flex-1 leading-tight">
              Logistique & Mobilier
            </h3>
            <div className="space-y-3">
              <Link 
                href={status?.isBc1Valid ? "/dashboard/bc2" : "#"} 
                className={`block w-full py-4 rounded-xl font-black uppercase text-center text-xs tracking-widest transition-all ${
                  status?.isBc1Valid 
                    ? 'bg-[#002B5C] text-white hover:bg-black' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {status?.isBc2Valid ? 'Modifier' : 'Accéder'}
              </Link>
              {/* 🎯 BOUTON D'EXPORT BC2 - C'EST ICI ! */}
              {status?.isBc1Valid && (
                <button 
                  onClick={generateBC2PDF} 
                  className="w-full bg-white text-[#002B5C] border-2 border-[#002B5C] py-4 rounded-xl font-black uppercase text-xs text-center hover:bg-gray-50 italic"
                >
                  📥 Télécharger le BC2
                </button>
              )}
            </div>
          </div>

          {/* CARTE 03 : DOCUMENTS */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-5xl font-black text-gray-50 italic leading-none">03</span>
              <Badge status="À faire" color="red" />
            </div>
            <h3 className="text-2xl font-black uppercase italic leading-tight mb-8 flex-1">
              Documents & Logo
            </h3>
            <Link 
              href="/dashboard/documents" 
              className="w-full bg-[#002B5C] text-white py-4 rounded-xl font-black uppercase text-center text-xs tracking-widest shadow-lg hover:bg-black transition-all"
            >
              Gérer
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---
function SidebarLink({ href, label, icon, active = false, disabled = false }: any) {
  if (disabled) {
    return (
      <div className="flex items-center gap-4 px-6 py-4 text-white/20 italic opacity-50 cursor-not-allowed">
        <span className="text-lg">{icon}</span>
        {label}
      </div>
    );
  }
  
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
        active 
          ? 'bg-white/10 text-white shadow-inner' 
          : 'text-blue-200 hover:bg-white/5'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}

function Badge({ status, color }: { status: string, color: string }) {
  const colors: any = { 
    green: 'text-green-500 bg-green-50', 
    orange: 'text-orange-500 bg-orange-50', 
    blue: 'text-blue-500 bg-blue-50', 
    red: 'text-red-500 bg-red-50' 
  };
  
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${colors[color]}`}>
      {status}
    </span>
  );
}