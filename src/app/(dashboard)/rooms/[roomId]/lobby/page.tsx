"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePreviewTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Mic, MicOff, Camera, CameraOff, Settings } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface RoomData {
  id: string;
  livekit_room: string;
  status: string;
  clients: { name: string; avatar_url: string | null } | null;
  room_templates: {
    name: string;
    duration_min: number;
    agenda_items: string[];
  } | null;
}

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [joining, setJoining] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function fetchRoom() {
      const res = await fetch(`/api/rooms/${roomId}`);
      if (res.ok) {
        const { room: data } = await res.json();
        setRoom(data);
      }
    }
    fetchRoom();
  }, [roomId]);

  // Preview tracks for camera/mic before joining
  const tracks = usePreviewTracks(
    {
      audio: micOn ? { deviceId: "default" } : false,
      video: camOn ? { deviceId: "default", resolution: { width: 640, height: 400 } } : false,
    },
    (error) => console.warn("Preview track error:", error)
  );

  const videoTrack = tracks?.find((t) => t.kind === Track.Kind.Video);

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTrack]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch(`/api/rooms/${roomId}/sessions`, { method: "POST" });
      if (res.ok) {
        const { session } = await res.json();
        router.push(`/rooms/${roomId}/call?sessionId=${session.id}`);
      } else {
        // Fall back to joining without a session record
        router.push(`/rooms/${roomId}/call`);
      }
    } catch {
      router.push(`/rooms/${roomId}/call`);
    }
  };

  const clientName = room?.clients?.name ?? "Loading...";
  const template = room?.room_templates ?? null;

  return (
    <div className="vr-lobby">
      {/* Camera preview */}
      <div className="vr-lobby-preview">
        {camOn && videoTrack ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "var(--r-xl)",
              transform: "scaleX(-1)",
            }}
          />
        ) : camOn ? (
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
              {getInitials("Topaz Laurent")}
            </div>
            <div style={{ fontSize: 12, color: "rgba(189,212,228,0.6)", letterSpacing: "0.06em" }}>
              Starting camera...
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "rgba(189,212,228,0.4)" }}>
            <CameraOff size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div style={{ fontSize: 12 }}>Camera off</div>
          </div>
        )}
        {/* Status badges */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(0,0,0,0.4)",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          Camera Preview
        </div>
        {videoTrack && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "rgba(16,185,129,0.8)",
              color: "#fff",
              padding: "3px 8px",
              borderRadius: "999px",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            ● Connected
          </div>
        )}
      </div>

      {/* Device toggles */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => setMicOn((m) => !m)}
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
          onClick={() => setCamOn((c) => !c)}
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
          {clientName}
        </h2>
        {template && (
          <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 4 }}>
            {template.name} — {template.duration_min} min
          </div>
        )}
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
          Waiting for participants...
        </div>
      </div>

      {/* Session agenda */}
      {template && (
        <div className="glass-card" style={{ width: "100%", maxWidth: 420, marginBottom: 28 }}>
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
            Session Agenda — {template.name} ({template.duration_min} min)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {template.agenda_items.map((item, i) => (
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
      )}

      {/* Join button */}
      <button
        onClick={handleJoin}
        disabled={joining}
        style={{
          background: "var(--green)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--r)",
          padding: "14px 40px",
          fontWeight: 700,
          fontSize: 15,
          cursor: joining ? "not-allowed" : "pointer",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          transition: "all 0.18s",
          opacity: joining ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!joining) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(16,185,129,0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(16,185,129,0.3)";
        }}
      >
        {joining ? "Joining..." : "Join Room"}
        {!joining && <span style={{ fontSize: 18 }}>→</span>}
      </button>
    </div>
  );
}
