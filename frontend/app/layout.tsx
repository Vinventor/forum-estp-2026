'use client';

import './globals.css';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation'; // Pour savoir sur quelle page on est

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Liste des pages où l'on cache le beau bandeau (Dashboard, Admin, Login, Register)
  const isAppPage = pathname?.startsWith('/dashboard') || 
                    pathname?.startsWith('/admin') || 
                    pathname?.startsWith('/login') ||
                    pathname?.startsWith('/register');

  return (
    <html lang="fr">
      <body className="antialiased selection:bg-blue-100">
        
        {/* --- NAVBAR UNIVERSELLE (Affichée seulement sur la vitrine) --- */}
        {!isAppPage && (
          <nav className="bg-white border-b-2 border-gray-100 sticky top-0 z-[100] shadow-md">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-24 italic">
                
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="flex flex-col border-l-4 border-[#002B5C] pl-3 group-hover:border-blue-500 transition-colors">
                    <span className="text-2xl font-black text-[#002B5C] leading-none tracking-tighter uppercase">Forum</span>
                    <span className="text-xl font-bold text-[#0056b3] leading-none tracking-widest uppercase">ESTP</span>
                  </div>
                </Link>

                {/* MENU PRINCIPAL */}
                <div className="hidden lg:flex items-center space-x-2">
                  <NavLink href="/" label="Accueil" />
                  
                  <NavDropdown 
                    label="Le Forum" 
                    items={[
                      { label: "Présentation 47ème", href: "/le-forum/presentation" },
                      { label: "L'Équipe (26 membres)", href: "/le-forum/equipe" }
                    ]} 
                  />

                  <NavDropdown 
                    label="Partenaires" 
                    items={[
                      { label: "Nos Partenaires", href: "/#partenaires" }
                    ]} 
                  />

                  <NavLink href="/contact" label="Contact" />
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-4">
                  <Link href="/login" className="hidden md:block text-[#002B5C] font-black hover:text-blue-600 px-4 py-2 uppercase text-sm tracking-widest">
                    Log In
                  </Link>
                  <Link href="/register" className="bg-[#002B5C] text-white px-8 py-4 rounded-full font-black text-sm hover:bg-black hover:scale-105 transition shadow-lg uppercase tracking-widest">
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main>{children}</main>
      </body>
    </html>
  );
}

// --- COMPOSANTS DE NAVIGATION (AVEC TA LOGIQUE DE DÉLAI) ---

function NavDropdown({ label, items }: { label: string, items: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div className="relative h-full flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className={`px-6 py-3 flex items-center gap-2 font-black text-sm uppercase tracking-widest rounded-xl transition-all ${isOpen ? 'bg-blue-50 text-[#002B5C]' : 'text-gray-700 hover:bg-gray-50'}`}>
        {label} <span className="text-[10px] opacity-40">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-[85%] left-0 w-72 bg-white border-2 border-gray-100 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
          {items.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className="block px-8 py-5 text-sm text-gray-700 hover:bg-[#002B5C] hover:text-white font-bold border-b border-gray-50 last:border-0 transition-colors not-italic"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NavLink({ href, label }: { href: string, label: string }) {
  return (
    <Link href={href} className="px-6 py-3 text-gray-700 font-black text-sm uppercase tracking-widest hover:bg-blue-50 hover:text-[#002B5C] rounded-xl transition-all">
      {label}
    </Link>
  );
}