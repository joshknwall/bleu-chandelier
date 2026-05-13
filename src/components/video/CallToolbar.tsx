"use client";

import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  ScreenShareOff,
  PanelRight,
  PhoneOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CallToolbarProps {
  micOn: boolean;
  camOn: boolean;
  screenSharing: boolean;
  panelOpen: boolean;
  onMic: () => void;
  onCam: () => void;
  onScreen: () => void;
  onPanel: () => void;
  onLeave: () => void;
}

export default function CallToolbar({
  micOn,
  camOn,
  screenSharing,
  panelOpen,
  onMic,
  onCam,
  onScreen,
  onPanel,
  onLeave,
}: CallToolbarProps) {
  return (
    <div className="vc-toolbar">
      {/* Mic */}
      <button
        onClick={onMic}
        className={cn("vc-tool", !micOn && "active")}
        style={!micOn ? { background: "var(--red)" } : undefined}
        title={micOn ? "Mute" : "Unmute"}
      >
        {micOn ? <Mic size={18} /> : <MicOff size={18} />}
      </button>

      {/* Camera */}
      <button
        onClick={onCam}
        className={cn("vc-tool", !camOn && "active")}
        style={!camOn ? { background: "var(--red)" } : undefined}
        title={camOn ? "Turn off camera" : "Turn on camera"}
      >
        {camOn ? <Camera size={18} /> : <CameraOff size={18} />}
      </button>

      {/* Screen share */}
      <button
        onClick={onScreen}
        className={cn("vc-tool", screenSharing && "active")}
        title={screenSharing ? "Stop sharing" : "Share screen"}
      >
        {screenSharing ? <ScreenShareOff size={18} /> : <ScreenShare size={18} />}
      </button>

      <div
        style={{
          width: 1,
          height: 28,
          background: "rgba(189,212,228,0.12)",
          margin: "0 4px",
        }}
      />

      {/* Session panel */}
      <button
        onClick={onPanel}
        className={cn("vc-tool", panelOpen && "active")}
        title={panelOpen ? "Close panel" : "Open session panel"}
      >
        <PanelRight size={18} />
      </button>

      <div
        style={{
          width: 1,
          height: 28,
          background: "rgba(189,212,228,0.12)",
          margin: "0 4px",
        }}
      />

      {/* Leave */}
      <button
        onClick={onLeave}
        className="vc-tool danger"
        title="End call"
        style={{
          gap: 8,
          padding: "0 16px",
          borderRadius: 24,
          width: "auto",
        }}
      >
        <PhoneOff size={16} />
        <span style={{ fontSize: 12, fontWeight: 700 }}>End</span>
      </button>
    </div>
  );
}
