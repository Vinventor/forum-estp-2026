'use client';

import Link from 'next/link';

export default function FacturesEntreprise() {
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
          <Link href="/dashboard/documents" className="block p-3 hover:bg-blue-800 rounded-lg transition">Mes Documents</Link>
          <Link href="/dashboard/factures" className="block p-3 bg-blue-800 rounded-lg font-medium">Factures & Paiement</Link>
        </nav>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-8">
        <header className="mb-8 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-black">Factures et Paiement 💳</h1>
          <p className="text-black mt-2">Retrouvez ici vos documents comptables et l'état de vos règlements.</p>
        </header>

        {/* ENCART RIB ESTP */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Coordonnées Bancaires de l'Association</h3>
          <p className="text-black mb-4">Pour régler votre facture par virement, veuillez utiliser le RIB ci-dessous en indiquant <strong>le nom de votre entreprise</strong> dans l'intitulé du virement.</p>
          <button className="bg-blue-900 text-white font-bold py-2 px-6 rounded hover:bg-blue-800 transition">
            📥 Télécharger le RIB du Forum ESTP
          </button>
        </div>

        {/* TABLEAU DES FACTURES */}
        <div className="bg-white rounded-xl shadow-sm border border-black overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-black">
                <th className="p-4 font-bold text-black">Document</th>
                <th className="p-4 font-bold text-black">Date</th>
                <th className="p-4 font-bold text-black">Montant TTC</th>
                <th className="p-4 font-bold text-black">Statut</th>
                <th className="p-4 font-bold text-black text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              
              {/* LIGNE 1 : Devis */}
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 text-black font-medium">Devis - Stand 12m²</td>
                <td className="p-4 text-black">26/03/2026</td>
                <td className="p-4 text-black">3 600,00 €</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-bold">Validé</span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-bold underline">Télécharger (PDF)</button>
                </td>
              </tr>

              {/* LIGNE 2 : Facture */}
              <tr className="hover:bg-gray-50">
                <td className="p-4 text-black font-medium">Facture - Acompte 50%</td>
                <td className="p-4 text-black">26/03/2026</td>
                <td className="p-4 text-black">1 800,00 €</td>
                <td className="p-4">
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md font-bold">Paiement en attente</span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-bold underline">Télécharger (PDF)</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}