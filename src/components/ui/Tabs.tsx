"use client";

import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({ items, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid var(--border)",
      }}
    >
      {items.map((item) => {
        const isActive = item.id === activeTab;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--ink)" : "var(--ink-muted)",
              background: "transparent",
              border: "none",
              borderBottom: isActive
                ? "2px solid var(--gold)"
                : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s",
              marginBottom: -1,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--ink-soft)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--ink-muted)";
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
