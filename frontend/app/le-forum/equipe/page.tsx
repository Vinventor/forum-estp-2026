'use client';

import Link from 'next/link';

export default function EquipePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 italic">
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- SECTION 1 : QUI SOMMES-NOUS ? --- */}
        <div className="mb-24">
          <div className="flex items-center justify-between border-t border-gray-300 pt-4 mb-10">
            <h2 className="text-2xl font-medium text-gray-800 not-italic">Qui sommes-nous ?</h2>
            <div className="text-[#002B5C] font-black text-2xl tracking-tighter uppercase">ETP</div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-100 aspect-[4/3] flex items-center justify-center relative group">
               <div className="absolute inset-0 bg-[#002B5C]/10 group-hover:bg-transparent transition-colors duration-500"></div>
               <span className="text-gray-400 not-italic font-bold">PHOTO DE GROUPE 2026</span>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed text-base not-italic text-justify">
              <p className="text-xl font-light text-[#002B5C] italic">
                "Bâtir un pont entre l'excellence académique et la réalité du terrain."
              </p>
              <p>
                Le Forum ESTP est une association loi 1901, constituée de **26 étudiants motivés de l'ESTP**, triés sur le volet. À la fois innovants, solidaires et dynamiques, ils œuvrent tous vers un objectif commun : organiser un événement à la hauteur des leaders du BTP.
              </p>
              <p>
                Depuis plus de **45 ans**, l'équipe se renouvelle pour rester au plus proche des préoccupations du secteur. Pour cette 47ème édition, nous mobilisons nos quatre pôles d'expertise pour transformer 12 000 m² à la Porte de Versailles en un carrefour d'opportunités unique en France.
              </p>
            </div>
          </div>
        </div>

        {/* --- SECTION 2 : MISSIONS DÉTAILLÉES DES PÔLES --- */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black text-[#002B5C] uppercase italic tracking-tighter">Nos Pôles d'Expertise</h3>
            <p className="text-gray-500 mt-2 not-italic">Une organisation structurée pour une efficacité maximale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            
            <PoleDetailedCard 
              title="LE BUREAU" 
              role="Pilotage & Stratégie"
              missions={[
                "Définition de la vision stratégique de la 47ème édition.",
                "Gestion administrative, juridique et financière de l'association.",
                "Représentation officielle auprès de la direction de l'ESTP et des grands partenaires.",
                "Coordination inter-pôles pour garantir la cohérence du projet."
              ]}
            />
            
            <PoleDetailedCard 
              title="LE PÔLE COMMERCIAL" 
              role="Relations Entreprises"
              missions={[
                "Prospection et gestion d'un portefeuille de 180+ entreprises.",
                "Négociation des contrats et commercialisation des surfaces de stands.",
                "Accompagnement personnalisé des exposants dans leur préparation.",
                "Développement de nouveaux partenariats stratégiques et innovants."
              ]}
            />

            <PoleDetailedCard 
              title="LE PÔLE LOGISTIQUE" 
              role="Opérations & Infrastructures"
              missions={[
                "Conception du plan technique du salon (Hall 5 - Porte de Versailles).",
                "Coordination des prestataires (électriciens, standistes, traiteurs).",
                "Gestion des flux de 6 500 visiteurs et de la sécurité du site.",
                "Mise en place opérationnelle du salon et accueil des exposants."
              ]}
            />

            <PoleDetailedCard 
              title="LE PÔLE COMMUNICATION" 
              role="Marketing & Événementiel"
              missions={[
                "Création de l'identité visuelle et gestion des supports print/digitaux.",
                "Promotion de l'événement auprès des étudiants de toute la France.",
                "Organisation des conférences, tables rondes et ateliers de coaching.",
                "Animation des réseaux sociaux et maintenance du site internet."
              ]}
            />

          </div>
        </div>

      </div>

      <footer className="py-24 bg-gray-50 text-center border-t border-gray-100">
        <Link href="/register" className="bg-[#002B5C] text-white px-12 py-5 rounded-full font-black hover:scale-105 transition shadow-2xl inline-block not-italic">
          REJOINDRE L'ÉDITION 2026
        </Link>
      </footer>
    </div>
  );
}

// --- COMPOSANT DÉTAILLÉ POUR CHAQUE PÔLE ---

function PoleDetailedCard({ title, role, missions }: { title: string; role: string; missions: string[] }) {
  return (
    <div className="group border-l-4 border-gray-100 hover:border-blue-600 pl-8 transition-all duration-300">
      <div className="mb-6">
        <div className="aspect-video rounded-2xl bg-gray-100 mb-6 overflow-hidden shadow-md flex items-center justify-center border border-gray-50 italic text-gray-400 text-xs">
           [Photo Pôle]
        </div>
        <h4 className="text-[#002B5C] font-black text-xl uppercase tracking-wider mb-1">
          {title}
        </h4>
        <p className="text-blue-600 font-bold text-sm uppercase tracking-widest not-italic mb-4">
          {role}
        </p>
      </div>
      <ul className="space-y-3 not-italic">
        {missions.map((m, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
            <span className="text-blue-500 font-black">•</span>
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}