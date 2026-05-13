"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Modal({ open, onClose, children, title, className }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,15,26,0.5)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn("glass-card", className)}
        style={{ width: "100%", maxWidth: 520, position: "relative" }}
      >
        {title && (
          <div
            className="flex items-center justify-between"
            style={{
              marginBottom: 16,
              paddingBottom: 14,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink-muted)",
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 28,
              height: 28,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink-muted)",
              background: "var(--surface-alt)",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
