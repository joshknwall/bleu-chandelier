"use client";

import { Clock, Download, FileText, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface PostCallSummaryProps {
  duration: number;
  clientName: string;
  recordingUrl?: string | null;
  decisions?: string[];
  actionItems?: string[];
  onClose: () => void;
}

export default function PostCallSummary({
  duration,
  clientName,
  recordingUrl,
  decisions = [],
  actionItems = [],
  onClose,
}: PostCallSummaryProps) {
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,15,26,0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 32,
          animation: "fadeIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--green-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <CheckCircle size={28} style={{ color: "var(--green)" }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-h)",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--ink)",
              margin: "0 0 4px",
            }}
          >
            Session Complete
          </h2>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0 }}>
            Call with {clientName}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: 16,
              background: "var(--surface-alt)",
              borderRadius: "var(--r)",
              textAlign: "center",
            }}
          >
            <Clock size={18} style={{ color: "var(--gold)", marginBottom: 6 }} />
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-h)" }}>
              {formatDuration(duration)}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Duration</div>
          </div>
          <div
            style={{
              padding: 16,
              background: "var(--surface-alt)",
              borderRadius: "var(--r)",
              textAlign: "center",
            }}
          >
            <FileText size={18} style={{ color: "var(--gold)", marginBottom: 6 }} />
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-h)" }}>
              {decisions.length + actionItems.length}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>Items captured</div>
          </div>
        </div>

        {/* Decisions */}
        {decisions.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--ink-muted)",
                marginBottom: 8,
              }}
            >
              Decisions Made
            </div>
            {decisions.map((d, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--ink)",
                  padding: "6px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <CheckCircle size={14} style={{ color: "var(--green)", marginTop: 2, flexShrink: 0 }} />
                {d}
              </div>
            ))}
          </div>
        )}

        {/* Action items */}
        {actionItems.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--ink-muted)",
                marginBottom: 8,
              }}
            >
              Action Items
            </div>
            {actionItems.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--ink)",
                  padding: "6px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <input type="checkbox" style={{ marginTop: 2, flexShrink: 0 }} />
                {a}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          {recordingUrl && (
            <Button
              variant="secondary"
              onClick={() => window.open(recordingUrl, "_blank")}
              style={{ flex: 1 }}
            >
              <Download size={14} /> Download Recording
            </Button>
          )}
          <Button variant="gold" onClick={onClose} style={{ flex: 1 }}>
            Back to Rooms
          </Button>
        </div>
      </div>
    </div>
  );
}
