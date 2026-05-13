"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  Circle,
  Columns,
  PhoneOff,
  X,
} from "lucide-react";
import { DEMO_ROOMS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import SessionPanel from "@/components/video/SessionPanel";

const PLACEHOLDER_PARTICIPANTS = [
  { id: "host", name: "Isabelle Laurent", role: "Host" },
  { id: "client", name: "Amara Whitfield", role: "Client" },
];

export default function CallPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [recording, setRecording] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [splitView, setSplitView] = useState(true);

  const room = DEMO_ROOMS.find(r => r.id === roomId) ?? DEMO_ROOMS[0];

  return (
    <div className="vc-fullscreen">
      {/* Top bar */}
      <div
        style={{
          height: 52,
          background: "rgba(10,15,26,0.95)",
          borderBottom: "1px solid rgba(189,212,228,0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          flexShrink: 0,
        }}
      >
        {/* Room name */}
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-h)",
              fontSize: 16,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.02em",
            }}
          >
            {room.client}
          </span>
          <span style={{ fontSize: 12, color: "rgba(189,212,228,0.45)", marginLeft: 10 }}>
            {room.event}
          </span>
        </div>

        {/* REC indicator */}
        {recording && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "999px",
              padding: "4px 12px",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--red)",
                animation: "pulse 1.2s infinite",
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--red)", letterSpacing: "0.1em" }}>
              REC
            </span>
          </div>
        )}

        {/* Participant count */}
        <div
          style={{
            fontSize: 12,
            color: "rgba(189,212,228,0.6)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--green)",
            }}
          />
          {PLACEHOLDER_PARTICIPANTS.length} participants
        </div>

        {/* Close */}
        <button
          onClick={() => router.push(`/rooms/${roomId}/lobby`)}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.08)",
            color: "rgba(189,212,228,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="Leave call"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Video grid */}
        <div
          style={{
            flex: 1,
            padding: 16,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
            alignContent: "start",
            overflowY: "auto",
          }}
        >
          {PLACEHOLDER_PARTICIPANTS.map(p => (
            <div key={p.id} className="vc-video-tile">
              {/* Avatar */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a2940, #7fa2be)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "0.04em",
                }}
              >
                {getInitials(p.name)}
              </div>

              {/* Name badge */}
              <div className="vc-tile-name">
                {p.name}
                {p.role === "Host" && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 9,
                      fontWeight: 700,
                      background: "var(--gold)",
                      color: "#fff",
                      padding: "1px 5px",
                      borderRadius: "999px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      verticalAlign: "middle",
                    }}
                  >
                    Host
                  </span>
                )}
              </div>

              {/* Mic indicator */}
              <div className="vc-tile-mic">
                {p.id === "host" && !micOn ? (
                  <MicOff size={12} style={{ color: "var(--red)" }} />
                ) : (
                  <Mic size={12} style={{ color: "var(--green)" }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Session panel */}
        {splitView && <SessionPanel />}
      </div>

      {/* Toolbar */}
      <div className="vc-toolbar">
        <button
          className={`vc-tool${!micOn ? " active" : ""}`}
          onClick={() => setMicOn(m => !m)}
          title={micOn ? "Mute" : "Unmute"}
          style={{ background: !micOn ? "var(--red)" : undefined }}
        >
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          className={`vc-tool${!camOn ? " active" : ""}`}
          onClick={() => setCamOn(c => !c)}
          title={camOn ? "Stop camera" : "Start camera"}
          style={{ background: !camOn ? "var(--red)" : undefined }}
        >
          {camOn ? <Camera size={20} /> : <CameraOff size={20} />}
        </button>

        <button
          className={`vc-tool${sharing ? " active" : ""}`}
          onClick={() => setSharing(s => !s)}
          title="Share Screen"
        >
          <ScreenShare size={20} />
        </button>

        <button
          className={`vc-tool${recording ? " active" : ""}`}
          onClick={() => setRecording(r => !r)}
          title={recording ? "Stop recording" : "Start recording"}
          style={{ background: recording ? "var(--red)" : undefined }}
        >
          <Circle size={20} />
        </button>

        <button
          className={`vc-tool${splitView ? " active" : ""}`}
          onClick={() => setSplitView(s => !s)}
          title="Toggle session panel"
        >
          <Columns size={20} />
        </button>

        {/* End call — danger */}
        <button
          className="vc-tool danger"
          onClick={() => router.push("/rooms")}
          title="End call"
          style={{ marginLeft: 16 }}
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}
