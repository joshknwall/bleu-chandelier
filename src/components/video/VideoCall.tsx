"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const participants = [
    {
      id: "self",
      name: "You",
      isSelf: true,
      isMuted: !micOn,
    },
    {
      id: "client",
      name: "Client",
      isMuted: false,
    },
  ];

  const handleLeave = () => {
    router.push(`/rooms/${roomId}/lobby`);
  };

  return (
    <div className="vc-fullscreen">
      <CallTopBar
        roomName={`Room — ${roomId}`}
        clientName="Client"
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
