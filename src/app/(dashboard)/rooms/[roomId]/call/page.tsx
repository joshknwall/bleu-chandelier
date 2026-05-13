"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  LiveKitRoom,
  useTracks,
  useLocalParticipant,
  useParticipants,
  useRoomContext,
  VideoTrack,
  AudioTrack,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track, RoomEvent } from "livekit-client";
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  ScreenShareOff,
  Circle,
  Columns,
  PhoneOff,
  X,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import SessionPanel from "@/components/video/SessionPanel";

interface RoomData {
  id: string;
  livekit_room: string;
  clients: { name: string; avatar_url: string | null } | null;
}

export default function CallPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const sessionId = searchParams.get("sessionId");

  const [room, setRoom] = useState<RoomData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoomAndToken() {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (!res.ok) throw new Error("Failed to fetch room");
        const { room: data } = await res.json();
        setRoom(data);

        const livekitRoomName = data.livekit_room ?? `room-${roomId}`;
        const tokenRes = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: livekitRoomName,
            participantIdentity: `host-${Date.now()}`,
            participantName: "Topaz Laurent",
            role: "host",
          }),
        });

        if (!tokenRes.ok) {
          const data = await tokenRes.json();
          throw new Error(data.error || "Failed to get token");
        }

        const { token } = await tokenRes.json();
        setToken(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
      }
    }

    fetchRoomAndToken();
  }, [roomId]);

  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (error) {
    return (
      <div className="vc-fullscreen" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Connection Error</div>
          <div style={{ fontSize: 14, color: "rgba(189,212,228,0.6)", marginBottom: 20 }}>{error}</div>
          <a
            href={`/rooms/${roomId}/lobby`}
            style={{ color: "var(--gold)", fontSize: 14, textDecoration: "underline" }}
          >
            Back to Lobby
          </a>
        </div>
      </div>
    );
  }

  if (!token || !livekitUrl) {
    return (
      <div className="vc-fullscreen" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(189,212,228,0.2)",
              borderTopColor: "var(--gold)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div style={{ fontSize: 14, color: "rgba(189,212,228,0.6)" }}>Connecting to room...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={livekitUrl}
      token={token}
      connect={true}
      audio={true}
      video={true}
      onError={(err) => setError(err.message)}
    >
      <CallUI room={room} roomId={roomId} sessionId={sessionId} livekitRoomName={room?.livekit_room ?? `room-${roomId}`} />
    </LiveKitRoom>
  );
}

function CallUI({
  room,
  roomId,
  sessionId,
  livekitRoomName,
}: {
  room: RoomData | null;
  roomId: string;
  sessionId: string | null;
  livekitRoomName: string;
}) {
  const router = useRouter();
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const lkRoom = useRoomContext();

  const [recording, setRecording] = useState(false);
  const [egressId, setEgressId] = useState<string | null>(null);
  const [splitView, setSplitView] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const cameraTracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged] }
  );

  const audioTracks = useTracks([{ source: Track.Source.Microphone, withPlaceholder: false }]);

  const micEnabled = localParticipant.isMicrophoneEnabled;
  const camEnabled = localParticipant.isCameraEnabled;
  const screenEnabled = localParticipant.isScreenShareEnabled;

  const toggleMic = useCallback(async () => {
    await localParticipant.setMicrophoneEnabled(!micEnabled);
  }, [localParticipant, micEnabled]);

  const toggleCam = useCallback(async () => {
    await localParticipant.setCameraEnabled(!camEnabled);
  }, [localParticipant, camEnabled]);

  const toggleScreen = useCallback(async () => {
    await localParticipant.setScreenShareEnabled(!screenEnabled);
  }, [localParticipant, screenEnabled]);

  const toggleRecording = useCallback(async () => {
    if (!recording) {
      try {
        const res = await fetch("/api/livekit/egress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName: livekitRoomName, sessionId }),
        });
        if (res.ok) {
          const { egressId: id } = await res.json();
          setEgressId(id);
          setRecording(true);
        }
      } catch {
        // silently fail — recording is non-critical
      }
    } else {
      if (egressId) {
        try {
          await fetch("/api/livekit/egress", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ egressId, sessionId }),
          });
        } catch {
          // silently fail
        }
      }
      setEgressId(null);
      setRecording(false);
    }
  }, [recording, egressId, livekitRoomName, sessionId]);

  const endCall = useCallback(async () => {
    if (recording && egressId) {
      await fetch("/api/livekit/egress", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ egressId, sessionId }),
      });
    }
    await lkRoom.disconnect();
    router.push("/rooms");
  }, [lkRoom, router, recording, egressId, sessionId]);

  const clientName = room?.clients?.name ?? "Client";

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
            {clientName}
          </span>
          <span style={{ fontSize: 12, color: "rgba(189,212,228,0.3)", marginLeft: 10 }}>
            {formatTime(elapsed)}
          </span>
        </div>

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

        <div
          style={{
            fontSize: 12,
            color: "rgba(189,212,228,0.6)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} />
          {participants.length} participant{participants.length !== 1 ? "s" : ""}
        </div>

        <button
          onClick={endCall}
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
            gridTemplateColumns: `repeat(auto-fit, minmax(${cameraTracks.length <= 2 ? "320px" : "240px"}, 1fr))`,
            gap: 12,
            alignContent: "start",
            overflowY: "auto",
          }}
        >
          {cameraTracks.map((trackRef) => {
            const participant = trackRef.participant;
            const isLocal = participant.isLocal;
            const name = participant.name || participant.identity;

            return (
              <div key={`${participant.identity}-${trackRef.source}`} className="vc-video-tile">
                {trackRef.publication?.track ? (
                  <VideoTrack
                    trackRef={trackRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "var(--r-lg)",
                    }}
                  />
                ) : (
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
                    }}
                  >
                    {getInitials(name)}
                  </div>
                )}

                <div className="vc-tile-name">
                  {name}
                  {isLocal && (
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
                      }}
                    >
                      You
                    </span>
                  )}
                </div>

                <div className="vc-tile-mic">
                  {participant.isMicrophoneEnabled ? (
                    <Mic size={12} style={{ color: "var(--green)" }} />
                  ) : (
                    <MicOff size={12} style={{ color: "var(--red)" }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Audio tracks (hidden) */}
        {audioTracks.map((trackRef) =>
          !trackRef.participant.isLocal && trackRef.publication ? (
            <AudioTrack key={trackRef.participant.identity} trackRef={trackRef as import("@livekit/components-react").TrackReference} />
          ) : null
        )}

        {/* Session panel */}
        {splitView && <SessionPanel sessionId={sessionId ?? undefined} />}
      </div>

      {/* Toolbar */}
      <div className="vc-toolbar">
        <button
          className={`vc-tool${!micEnabled ? " active" : ""}`}
          onClick={toggleMic}
          title={micEnabled ? "Mute" : "Unmute"}
          style={{ background: !micEnabled ? "var(--red)" : undefined }}
        >
          {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          className={`vc-tool${!camEnabled ? " active" : ""}`}
          onClick={toggleCam}
          title={camEnabled ? "Stop camera" : "Start camera"}
          style={{ background: !camEnabled ? "var(--red)" : undefined }}
        >
          {camEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
        </button>

        <button
          className={`vc-tool${screenEnabled ? " active" : ""}`}
          onClick={toggleScreen}
          title={screenEnabled ? "Stop sharing" : "Share Screen"}
        >
          {screenEnabled ? <ScreenShareOff size={20} /> : <ScreenShare size={20} />}
        </button>

        <button
          className={`vc-tool${recording ? " active" : ""}`}
          onClick={toggleRecording}
          title={recording ? "Stop recording" : "Start recording"}
          style={{ background: recording ? "var(--red)" : undefined }}
        >
          <Circle size={20} />
        </button>

        <button
          className={`vc-tool${splitView ? " active" : ""}`}
          onClick={() => setSplitView((s) => !s)}
          title="Toggle session panel"
        >
          <Columns size={20} />
        </button>

        <button className="vc-tool danger" onClick={endCall} title="End call" style={{ marginLeft: 16 }}>
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}
