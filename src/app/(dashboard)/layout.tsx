import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar />
          <main
            className="flex-1 overflow-y-auto"
            style={{ background: "var(--bg)" }}
          >
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
