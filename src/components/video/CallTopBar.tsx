"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, PanelRight, ArrowLeft } from "lucide-react";

interface CallTopBarProps {
  roomName: string;
  clientName: string;
  participantCount: number;
  panelOpen: boolean;
  onTogglePanel: () => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function CallTopBar({
  roomName,
  clientName,
  participantCount,
  panelOpen,
  onTogglePanel,
}: CallTopBarProps) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        height: 52,
        background: "rgba(10,16,28,0.97)",
        borderBottom: "1px solid rgba(189,212,228,0.1)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        flexShrink: 0,
      }}
    >
      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "rgba(255,255,255,0.08)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(189,212,228,0.7)",
          cursor: "pointer",
          flexShrink: 0,
        }}
        title="Leave call"
      >
        <ArrowLeft size={15} />
      </button>

      {/* Room info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#f8fbff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {clientName}
        </div>
        <div style={{ fontSize: 10, color: "rgba(189,212,228,0.5)" }}>
          {roomName}
        </div>
      </div>

      {/* Timer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 12px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.07)",
          fontSize: 12,
          fontWeight: 700,
          color: "#f8fbff",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.05em",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--red)",
            display: "inline-block",
            animation: "pulse 2s infinite",
          }}
        />
        {formatDuration(elapsed)}
      </div>

      {/* Participants */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12,
          color: "rgba(189,212,228,0.6)",
        }}
      >
        <Users size={13} />
        {participantCount}
      </div>

      {/* Panel toggle */}
      <button
        onClick={onTogglePanel}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: panelOpen
            ? "rgba(183,149,91,0.2)"
            : "rgba(255,255,255,0.08)",
          border: panelOpen
            ? "1px solid rgba(183,149,91,0.35)"
            : "1px solid transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: panelOpen ? "var(--gold)" : "rgba(189,212,228,0.7)",
          cursor: "pointer",
        }}
        title={panelOpen ? "Close panel" : "Open panel"}
      >
        <PanelRight size={15} />
      </button>
    </div>
  );
}
