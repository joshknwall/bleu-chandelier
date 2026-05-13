"use client";

import { useState } from "react";
import { Video, Plus } from "lucide-react";
import { DEMO_ROOMS, ROOM_TEMPLATES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import RoomCard from "@/components/video/RoomCard";
import TemplateCard from "@/components/video/TemplateCard";
import CreateRoomModal from "@/components/video/CreateRoomModal";

type Tab = "active" | "templates";

export default function RoomsPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [modalOpen, setModalOpen] = useState(false);

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
    <div style={{ padding: "32px 36px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
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
        style={{
          display: "flex",
          gap: 4,
          background: "rgba(255,255,255,0.5)",
          borderRadius: "999px",
          padding: 4,
          width: "fit-content",
          marginBottom: 28,
          backdropFilter: "blur(8px)",
        }}
      >
        <button style={tabStyle("active")} onClick={() => setTab("active")}>
          Active ({DEMO_ROOMS.length})
        </button>
        <button style={tabStyle("templates")} onClick={() => setTab("templates")}>
          Templates ({ROOM_TEMPLATES.length})
        </button>
      </div>

      {/* Grid */}
      {tab === "active" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {DEMO_ROOMS.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      {tab === "templates" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {ROOM_TEMPLATES.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      <CreateRoomModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
