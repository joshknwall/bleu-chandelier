"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Copy, Link, Archive, Trash2 } from "lucide-react";
import { getInitials } from "@/lib/utils";
import ActionMenu, { type ActionItem } from "@/components/ui/ActionMenu";

export interface RoomRow {
  id: string;
  livekit_room: string | null;
  status: string;
  created_at: string;
  template_id: string | null;
  clients: { name: string; avatar_url: string | null } | null;
}

interface RoomCardProps {
  room: RoomRow;
  sessionCount?: number;
  onEdit?: (room: RoomRow) => void;
  onArchive?: (room: RoomRow) => void;
  onDelete?: (room: RoomRow) => void;
  selected?: boolean;
  onSelect?: (room: RoomRow) => void;
}

export default function RoomCard({
  room,
  sessionCount,
  onEdit,
  onArchive,
  onDelete,
  selected,
  onSelect,
}: RoomCardProps) {
  const router = useRouter();
  const clientName = room.clients?.name ?? "Unknown Client";
  const avatarUrl = room.clients?.avatar_url ?? null;

  const actions: ActionItem[] = [
    {
      label: "Edit Room",
      icon: <Edit size={14} />,
      onClick: () => onEdit?.(room),
    },
    {
      label: "Duplicate",
      icon: <Copy size={14} />,
      onClick: () => {},
    },
    {
      label: "Copy Invite Link",
      icon: <Link size={14} />,
      onClick: () => {
        navigator.clipboard?.writeText(`${window.location.origin}/rooms/${room.id}/lobby`);
      },
    },
    {
      label: "Archive",
      icon: <Archive size={14} />,
      onClick: () => onArchive?.(room),
      dividerBefore: true,
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} />,
      onClick: () => onDelete?.(room),
      danger: true,
    },
  ];

  return (
    <div
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        outline: selected ? "2px solid var(--gold)" : undefined,
        outlineOffset: selected ? -2 : undefined,
      }}
    >
      {/* Status + kebab */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {onSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(room);
              }}
              style={{ cursor: "pointer" }}
            />
          )}
          <span className={`pill ${room.status === "active" ? "pill-green" : "pill-amber"}`}>
            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
          </span>
        </div>
        <ActionMenu items={actions} />
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

      {/* Created date + session count */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--ink-muted)", letterSpacing: "0.03em" }}>
        <span>Created: {new Date(room.created_at).toLocaleDateString()}</span>
        {sessionCount !== undefined && (
          <span
            style={{
              background: "var(--navy)",
              color: "#fff",
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {sessionCount} session{sessionCount !== 1 ? "s" : ""}
          </span>
        )}
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
