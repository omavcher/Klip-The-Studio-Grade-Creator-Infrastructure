// /dashboard/layout.tsx
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto no-scrollbar pt-16 md:pt-0">
        <div className="p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}