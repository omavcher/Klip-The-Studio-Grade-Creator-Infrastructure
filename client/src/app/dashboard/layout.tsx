import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#050505] overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-y-auto pt-16 md:pt-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}