'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 italic">
      
      {/* --- SECTION 1 : HERO 2026 --- */}
      <header className="relative h-[85vh] flex items-center justify-center text-center text-white bg-[#002B5C]">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="relative z-20 px-6 max-w-5xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-[0.4em] uppercase opacity-90">
            47ème Édition — 24 Novembre 2026
          </h2>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] drop-shadow-xl uppercase">
            Le rendez-vous <br /> des générations
          </h1>
          <p className="text-lg md:text-2xl font-light mb-12 tracking-wide max-w-3xl mx-auto opacity-90">
            "Le plus grand forum de recrutement de France organisé par des étudiants."
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 font-sans not-italic">
            <Link href="/register" className="bg-white text-[#002B5C] px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition shadow-2xl">
              DEVENIR EXPOSANT
            </Link>
            <Link href="/login" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-black text-lg hover:bg-white hover:text-[#002B5C] transition">
              ACCÈS EXPOSANT
            </Link>
          </div>
        </div>
      </header>

      {/* --- SECTION 2 : CHIFFRES CLÉS --- */}
      <section className="bg-[#002B5C] border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <StatBox number="180+" label="Entreprises" />
          <StatBox number="6500" label="Étudiants" />
          <StatBox number="12000m²" label="D'exposition" />
          <StatBox number="47" label="Éditions" />
        </div>
      </section>

      {/* --- SECTION 3 : PRÉSENTATION --- */}
      <section id="propos" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-[#002B5C] mb-8 uppercase leading-tight">
              Le Forum ETP, <br /><span className="text-blue-600">C'est quoi ?</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify font-light not-italic">
              <p>
                Depuis 1980, le Forum ESTP s’est imposé comme le rendez-vous incontournable entre le monde professionnel et les futurs ingénieurs de la construction et de l’immobilier.
              </p>
              <p>
                Organisé intégralement par une équipe de <strong>26 étudiants bénévoles</strong>, cet événement accueille chaque année les leaders de leurs secteurs au Parc des Expositions de la Porte de Versailles.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-[3rem] aspect-video shadow-inner flex items-center justify-center text-gray-400 border border-gray-100 italic">
            [Vidéo Officielle 2026]
          </div>
        </div>
      </section>

      {/* --- SECTION 4 : PARTENAIRES --- */}
      <section id="partenaires" className="py-24 bg-gray-50 border-y border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-[0.3em] mb-4 not-italic">Ils nous font confiance</h3>
          <h2 className="text-4xl font-black text-[#002B5C] uppercase italic mb-16 underline decoration-blue-200 underline-offset-8">Nos Partenaires</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
             {['BOUYGUES', 'VINCI', 'EIFFAGE', 'COLAS', 'FAYAT', 'NGE', 'SPIE', 'SNCF', 'RESEAU DE TRANSPORT', 'LE MONITEUR'].map((partner) => (
               <div key={partner} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center h-28 font-black text-gray-300 italic">
                 {partner}
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5 : ACCÈS ET CONTACT --- */}
      <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#002B5C] p-12 rounded-[3rem] text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-8 italic">Informations Pratiques</h3>
            <div className="space-y-8 not-italic">
              <div className="border-l-2 border-blue-400 pl-4">
                <p className="font-bold text-blue-300 uppercase text-xs mb-2 tracking-widest">Lieu</p>
                <p className="text-xl font-bold italic">Paris Expo Porte de Versailles</p>
                <p className="opacity-70 text-sm">Hall 5.2 / 5.3</p>
              </div>
              <div className="border-l-2 border-blue-400 pl-4">
                <p className="font-bold text-blue-300 uppercase text-xs mb-2 tracking-widest">Date & Horaires</p>
                <p className="text-xl font-bold italic">Mardi 24 Novembre 2026</p>
                <p className="opacity-70 text-sm">9h00 — 18h00</p>
              </div>
            </div>
          </div>
          <div className="rounded-[3rem] overflow-hidden border border-gray-200 h-[400px] bg-gray-100 flex items-center justify-center text-gray-400 italic">
            [Carte Interactive du Forum]
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-100 py-16 px-8 text-center">
        <p className="font-black text-[#002B5C] text-2xl mb-4 italic tracking-tighter">FORUM ESTP</p>
        <p className="text-gray-500 text-sm mb-2 font-medium not-italic">Association Loi 1901 — École Spéciale des Travaux Publics</p>
        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-8 not-italic">
          © 2026 TOUS DROITS RÉSERVÉS
        </div>
      </footer>
    </div>
  );
}

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-white italic">
      <div className="text-4xl md:text-5xl font-black mb-1 tracking-tighter">{number}</div>
      <div className="text-[10px] uppercase font-bold tracking-widest text-blue-300 not-italic">{label}</div>
    </div>
  );
}