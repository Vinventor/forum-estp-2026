export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* On peut mettre une Sidebar ici ou la laisser dans la page Dashboard */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}