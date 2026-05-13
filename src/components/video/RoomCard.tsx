"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { getInitials } from "@/lib/utils";

export interface RoomRow {
  id: string;
  livekit_room: string | null;
  status: string;
  created_at: string;
  template_id: string | null;
  clients: { name: string; avatar_url: string | null } | null;
}

export default function RoomCard({ room }: { room: RoomRow }) {
  const router = useRouter();
  const clientName = room.clients?.name ?? "Unknown Client";
  const avatarUrl = room.clients?.avatar_url ?? null;

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className={`pill ${room.status === "active" ? "pill-green" : "pill-amber"}`}>
          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
        </span>
      </div>

      {/* Avatar + info */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={clientName}
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
            {getInitials(clientName)}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {clientName}
          </div>
          {room.template_id && (
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {room.template_id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            </div>
          )}
        </div>
      </div>

      {/* Created date */}
      <div style={{ fontSize: 11, color: "var(--ink-muted)", letterSpacing: "0.03em" }}>
        Created: {new Date(room.created_at).toLocaleDateString()}
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
