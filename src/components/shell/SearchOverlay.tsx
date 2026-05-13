"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { WORKSPACES } from "@/lib/constants";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = WORKSPACES.filter((ws) =>
    ws.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSelect = (id: string) => {
    router.push(`/${id}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      style={{ background: "rgba(10,15,26,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card w-full max-w-lg"
        style={{ padding: 0, overflow: "hidden" }}
      >
        {/* Input row */}
        <div
          className="flex items-center gap-3 px-4"
          style={{
            height: 52,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Search size={16} style={{ color: "var(--ink-muted)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspaces..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--ink)",
              fontSize: 14,
              fontFamily: "var(--font-b)",
            }}
          />
          <button onClick={onClose} style={{ color: "var(--ink-muted)", display: "flex" }}>
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 320, overflowY: "auto", padding: "8px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                color: "var(--ink-muted)",
                fontSize: 13,
              }}
            >
              No workspaces found
            </div>
          ) : (
            filtered.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws.id)}
                className="w-full text-left"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  color: "var(--ink)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  width: "100%",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--powder-light)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span style={{ color: "var(--ink-muted)", fontSize: 11, minWidth: 80 }}>
                  /{ws.id}
                </span>
                {ws.label}
              </button>
            ))
          )}
        </div>

        <div
          style={{
            padding: "8px 16px",
            borderTop: "1px solid var(--border)",
            fontSize: 11,
            color: "var(--ink-muted)",
            display: "flex",
            gap: 12,
          }}
        >
          <span>↵ navigate</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
