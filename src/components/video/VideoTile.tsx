"use client";

import { MicOff } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface VideoTileProps {
  name: string;
  avatarUrl?: string;
  isMuted?: boolean;
  isSelf?: boolean;
  isSmall?: boolean;
}

export default function VideoTile({
  name,
  avatarUrl,
  isMuted = false,
  isSelf = false,
  isSmall = false,
}: VideoTileProps) {
  return (
    <div
      className="vc-video-tile"
      style={{
        aspectRatio: isSmall ? "1/1" : "4/3",
        minHeight: isSmall ? 120 : 200,
        outline: isSelf ? "2px solid var(--gold)" : "none",
      }}
    >
      {/* Avatar placeholder (no real video in demo) */}
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            inset: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: isSmall ? 52 : 72,
            height: isSmall ? 52 : 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a2940, #7fa2be)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f8fbff",
            fontWeight: 700,
            fontSize: isSmall ? 20 : 28,
            fontFamily: "var(--font-heading)",
          }}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Name label */}
      <div className="vc-tile-name">
        {name}
        {isSelf && (
          <span style={{ marginLeft: 6, opacity: 0.6, fontSize: 10 }}>(You)</span>
        )}
      </div>

      {/* Mic indicator */}
      <div
        className="vc-tile-mic"
        style={{
          background: isMuted
            ? "rgba(239,68,68,0.7)"
            : "rgba(0,0,0,0.4)",
        }}
      >
        {isMuted && <MicOff size={12} style={{ color: "#fff" }} />}
      </div>
    </div>
  );
}
