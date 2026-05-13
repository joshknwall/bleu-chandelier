"use client";

import { Maximize2, Columns } from "lucide-react";

const FLOOR_ELEMENTS = [
  { label: "Stage", x: 35, y: 5, w: 30, h: 12, color: "#1a2940" },
  { label: "Dance Floor", x: 30, y: 20, w: 40, h: 20, color: "#172438" },
  { label: "Table 1", x: 5, y: 20, w: 18, h: 12, color: "#1e2d42" },
  { label: "Table 2", x: 5, y: 38, w: 18, h: 12, color: "#1e2d42" },
  { label: "Table 3", x: 5, y: 56, w: 18, h: 12, color: "#1e2d42" },
  { label: "Table 4", x: 77, y: 20, w: 18, h: 12, color: "#1e2d42" },
  { label: "Table 5", x: 77, y: 38, w: 18, h: 12, color: "#1e2d42" },
  { label: "Table 6", x: 77, y: 56, w: 18, h: 12, color: "#1e2d42" },
  { label: "Bar", x: 5, y: 74, w: 26, h: 14, color: "#2a1f3a" },
  { label: "Catering", x: 37, y: 74, w: 26, h: 14, color: "#1a2a1a" },
  { label: "DJ Booth", x: 69, y: 74, w: 26, h: 14, color: "#1a2030" },
];

export default function FloorPlanPanel() {
  return (
    <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(189,212,228,0.5)" }}>
        Floor Plan
      </div>

      {/* Floor plan canvas */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "90%",
          borderRadius: 12,
          background: "#0d1520",
          backgroundImage: "linear-gradient(rgba(189,212,228,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(189,212,228,0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          overflow: "hidden",
          border: "1px solid rgba(189,212,228,0.1)",
        }}
      >
        {FLOOR_ELEMENTS.map((el) => (
          <div
            key={el.label}
            style={{
              position: "absolute",
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.w}%`,
              height: `${el.h}%`,
              background: el.color,
              border: "1px solid rgba(189,212,228,0.15)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: "rgba(189,212,228,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {el.label}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(189,212,228,0.15)",
            borderRadius: 8,
            padding: "8px 0",
            color: "rgba(189,212,228,0.7)",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          <Maximize2 size={12} />
          Full Screen
        </button>
        <button
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(189,212,228,0.15)",
            borderRadius: 8,
            padding: "8px 0",
            color: "rgba(189,212,228,0.7)",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          <Columns size={12} />
          Split View
        </button>
      </div>
    </div>
  );
}
