"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

type ToastVariant = "default" | "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast: (
    message: string,
    opts?: {
      variant?: ToastVariant;
      action?: { label: string; onClick: () => void };
      duration?: number;
    }
  ) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; icon: string }
> = {
  default: { bg: "var(--navy)", icon: "" },
  success: { bg: "var(--green)", icon: "\u2713" },
  error: { bg: "var(--red)", icon: "\u2715" },
  info: { bg: "var(--blue)", icon: "\u2139" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (
      message: string,
      opts?: {
        variant?: ToastVariant;
        action?: { label: string; onClick: () => void };
        duration?: number;
      }
    ) => {
      const id = ++nextId;
      const item: ToastItem = {
        id,
        message,
        variant: opts?.variant ?? "default",
        action: opts?.action,
      };
      setToasts((prev) => [...prev, item]);
      const dur = opts?.duration ?? 3000;
      if (dur > 0) {
        const timer = setTimeout(() => dismiss(id), dur);
        timersRef.current.set(id, timer);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 8,
          pointerEvents: "none",
        }}
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const v = VARIANT_STYLES[t.variant];
          return (
            <div
              key={t.id}
              style={{
                background: v.bg,
                color: "#fff",
                padding: "11px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                boxShadow: "var(--sh-lg)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                whiteSpace: "nowrap",
                pointerEvents: "auto",
                animation: "fadeIn 0.2s ease",
              }}
            >
              {v.icon && (
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    flexShrink: 0,
                  }}
                >
                  {v.icon}
                </span>
              )}
              <span>{t.message}</span>
              {t.action && (
                <button
                  onClick={() => {
                    t.action!.onClick();
                    dismiss(t.id);
                  }}
                  style={{
                    marginLeft: 4,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t.action.label}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
