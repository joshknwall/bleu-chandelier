"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/shell/Sidebar";
import Topbar from "@/components/shell/Topbar";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <ToastProvider>
      <div className="flex h-full">
        <Sidebar mobileOpen={mobileOpen} onClose={closeMobile} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar onMenuToggle={toggleMobile} />
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
