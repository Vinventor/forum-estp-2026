'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DocumentsEntreprise() {
  const [fileKbis, setFileKbis] = useState<File | null>(null);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Documents envoyés avec succès au pôle Relations Entreprises !");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex text-black">
      
      {/* MENU LATÉRAL */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold">Forum ESTP</h2>
          <p className="text-sm text-blue-300 mt-1">Espace Entreprise</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block p-3 hover:bg-blue-800 rounded-lg transition">Accueil</Link>
          <Link href="/dashboard/stand" className="block p-3 hover:bg-blue-800 rounded-lg transition">Mon Stand & Options</Link>
          <Link href="/dashboard/documents" className="block p-3 bg-blue-800 rounded-lg font-medium">Mes Documents</Link>
          <Link href="/dashboard/factures" className="block p-3 hover:bg-blue-800 rounded-lg transition">Factures & Paiement</Link>
        </nav>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-8">
        <header className="mb-8 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-black">Mes Documents Légaux 📄</h1>
          <p className="text-black mt-2">Veuillez fournir les documents nécessaires pour valider votre venue.</p>
        </header>

        <form onSubmit={handleUpload} className="space-y-6 max-w-3xl">
          
          {/* CARTE KBIS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-black">
            <h3 className="text-xl font-bold text-black mb-2">1. Extrait Kbis (moins de 3 mois) *</h3>
            <p className="text-black text-sm mb-4">Requis pour la facturation et la création de votre compte exposant.</p>
            
            <div className="border-2 border-dashed border-black rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
              <input 
                type="file" 
                accept=".pdf,.jpg,.png"
                onChange={(e) => setFileKbis(e.target.files ? e.target.files[0] : null)}
                className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {fileKbis && <p className="mt-2 text-green-600 font-bold">Fichier sélectionné : {fileKbis.name}</p>}
            </div>
          </div>

          {/* CARTE LOGO */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-black">
            <h3 className="text-xl font-bold text-black mb-2">2. Logo de l'entreprise *</h3>
            <p className="text-black text-sm mb-4">Pour la plaquette du Forum et les affichages sur votre stand (Format Vectoriel ou Haute Définition).</p>
            
            <div className="border-2 border-dashed border-black rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
              <input 
                type="file" 
                accept=".svg,.png,.ai,.eps"
                className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          </div>

          {/* BOUTON D'ENVOI */}
          <button type="submit" className="w-full bg-blue-900 text-white font-bold py-4 px-6 rounded-lg hover:bg-black transition duration-300 shadow-md">
            Envoyer les documents
          </button>

        </form>
      </main>
    </div>
  );
}