"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import AgendaPanel from "./panels/AgendaPanel";
import DecisionsPanel from "./panels/DecisionsPanel";
import ApprovalsPanel from "./panels/ApprovalsPanel";
import FloorPlanPanel from "./panels/FloorPlanPanel";
import ToolsPanel from "./panels/ToolsPanel";
import NotesPanel from "./panels/NotesPanel";

type Tab = "agenda" | "decisions" | "approvals" | "floorplan" | "tools" | "notes";

const TABS: { id: Tab; label: string }[] = [
  { id: "agenda", label: "Agenda" },
  { id: "decisions", label: "Decisions" },
  { id: "approvals", label: "Approvals" },
  { id: "floorplan", label: "Floor Plan" },
  { id: "tools", label: "Tools" },
  { id: "notes", label: "Notes" },
];

interface SessionPanelProps {
  sessionId?: string;
}

export default function SessionPanel({ sessionId }: SessionPanelProps) {
  const [active, setActive] = useState<Tab>("agenda");

  return (
    <div className="vc-session-panel">
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(189,212,228,0.1)",
          flexShrink: 0,
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn("vc-panel-tab", active === tab.id && "active")}
            style={{ border: "none", background: "transparent", cursor: "pointer" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {active === "agenda" && <AgendaPanel sessionId={sessionId} />}
        {active === "decisions" && <DecisionsPanel sessionId={sessionId} />}
        {active === "approvals" && <ApprovalsPanel sessionId={sessionId} />}
        {active === "floorplan" && <FloorPlanPanel />}
        {active === "tools" && <ToolsPanel />}

        {active === "notes" && <NotesPanel sessionId={sessionId} />}
      </div>
    </div>
  );
}
