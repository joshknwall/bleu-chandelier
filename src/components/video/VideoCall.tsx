"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_ROOMS } from "@/lib/constants";
import CallTopBar from "./CallTopBar";
import CallToolbar from "./CallToolbar";
import VideoGrid from "./VideoGrid";
import SessionPanel from "./SessionPanel";

interface VideoCallProps {
  roomId: string;
}

export default function VideoCall({ roomId }: VideoCallProps) {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const room = DEMO_ROOMS.find((r) => r.id === roomId) ?? DEMO_ROOMS[0];

  const participants = [
    {
      id: "self",
      name: "Topaz Laurent",
      isSelf: true,
      isMuted: !micOn,
    },
    {
      id: "client",
      name: room.client,
      avatarUrl: room.avatarUrl,
      isMuted: false,
    },
  ];

  const handleLeave = () => {
    router.push(`/rooms/${roomId}/lobby`);
  };

  return (
    <div className="vc-fullscreen">
      <CallTopBar
        roomName={`Room — ${room.event}`}
        clientName={room.client}
        participantCount={participants.length}
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((p) => !p)}
      />

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <VideoGrid participants={participants} />
        {panelOpen && <SessionPanel />}
      </div>

      <CallToolbar
        micOn={micOn}
        camOn={camOn}
        screenSharing={screenSharing}
        panelOpen={panelOpen}
        onMic={() => setMicOn((m) => !m)}
        onCam={() => setCamOn((c) => !c)}
        onScreen={() => setScreenSharing((s) => !s)}
        onPanel={() => setPanelOpen((p) => !p)}
        onLeave={handleLeave}
      />
    </div>
  );
}
