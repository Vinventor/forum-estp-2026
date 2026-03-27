'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const menu = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Entreprises', href: '/admin/entreprises', icon: '🏢' },
    { label: 'BC1', href: '/admin/bc1', icon: '📝' },
    { label: 'BC2', href: '/admin/bc2', icon: '📋' },
    { label: 'Mailing', href: '/admin/mailing', icon: '✉️' },
    { label: 'Exposants', href: '/admin/exposants', icon: '👤' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans not-italic">
      <aside className="w-64 bg-white border-r border-gray-200 sticky top-0 h-screen p-6 flex flex-col">
        <div className="mb-10 flex flex-col border-l-4 border-[#002B5C] pl-3">
          <span className="text-xl font-black text-[#002B5C] leading-none uppercase">Forum ETP</span>
          <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${pathname === item.href ? 'bg-blue-50 text-[#002B5C]' : 'text-gray-400 hover:text-gray-600'}`}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}