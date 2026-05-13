"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Mic, MicOff, Camera, CameraOff, Settings } from "lucide-react";
import { DEMO_ROOMS, ROOM_TEMPLATES } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Find matching room from demo data
  const room = DEMO_ROOMS.find(r => r.id === roomId) ?? DEMO_ROOMS[0];
  const template = ROOM_TEMPLATES[0]; // default to first template

  return (
    <div className="vr-lobby">
      {/* Camera preview */}
      <div className="vr-lobby-preview">
        {camOn ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--navy-light), var(--powder-deep))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {getInitials("Isabelle Laurent")}
            </div>
            <div style={{ fontSize: 12, color: "rgba(189,212,228,0.6)", letterSpacing: "0.06em" }}>
              Camera Preview
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "rgba(189,212,228,0.4)" }}>
            <CameraOff size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div style={{ fontSize: 12 }}>Camera off</div>
          </div>
        )}
      </div>

      {/* Device toggles */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => setMicOn(m => !m)}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: micOn ? "rgba(255,255,255,0.15)" : "var(--red)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            backdropFilter: "blur(8px)",
            transition: "background 0.15s",
          }}
          title={micOn ? "Mute mic" : "Unmute mic"}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button
          onClick={() => setCamOn(c => !c)}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: camOn ? "rgba(255,255,255,0.15)" : "var(--red)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            backdropFilter: "blur(8px)",
            transition: "background 0.15s",
          }}
          title={camOn ? "Turn off camera" : "Turn on camera"}
        >
          {camOn ? <Camera size={20} /> : <CameraOff size={20} />}
        </button>
        <button
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Room info */}
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-h)",
            fontSize: 28,
            fontWeight: 600,
            color: "var(--ink)",
            marginBottom: 6,
          }}
        >
          {room.client}
        </h2>
        <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 4 }}>{room.event}</div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "var(--ink-muted)",
            background: "rgba(255,255,255,0.6)",
            padding: "6px 14px",
            borderRadius: "999px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--amber)",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          Waiting for participants…
        </div>
      </div>

      {/* Session agenda */}
      <div
        className="glass-card"
        style={{ width: "100%", maxWidth: 420, marginBottom: 28 }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: 12,
          }}
        >
          Session Agenda — {template.name} ({template.duration} min)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {template.agenda.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 13,
                color: "var(--ink-soft)",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--gold-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--gold)",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Join button */}
      <button
        onClick={() => router.push(`/rooms/${roomId}/call`)}
        style={{
          background: "var(--green)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--r)",
          padding: "14px 40px",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          transition: "all 0.18s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(16,185,129,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(16,185,129,0.3)";
        }}
      >
        Join Room
        <span style={{ fontSize: 18 }}>→</span>
      </button>
    </div>
  );
}
