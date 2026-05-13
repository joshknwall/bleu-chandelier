"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ROOM_TEMPLATES } from "@/lib/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateRoomModal({ open, onClose, onCreated }: Props) {
  const [clientName, setClientName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [agenda, setAgenda] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleCreate = async () => {
    if (!clientName.trim()) {
      setError("Client name is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          templateId: templateId || null,
          customAgenda: agenda.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create room");
      }
      setClientName("");
      setTemplateId("");
      setAgenda("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "var(--r)",
    border: "1px solid var(--border)",
    background: "var(--surface-strong)",
    color: "var(--ink)",
    fontSize: 13,
    fontFamily: "var(--font-b)",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "var(--ink-muted)",
    marginBottom: 6,
    display: "block",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(12, 20, 35, 0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 101,
          width: "100%",
          maxWidth: 480,
          padding: "0 16px",
        }}
      >
        <div className="glass-card" style={{ padding: 28 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "var(--font-h)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
                Create Room
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 2 }}>
                Set up a new video session
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "var(--surface-alt)",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--ink-muted)",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Client name input */}
            <div>
              <label style={labelStyle}>Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Amara Whitfield"
                style={fieldStyle}
              />
            </div>

            {/* Template select */}
            <div>
              <label style={labelStyle}>Session Template</label>
              <select
                value={templateId}
                onChange={e => setTemplateId(e.target.value)}
                style={fieldStyle}
              >
                <option value="">Select a template…</option>
                {ROOM_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.duration} min)</option>
                ))}
              </select>
            </div>

            {/* Custom agenda */}
            <div>
              <label style={labelStyle}>Custom Agenda (optional)</label>
              <textarea
                value={agenda}
                onChange={e => setAgenda(e.target.value)}
                placeholder="Add custom agenda items, one per line…"
                rows={4}
                style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            {error && (
              <div style={{ fontSize: 12, color: "var(--red)", marginTop: -8 }}>{error}</div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: "transparent",
                color: "var(--ink-soft)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
                padding: "11px 0",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              style={{
                flex: 2,
                background: "var(--navy)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--r)",
                padding: "11px 0",
                fontWeight: 700,
                fontSize: 13,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.04em",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating…" : "Create Room"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
