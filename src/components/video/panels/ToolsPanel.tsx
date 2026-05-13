"use client";

import { ClipboardList, Timer, Camera, FileText, Share2, PenTool } from "lucide-react";

const TOOLS = [
  { id: "checklist", icon: ClipboardList, label: "Checklist" },
  { id: "timer", icon: Timer, label: "Timer" },
  { id: "screenshot", icon: Camera, label: "Screenshot" },
  { id: "quote", icon: FileText, label: "Quote" },
  { id: "share", icon: Share2, label: "Share Files" },
  { id: "whiteboard", icon: PenTool, label: "Whiteboard" },
];

export default function ToolsPanel() {
  return (
    <div style={{ padding: 16, overflowY: "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(189,212,228,0.5)", marginBottom: 12 }}>
        Session Tools
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(189,212,228,0.1)",
              borderRadius: 12,
              padding: "16px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              transition: "all 0.15s",
              color: "rgba(189,212,228,0.7)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.borderColor = "rgba(189,212,228,0.25)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(189,212,228,0.1)";
            }}
          >
            <Icon size={22} style={{ color: "var(--gold)" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
