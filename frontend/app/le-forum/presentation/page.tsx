'use client';

import Link from 'next/link';

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans italic selection:bg-blue-100">
      
      {/* --- HERO PRÉSENTATION --- */}
      <header className="bg-gray-50 py-24 px-6 border-b border-gray-100 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-blue-600 font-bold uppercase tracking-[0.3em] mb-4 text-sm font-sans">Notre Histoire</h2>
          <h1 className="text-5xl md:text-6xl font-black text-[#002B5C] mb-8 uppercase leading-tight">
            47 ans <br /> <span className="text-[#0056b3]">au cœur du BTP</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-light italic max-w-2xl mx-auto">
            "Le Forum ESTP est le carrefour historique où se dessinent les carrières des ingénieurs de demain depuis 1980."
          </p>
        </div>
      </header>

      {/* --- SECTION CONTENU --- */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-[#002B5C] uppercase tracking-tighter italic">L'héritage d'une école</h3>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg font-sans not-italic">
                <p>
                Le Forum ESTP est né de la volonté des étudiants de l'École Spéciale des Travaux Publics de créer un lien concret avec le monde professionnel. 
                </p>
                <p>
                Pour cette <strong>47ème édition le 24 novembre 2026</strong>, nous continuons de porter cette mission avec une rigueur et un enthousiasme inégalés, accueillant les plus grandes signatures de la construction, de l'immobilier et de l'énergie.
                </p>
            </div>
            <div className="pt-6 font-sans">
               <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
                  <p className="text-[#002B5C] font-bold italic">"Organisé par les étudiants, pour les étudiants et les entreprises."</p>
               </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="bg-[#002B5C] rounded-3xl p-10 text-white shadow-xl italic font-sans">
              <h4 className="text-2xl font-bold mb-8 italic border-b border-white/10 pb-4 text-blue-300">Nos piliers :</h4>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="bg-white text-[#002B5C] w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0">1</span>
                  <p className="text-sm font-medium opacity-90 not-italic">Accompagner l'insertion professionnelle de 6 500 futurs ingénieurs.</p>
                </li>
                <li className="flex gap-4">
                  <span className="bg-white text-[#002B5C] w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0">2</span>
                  <p className="text-sm font-medium opacity-90 not-italic">Valoriser les innovations technologiques et environnementales du secteur.</p>
                </li>
                <li className="flex gap-4">
                  <span className="bg-white text-[#002B5C] w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0">3</span>
                  <p className="text-sm font-medium opacity-90 not-italic">Maintenir un standard d'organisation professionnel digne des plus grands salons.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER PRÉSENTATION --- */}
      <footer className="py-20 bg-gray-50 border-t border-gray-100 text-center font-sans">
        <h4 className="text-[#002B5C] font-black uppercase mb-8 italic">Prêt pour la 47ème ?</h4>
        <Link href="/register" className="bg-[#002B5C] text-white px-12 py-5 rounded-full font-black hover:scale-105 transition shadow-2xl inline-block">
          S'INSCRIRE POUR NOVEMBRE 2026
        </Link>
        <div className="mt-16 text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] italic">
           Forum ESTP - 2026
        </div>
      </footer>
    </div>
  );
}