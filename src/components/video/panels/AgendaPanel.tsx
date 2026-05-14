"use client";

import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { useAgenda, AgendaItem } from "@/hooks/useAgenda";

const AI_SUGGESTIONS = [
  "Add contingency plan discussion",
  "Review catering dietary requirements",
];

const checkboxStyle = (completed: boolean) => ({
  width: 18,
  height: 18,
  borderRadius: "50%",
  border: "2px solid",
  borderColor: completed ? "var(--green)" : "rgba(189,212,228,0.3)",
  background: completed ? "var(--green)" : "transparent",
  flexShrink: 0 as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.15s",
});

const itemBtnStyle = (completed: boolean) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: completed ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
  border: "1px solid",
  borderColor: completed ? "rgba(16,185,129,0.3)" : "rgba(189,212,228,0.1)",
  borderRadius: 10,
  padding: "10px 12px",
  cursor: "pointer",
  textAlign: "left" as const,
  width: "100%",
  transition: "all 0.15s",
});

function Checkmark() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1 4l3 3 5-6"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AISuggestions() {
  return (
    <>
      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(183,149,91,0.7)",
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
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
    </>
  );
}

function LiveAgendaPanel({ sessionId }: { sessionId: string }) {
  const { items, toggleItem, addItem } = useAgenda(sessionId);
  const [inputValue, setInputValue] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      await addItem(trimmed);
      setInputValue("");
    }
    setAdding(false);
  };

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
        Session Agenda
      </div>

      {items.map((item: AgendaItem) => (
        <button
          key={item.id}
          onClick={() => toggleItem(item.id)}
          style={itemBtnStyle(item.completed)}
        >
          <div style={checkboxStyle(item.completed)}>
            {item.completed && <Checkmark />}
          </div>
          <span
            style={{
              fontSize: 12,
              color: item.completed
                ? "rgba(189,212,228,0.5)"
                : "rgba(189,212,228,0.85)",
              textDecoration: item.completed ? "line-through" : "none",
              flex: 1,
            }}
          >
            {item.text}
          </span>
        </button>
      ))}

      {/* Add item */}
      {adding ? (
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <input
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="New agenda item…"
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
            onClick={handleAdd}
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
          Add Item
        </button>
      )}

      <AISuggestions />
    </div>
  );
}

function DemoAgendaPanel() {
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
        Session Agenda
      </div>
      <div
        style={{
          padding: "24px 16px",
          textAlign: "center",
          color: "rgba(189,212,228,0.4)",
          fontSize: 12,
        }}
      >
        Start a session to track agenda items
      </div>
      <AISuggestions />
    </div>
  );
}

export default function AgendaPanel({ sessionId }: { sessionId?: string }) {
  if (sessionId) return <LiveAgendaPanel sessionId={sessionId} />;
  return <DemoAgendaPanel />;
}
