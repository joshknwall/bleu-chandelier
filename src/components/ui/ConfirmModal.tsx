"use client";

import Modal from "./Modal";
import Button from "./Button";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  icon?: string;
  variant?: "default" | "danger";
  confirmLabel?: string;
  cancelLabel?: string;
  consequences?: string;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  icon = "⚠️",
  variant = "default",
  confirmLabel,
  cancelLabel = "Cancel",
  consequences,
  loading = false,
}: ConfirmModalProps) {
  const isDanger = variant === "danger";

  return (
    <Modal open={open} onClose={onClose} className="confirm-modal">
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--ink)",
            margin: "0 0 8px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--ink-soft)",
            lineHeight: 1.6,
            margin: "0 0 16px",
          }}
        >
          {message}
        </p>

        {consequences && (
          <div
            style={{
              background: isDanger ? "var(--red-soft)" : "var(--amber-soft)",
              borderRadius: "var(--r)",
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 12,
              color: isDanger ? "var(--red-text)" : "var(--amber-text)",
              lineHeight: 1.5,
              textAlign: "left",
            }}
          >
            {consequences}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <Button
            variant="secondary"
            onClick={onClose}
            style={{ flex: 1, padding: "11px 0" }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "11px 0",
              ...(isDanger
                ? { background: "var(--red)", color: "#fff" }
                : {}),
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Processing..."
              : confirmLabel ?? (isDanger ? "Delete" : "Confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
