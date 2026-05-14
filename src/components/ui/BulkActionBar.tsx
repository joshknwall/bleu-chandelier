"use client";

import { X } from "lucide-react";

interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
}

export default function BulkActionBar({
  selectedCount,
  actions,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        background: "var(--navy)",
        color: "#fff",
        borderRadius: "var(--r)",
        boxShadow: "var(--sh-lg)",
        flexWrap: "wrap",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          minWidth: 80,
        }}
      >
        {selectedCount} selected
      </span>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              border: `1px solid ${
                a.danger ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.2)"
              }`,
              background: a.danger
                ? "rgba(239,68,68,0.15)"
                : "rgba(255,255,255,0.1)",
              color: a.danger ? "#fca5a5" : "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </div>

      <button
        onClick={onClearSelection}
        aria-label="Clear selection"
        style={{
          marginLeft: "auto",
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.2)",
          background: "none",
          color: "rgba(255,255,255,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
