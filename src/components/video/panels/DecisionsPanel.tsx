"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";

const INITIAL_DECISIONS = [
  "Champagne silk linens confirmed",
  "Garden style arch with roses",
  "7-piece band for reception",
];

export default function DecisionsPanel() {
  const [decisions, setDecisions] = useState(INITIAL_DECISIONS);
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  const addDecision = () => {
    const trimmed = input.trim();
    if (trimmed) {
      setDecisions(prev => [...prev, trimmed]);
      setInput("");
    }
    setAdding(false);
  };

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(189,212,228,0.5)", marginBottom: 4 }}>
        Captured Decisions
      </div>

      {decisions.map((d, i) => (
        <div
          key={i}
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 10,
            padding: "10px 12px",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "rgba(16,185,129,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Check size={10} style={{ color: "var(--green)" }} />
          </div>
          <span style={{ fontSize: 12, color: "rgba(189,212,228,0.85)", flex: 1 }}>{d}</span>
        </div>
      ))}

      {/* Add decision */}
      {adding ? (
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <input
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addDecision(); if (e.key === "Escape") setAdding(false); }}
            placeholder="Type decision…"
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(189,212,228,0.2)",
              borderRadius: 8,
              padding: "8px 12px",
              color: "rgba(189,212,228,0.9)",
              fontSize: 12,
              outline: "none",
            }}
          />
          <button
            onClick={addDecision}
            style={{
              background: "var(--green)",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px dashed rgba(189,212,228,0.2)",
            borderRadius: 10,
            padding: "10px 12px",
            cursor: "pointer",
            color: "rgba(189,212,228,0.5)",
            fontSize: 12,
            width: "100%",
            marginTop: 4,
          }}
        >
          <Plus size={14} />
          Add Decision
        </button>
      )}
    </div>
  );
}
