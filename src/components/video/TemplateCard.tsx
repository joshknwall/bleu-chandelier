"use client";

import {
  Search,
  Palette,
  CheckSquare,
  Handshake,
  Clock,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  Palette,
  CheckSquare,
  Handshake,
  Clock,
};

interface Template {
  id: string;
  name: string;
  duration: number;
  icon: string;
  agenda: readonly string[];
  prep: string;
  tools: readonly string[];
}

export default function TemplateCard({
  template,
  onUse,
  onCustomize,
}: {
  template: Template;
  onUse?: (id: string) => void;
  onCustomize?: (id: string) => void;
}) {
  const Icon = ICON_MAP[template.icon] ?? Clock;

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "var(--gold-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={20} style={{ color: "var(--gold)" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{template.name}</div>
          <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>{template.duration} min</div>
        </div>
      </div>

      {/* Agenda */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {template.agenda.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "var(--ink-soft)" }}>
            <span style={{ color: "var(--gold)", fontWeight: 700, flexShrink: 0, fontSize: 11, marginTop: 1 }}>{i + 1}.</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Prep note */}
      <div
        style={{
          background: "var(--amber-soft)",
          borderRadius: 10,
          padding: "8px 12px",
          fontSize: 11,
          color: "var(--amber-text)",
          lineHeight: 1.5,
        }}
      >
        <span style={{ fontWeight: 700 }}>Prep: </span>
        {template.prep}
      </div>

      {/* Tool pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {template.tools.map((tool) => (
          <span key={tool} className="pill pill-gray">{tool}</span>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={() => onUse?.(template.id)}
          style={{
            flex: 1,
            background: "var(--navy)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--r)",
            padding: "9px 0",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Use Template
        </button>
        <button
          onClick={() => onCustomize?.(template.id)}
          style={{
            flex: 1,
            background: "transparent",
            color: "var(--ink-soft)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r)",
            padding: "9px 0",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Customize
        </button>
      </div>
    </div>
  );
}
