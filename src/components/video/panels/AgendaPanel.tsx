"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const AGENDA_ITEMS = [
  "Welcome & introductions",
  "Review event timeline",
  "Vendor confirmations",
  "Floor plan walkthrough",
  "Color palette approval",
  "Budget review",
  "Next steps & action items",
];

const AI_SUGGESTIONS = [
  "Add contingency plan discussion",
  "Review catering dietary requirements",
];

export default function AgendaPanel() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(189,212,228,0.5)", marginBottom: 4 }}>
        Session Agenda
      </div>

      {AGENDA_ITEMS.map((item, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: checked.has(i) ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
            border: "1px solid",
            borderColor: checked.has(i) ? "rgba(16,185,129,0.3)" : "rgba(189,212,228,0.1)",
            borderRadius: 10,
            padding: "10px 12px",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            transition: "all 0.15s",
          }}
        >
          {/* Circular checkbox */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: checked.has(i) ? "var(--green)" : "rgba(189,212,228,0.3)",
              background: checked.has(i) ? "var(--green)" : "transparent",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            {checked.has(i) && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span
            style={{
              fontSize: 12,
              color: checked.has(i) ? "rgba(189,212,228,0.5)" : "rgba(189,212,228,0.85)",
              textDecoration: checked.has(i) ? "line-through" : "none",
              flex: 1,
            }}
          >
            {item}
          </span>
        </button>
      ))}

      {/* AI suggestions */}
      <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(183,149,91,0.7)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
        <Sparkles size={12} style={{ color: "var(--gold)" }} />
        AI Suggestions
      </div>
      {AI_SUGGESTIONS.map((s, i) => (
        <div
          key={i}
          style={{
            background: "rgba(183,149,91,0.1)",
            border: "1px solid rgba(183,149,91,0.25)",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 12,
            color: "rgba(241,230,207,0.85)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Sparkles size={12} style={{ color: "var(--gold)", flexShrink: 0 }} />
          {s}
        </div>
      ))}
    </div>
  );
}
