"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Video,
  Calendar,
  DollarSign,
  Globe,
  Package,
  Settings,
  Target,
  MessageSquare,
  FileText,
  Image,
  Zap,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { WORKSPACES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Video,
  Calendar,
  DollarSign,
  Globe,
  Package,
  Settings,
  Target,
  MessageSquare,
  FileText,
  Image,
  Zap,
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn("sidebar", collapsed && "collapsed")}
      style={{
        width: collapsed ? "var(--sidebar-cw)" : "var(--sidebar-w)",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(189,212,228,0.1)" }}
      >
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #b7955b 0%, #d4b07a 100%)",
            color: "#fff",
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.04em",
          }}
        >
          BC
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 17,
                fontWeight: 600,
                color: "#f8fbff",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              Bleu Chandelier
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(189,212,228,0.55)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Founder OS
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-1">
        {WORKSPACES.map((ws) => {
          const Icon = ICON_MAP[ws.icon];
          const isActive =
            pathname === `/${ws.id}` || pathname.startsWith(`/${ws.id}/`);
          return (
            <Link
              key={ws.id}
              href={`/${ws.id}`}
              className={cn("nav-item", isActive && "active")}
              title={collapsed ? ws.label : undefined}
            >
              {Icon && (
                <Icon
                  size={18}
                  style={{ flexShrink: 0, opacity: isActive ? 1 : 0.75 }}
                />
              )}
              {!collapsed && <span>{ws.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="flex-shrink-0 p-3"
        style={{ borderTop: "1px solid rgba(189,212,228,0.1)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <button
            className="nav-item flex-1"
            style={{ justifyContent: collapsed ? "center" : undefined }}
            title="Settings"
          >
            <Settings size={16} style={{ flexShrink: 0, opacity: 0.7 }} />
            {!collapsed && <span>Settings</span>}
          </button>
          {!collapsed && (
            <button className="nav-item" style={{ padding: "11px" }} title="Help">
              <HelpCircle size={16} style={{ opacity: 0.7 }} />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="nav-item w-full"
          style={{ justifyContent: collapsed ? "center" : "space-between" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!collapsed && (
            <span style={{ fontSize: 11, opacity: 0.6 }}>Collapse</span>
          )}
          {collapsed ? (
            <ChevronRight size={16} style={{ opacity: 0.6 }} />
          ) : (
            <ChevronLeft size={16} style={{ opacity: 0.6 }} />
          )}
        </button>
      </div>
    </aside>
  );
}
