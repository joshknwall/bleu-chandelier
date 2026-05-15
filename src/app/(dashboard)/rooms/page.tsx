"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Video, Plus } from "lucide-react";
import { ROOM_TEMPLATES } from "@/lib/constants";
import RoomCard from "@/components/video/RoomCard";
import TemplateCard from "@/components/video/TemplateCard";
import CreateRoomModal from "@/components/video/CreateRoomModal";
import FilterBar from "@/components/ui/FilterBar";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import type { RoomRow } from "@/components/video/RoomCard";

type Tab = "active" | "templates" | "sessions";

interface SessionRow {
  id: string;
  room_id: string;
  started_at: string;
}

interface SessionWithRoom extends SessionRow {
  roomName: string;
}

export default function RoomsPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [modalOpen, setModalOpen] = useState(false);
  const [rooms, setRooms] = useState<RoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});
  const [sessions, setSessions] = useState<SessionWithRoom[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "room" | "session"; id: string; name: string; roomId?: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");
  const { toast } = useToast();

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch("/api/rooms");
      if (res.ok) {
        const { rooms: data } = await res.json();
        setRooms(data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllSessions = useCallback(async (roomList: RoomRow[]) => {
    if (roomList.length === 0) return;
    setSessionsLoading(true);
    try {
      const results = await Promise.all(
        roomList.map(async (room) => {
          const res = await fetch(`/api/rooms/${room.id}/sessions`);
          if (!res.ok) return { roomId: room.id, roomName: room.clients?.name ?? "Unknown", sessions: [] as SessionRow[] };
          const { sessions: data } = await res.json();
          return { roomId: room.id, roomName: room.clients?.name ?? "Unknown", sessions: (data ?? []) as SessionRow[] };
        })
      );

      const counts: Record<string, number> = {};
      const allSessions: SessionWithRoom[] = [];
      for (const r of results) {
        counts[r.roomId] = r.sessions.length;
        for (const s of r.sessions) {
          allSessions.push({ ...s, roomName: r.roomName });
        }
      }
      allSessions.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
      setSessionCounts(counts);
      setSessions(allSessions);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === "session") {
        const res = await fetch(`/api/rooms/${deleteTarget.roomId}/sessions/${deleteTarget.id}`, { method: "DELETE" });
        if (res.ok) {
          toast("Session deleted", { variant: "success" });
          fetchAllSessions(rooms);
        }
      } else {
        const res = await fetch(`/api/rooms/${deleteTarget.id}`, { method: "DELETE" });
        if (res.ok) {
          toast("Room deleted", { variant: "success" });
          fetchRooms();
        }
      }
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (rooms.length > 0) {
      fetchAllSessions(rooms);
    }
  }, [rooms, fetchAllSessions]);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        (r.clients?.name ?? "").toLowerCase().includes(q) ||
        (r.template_id ?? "").toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name-asc":
          return (a.clients?.name ?? "").localeCompare(b.clients?.name ?? "");
        case "name-desc":
          return (b.clients?.name ?? "").localeCompare(a.clients?.name ?? "");
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return result;
  }, [rooms, search, sort]);

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: "8px 20px",
    borderRadius: "999px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    background: tab === t ? "var(--navy)" : "transparent",
    color: tab === t ? "#fff" : "var(--ink-soft)",
    transition: "all 0.15s",
    letterSpacing: "0.04em",
  });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "var(--navy)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Video size={18} style={{ color: "var(--gold)" }} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-h)",
                fontSize: 26,
                fontWeight: 600,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Video Rooms
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0 }}>
            Manage client video sessions and templates
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--navy)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--r)",
            padding: "11px 20px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          <Plus size={16} />
          Create Room
        </button>
      </div>

      {/* Tabs */}
      <div
        className="tab-bar"
        style={{
          background: "rgba(255,255,255,0.5)",
          borderRadius: "999px",
          padding: 4,
          backdropFilter: "blur(8px)",
        }}
      >
        <button style={tabStyle("active")} onClick={() => setTab("active")}>
          Active ({rooms.length})
        </button>
        <button style={tabStyle("templates")} onClick={() => setTab("templates")}>
          Templates ({ROOM_TEMPLATES.length})
        </button>
        <button style={tabStyle("sessions")} onClick={() => setTab("sessions")}>
          Sessions ({sessions.length})
        </button>
      </div>

      {/* Active tab */}
      {tab === "active" && (
        <>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            sortValue={sort}
            onSortChange={setSort}
            sortOptions={[
              { value: "date-desc", label: "Newest First" },
              { value: "date-asc", label: "Oldest First" },
              { value: "name-asc", label: "Name A\u2013Z" },
              { value: "name-desc", label: "Name Z\u2013A" },
            ]}
            showClear={!!search}
            onClear={() => {
              setSearch("");
              setSort("date-desc");
            }}
          />
          {loading ? (
            <SkeletonLoader variant="card" count={4} />
          ) : filteredRooms.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 24px",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 48, opacity: 0.6 }}>📹</div>
              <div style={{ fontFamily: "var(--font-h)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
                {search ? "No rooms match your search" : "No rooms yet"}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-muted)", maxWidth: 340, lineHeight: 1.6 }}>
                {search ? "Try a different search term." : "Create your first video room to start collaborating with clients."}
              </div>
            </div>
          ) : (
            <div className="card-grid">
              {filteredRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  sessionCount={sessionCounts[room.id]}
                  onEdit={() => toast(`Editing ${room.clients?.name ?? "room"}...`)}
                  onArchive={(r) =>
                    toast(`${r.clients?.name ?? "Room"} archived`, {
                      variant: "info",
                      action: { label: "Undo", onClick: () => toast("Restored", { variant: "success" }) },
                    })
                  }
                  onDelete={(r) =>
                    setDeleteTarget({ type: "room", id: r.id, name: r.clients?.name ?? "this room" })
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Templates tab */}
      {tab === "templates" && (
        <div className="card-grid">
          {ROOM_TEMPLATES.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {/* Sessions tab */}
      {tab === "sessions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sessionsLoading ? (
            <SkeletonLoader variant="row" count={5} />
          ) : sessions.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 24px",
                textAlign: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 48, opacity: 0.6 }}>📋</div>
              <div style={{ fontFamily: "var(--font-h)", fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>
                No sessions found
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-muted)", maxWidth: 340, lineHeight: 1.6 }}>
                Sessions will appear here after your first video call.
              </div>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                className="glass-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flex: 1 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {session.roomName}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 2 }}>
                      {new Date(session.started_at).toLocaleDateString()} at{" "}
                      {new Date(session.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setDeleteTarget({
                      type: "session",
                      id: session.id,
                      name: session.roomName,
                      roomId: session.room_id,
                    })
                  }
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r)",
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: "var(--red)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteTarget?.type === "session" ? "Session" : "Room"}`}
        message={`Are you sure you want to delete this ${deleteTarget?.type} for ${deleteTarget?.name ?? "this item"}? This action cannot be undone.`}
        icon="🗑"
        variant="danger"
        loading={deleting}
      />

      <CreateRoomModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setModalOpen(false);
          fetchRooms();
        }}
      />
    </div>
  );
}
