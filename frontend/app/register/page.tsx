'use client'; // Très important : dit à Next.js que c'est une page interactive (avec un formulaire)

import { useState } from 'react';

export default function InscriptionEntreprise() {
  // 1. On prépare la "mémoire" du formulaire
  const [formData, setFormData] = useState({
    companyName: '',
    siren: '',
    address: '',
    billingName: '',
    billingAddress: '',
    lastName: '',
    firstName: '',
    email: '',
    userPhone: '',
    jobTitle: '',
    password: ''
  });

  // 2. Fonction pour mettre à jour la mémoire quand l'utilisateur tape au clavier
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Fonction quand on clique sur "S'inscrire" (Envoi au Backend !)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche la page de recharger
    
    try {
      // On frappe à la porte de notre serveur Backend (qui tourne sur le port 3001)
      const reponse = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (reponse.ok) {
        alert("🎉 Inscription de l'entreprise réussie ! La base de données est à jour.");
      } else {
        alert("❌ Oups, une erreur est survenue.");
      }
    } catch (erreur) {
      console.error(erreur);
      alert("❌ Impossible de contacter le serveur.");
    }
  };

  // 4. L'interface visuelle (Le HTML/CSS)
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        
        <h1 className="text-3xl font-bold text-blue-800 mb-8 border-b pb-4">
          Forum ESTP - Inscription Entreprise
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION ENTREPRISE */}
          <h2 className="text-xl font-semibold text-gray-700">Informations de l'entreprise</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise *</label>
              <input type="text" name="companyName" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro SIREN *</label>
              <input type="text" name="siren" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse de l'entreprise *</label>
            <input type="text" name="address" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
          </div>

          {/* SECTION FACTURATION */}
          <h2 className="text-xl font-semibold text-gray-700 mt-8">Informations de facturation</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de facturation *</label>
              <input type="text" name="billingName" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse de facturation *</label>
              <input type="text" name="billingAddress" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          {/* SECTION CONTACT */}
          <h2 className="text-xl font-semibold text-blue-600 mt-8 border-b pb-2">Contact Principal</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom *</label>
              <input type="text" name="lastName" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom *</label>
              <input type="text" name="firstName" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email (Identifiant) *</label>
              <input type="email" name="email" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone *</label>
              <input type="tel" name="userPhone" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fonction *</label>
              <input type="text" name="jobTitle" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
              <input type="password" name="password" required onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          {/* BOUTON DE VALIDATION */}
          <div className="pt-6">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300">
              Valider l'inscription de l'entreprise
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}