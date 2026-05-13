"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function NotesPanel() {
  const [notes, setNotes] = useState("");

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, height: "100%", overflowY: "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(189,212,228,0.5)" }}>
        Host Notes
      </div>

      {/* Warning */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 8,
          padding: "8px 12px",
        }}
      >
        <AlertTriangle size={13} style={{ color: "var(--amber)", flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: "rgba(245,158,11,0.9)", fontWeight: 600 }}>
          Not visible to client
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Private notes for this session…"
        style={{
          flex: 1,
          minHeight: 200,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(189,212,228,0.12)",
          borderRadius: 10,
          padding: "12px 14px",
          color: "rgba(189,212,228,0.85)",
          fontSize: 13,
          lineHeight: 1.7,
          resize: "none",
          outline: "none",
          fontFamily: "var(--font-b)",
        }}
      />

      <div style={{ fontSize: 11, color: "rgba(189,212,228,0.3)", textAlign: "right" }}>
        {notes.length} chars
      </div>
    </div>
  );
}
