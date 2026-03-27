'use client';

import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 italic">
      
      {/* --- HERO SECTION CONTACT --- */}
      <header className="bg-gray-50 py-24 px-6 border-b border-gray-100 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-blue-600 font-bold uppercase tracking-[0.3em] mb-4 text-sm font-sans not-italic">Nous contacter</h2>
          <h1 className="text-5xl md:text-6xl font-black text-[#002B5C] mb-8 uppercase italic leading-tight">
            Restons en <br /> <span className="text-[#0056b3]">contact</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-light italic max-w-2xl mx-auto">
            "Une question sur l'exposition, le recrutement ou nos partenariats ? Notre équipe est à votre écoute."
          </p>
        </div>
      </header>

      {/* --- SECTION COORDONNÉES & ACTION --- */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-stretch">
          
          {/* CARTE : NOS COORDONNÉES */}
          <div className="space-y-12">
            <div className="border-l-4 border-[#002B5C] pl-8">
              <h3 className="text-2xl font-black text-[#002B5C] uppercase tracking-tighter italic mb-8">Informations Générales</h3>
              
              <div className="space-y-8 not-italic font-sans">
                {/* ADRESSE SIÈGE */}
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-50 p-3 rounded-xl text-[#002B5C] text-xl">📍</div>
                  <div>
                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1">Siège Social</p>
                    <p className="text-lg text-gray-700 leading-tight">
                      Association Forum ESTP <br />
                      28 avenue du Président Wilson <br />
                      94234 Cachan Cedex
                    </p>
                  </div>
                </div>

                {/* TÉLÉPHONE */}
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-50 p-3 rounded-xl text-[#002B5C] text-xl">📞</div>
                  <div>
                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1">Téléphone</p>
                    <p className="text-lg text-gray-700">01 49 08 56 50</p>
                  </div>
                </div>

                {/* LINKEDIN - NOUVEAU */}
                <div className="flex gap-4 items-start group">
                  <div className="bg-blue-50 p-3 rounded-xl text-[#002B5C] text-xl group-hover:bg-[#0077b5] group-hover:text-white transition-colors">🔗</div>
                  <div>
                    <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-1">Réseaux Sociaux</p>
                    <a 
                      href="https://www.linkedin.com/company/forum-etp/posts/?feedView=all" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg text-[#002B5C] font-bold hover:underline decoration-blue-400 underline-offset-4"
                    >
                      Suivre le Forum ETP sur LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARTE : ACTION EMAIL */}
          <div className="bg-[#002B5C] rounded-3xl p-12 text-white flex flex-col justify-center shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl italic">@</div>
             
             <div className="relative z-10">
                <h3 className="text-3xl font-black italic mb-6">Un projet ? Une demande ?</h3>
                <p className="text-blue-100 text-lg mb-10 font-light leading-relaxed">
                  Cliquez sur le bouton ci-dessous pour nous envoyer directement un message. Notre pôle dédié vous répondra sous 48h.
                </p>
                
                <a 
                  href="mailto:contact@forumestp.org" 
                  className="inline-flex items-center gap-3 bg-white text-[#002B5C] px-10 py-5 rounded-full font-black text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl not-italic uppercase tracking-wider"
                >
                  ✉️ Envoyer un mail
                </a>
             </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER DISCRET --- */}
      <footer className="py-12 text-center text-xs text-gray-400 uppercase tracking-widest italic">
        Forum ESTP - 47ème Édition
      </footer>
    </div>
  );
}