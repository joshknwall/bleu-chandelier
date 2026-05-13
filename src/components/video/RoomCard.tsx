"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { getInitials } from "@/lib/utils";

interface Room {
  id: string;
  client: string;
  event: string;
  lastActivity: string;
  unread: number;
  avatarUrl?: string;
}

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
      {/* Status + unread */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="pill pill-green">Active</span>
        {room.unread > 0 && (
          <span
            style={{
              background: "var(--red)",
              color: "#fff",
              borderRadius: "999px",
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {room.unread}
          </span>
        )}
      </div>

      {/* Avatar + info */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {room.avatarUrl ? (
          <Image
            src={room.avatarUrl}
            alt={room.client}
            width={48}
            height={48}
            style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            unoptimized
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--navy-light), var(--powder-deep))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {getInitials(room.client)}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {room.client}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {room.event}
          </div>
        </div>
      </div>

      {/* Last activity */}
      <div style={{ fontSize: 11, color: "var(--ink-muted)", letterSpacing: "0.03em" }}>
        Last active: {room.lastActivity}
      </div>

      {/* Enter button */}
      <button
        onClick={() => router.push(`/rooms/${room.id}/lobby`)}
        style={{
          background: "var(--navy)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--r)",
          padding: "10px 0",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          width: "100%",
          transition: "background 0.18s",
          letterSpacing: "0.04em",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--navy-hover)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--navy)")}
      >
        Enter Room
      </button>
    </div>
  );
}
