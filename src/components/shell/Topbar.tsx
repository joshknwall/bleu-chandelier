"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import SearchOverlay from "./SearchOverlay";

export default function Topbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Cmd+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = isDark ? "bleu" : "bleu-dark";
    html.setAttribute("data-theme", next);
    setIsDark(!isDark);
  };

  return (
    <>
      <header
        style={{
          height: "var(--topbar-h)",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(18px)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 20px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* Hamburger — mobile only */}
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          title="Toggle menu"
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Search trigger */}
        <button
          className="topbar-search"
          onClick={openSearch}
          style={{
            flex: 1,
            maxWidth: 320,
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 34,
            padding: "0 12px",
            borderRadius: 10,
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            color: "var(--ink-muted)",
            fontSize: 13,
            cursor: "text",
            textAlign: "left",
          }}
        >
          <Search size={14} />
          <span style={{ flex: 1 }}>Search workspaces…</span>
          <kbd
            className="topbar-kbd"
            style={{
              fontSize: 11,
              padding: "2px 6px",
              borderRadius: 6,
              background: "var(--border)",
              color: "var(--ink-soft)",
              fontFamily: "monospace",
            }}
          >
            ⌘K
          </kbd>
        </button>

        <div style={{ flex: 1 }} />

        {/* Notification bell */}
        <button
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--ink-soft)",
            cursor: "pointer",
          }}
          title="Notifications"
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--gold)",
              border: "2px solid var(--surface)",
              fontSize: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--ink-soft)",
            cursor: "pointer",
          }}
          title={isDark ? "Switch to light" : "Switch to dark"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="topbar-user-info" style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.2,
              }}
            >
              Topaz Curtis
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>
              Lead Planner
            </div>
          </div>
          <img
            src="/topaz-curtis.jpg"
            alt="Topaz Curtis"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid var(--border)",
            }}
          />
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
