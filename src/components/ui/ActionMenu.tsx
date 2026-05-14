"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  dividerBefore?: boolean;
}

interface ActionMenuProps {
  items: ActionItem[];
  className?: string;
}

export default function ActionMenu({ items, className }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div style={{ position: "relative" }} className={className}>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "none",
          background: "transparent",
          color: "var(--ink-soft)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.12s, color 0.12s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--surface-alt)";
          e.currentTarget.style.color = "var(--ink)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--ink-soft)";
        }}
        aria-label="Actions"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 4,
            background: "var(--surface-strong)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r)",
            boxShadow: "var(--sh-lg)",
            zIndex: 200,
            minWidth: 180,
            overflow: "hidden",
            animation: "fadeIn 0.12s ease",
          }}
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.dividerBefore && (
                <div
                  style={{
                    height: 1,
                    background: "var(--border)",
                    margin: "4px 0",
                  }}
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  item.onClick();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: item.danger ? "var(--red)" : "var(--ink)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--surface-alt)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                {item.icon && (
                  <span
                    style={{
                      width: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
