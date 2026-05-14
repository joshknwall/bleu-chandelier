"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useDecisions, Decision } from "@/hooks/useDecisions";

function DecisionItem({ text }: { text: string }) {
  return (
    <div
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
      <span style={{ fontSize: 12, color: "rgba(189,212,228,0.85)", flex: 1 }}>{text}</span>
    </div>
  );
}

function AddDecisionUI({
  onAdd,
}: {
  onAdd: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  const submit = () => {
    const trimmed = input.trim();
    if (trimmed) onAdd(trimmed);
    setInput("");
    setAdding(false);
  };

  if (adding) {
    return (
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") setAdding(false);
          }}
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
          onClick={submit}
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
    );
  }

  return (
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
  );
}

function LiveDecisionsPanel({ sessionId }: { sessionId: string }) {
  const { decisions, addDecision } = useDecisions(sessionId);

  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(189,212,228,0.5)",
          marginBottom: 4,
        }}
      >
        Captured Decisions
      </div>

      {decisions.map((d: Decision) => (
        <DecisionItem key={d.id} text={d.text} />
      ))}

      <AddDecisionUI onAdd={addDecision} />
    </div>
  );
}

function DemoDecisionsPanel() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(189,212,228,0.5)",
          marginBottom: 4,
        }}
      >
        Captured Decisions
      </div>
      <div
        style={{
          padding: "24px 16px",
          textAlign: "center",
          color: "rgba(189,212,228,0.4)",
          fontSize: 12,
        }}
      >
        Decisions will be captured here during sessions
      </div>
    </div>
  );
}

export default function DecisionsPanel({ sessionId }: { sessionId?: string }) {
  if (sessionId) return <LiveDecisionsPanel sessionId={sessionId} />;
  return <DemoDecisionsPanel />;
}
