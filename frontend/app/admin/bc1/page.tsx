'use client';

export default function AdminBC1Page() {
  // Données basées sur ta capture d'écran
  const registrations = [
    { id: 9, entreprise: 'Oteis', commercial: 'Vincent Lavorel', pack: 'Pack simple $9m^2$', total: '1655.00 €', date: '22/05/2025', valide: true, lieu: 'Paris' },
    { id: 10, entreprise: 'SIEM-G', commercial: 'Vincent Lavorel', pack: 'Pack Premium $12m^2$', total: '7035.00 €', date: '23/05/2025', valide: true, lieu: 'CREIL' },
    { id: 105, entreprise: 'JARNIAS', commercial: 'Vincent Lavorel', pack: 'Pack plus $9m^2$', total: '2610.00 €', date: '01/09/2025', valide: true, lieu: 'L\'hay les roses' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-[#002B5C] uppercase italic">Liste des BC1</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700">+ Créer un BC1</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Entreprise</th>
              <th className="px-6 py-4">Pack</th>
              <th className="px-6 py-4">Validé</th>
              <th className="px-6 py-4">Total HT</th>
              <th className="px-6 py-4">Créé le</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-sans">
            {registrations.map((reg) => (
              <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-400">{reg.id}</td>
                <td className="px-6 py-4 font-black text-[#002B5C] uppercase">{reg.entreprise}</td>
                <td className="px-6 py-4 text-gray-600">{reg.pack}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Oui</span>
                </td>
                <td className="px-6 py-4 font-bold">{reg.total}</td>
                <td className="px-6 py-4 text-gray-400">{reg.date}</td>
                <td className="px-6 py-4 text-center space-x-2 italic">
                   <button className="text-blue-600 hover:underline">Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}