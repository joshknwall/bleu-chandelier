"use client";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "gold" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)",
    color: "#f8fbff",
    border: "1px solid rgba(189,212,228,0.15)",
  },
  secondary: {
    background: "var(--surface)",
    color: "var(--ink)",
    border: "1px solid var(--border)",
    boxShadow: "0 1px 4px rgba(18,31,49,0.06)",
  },
  gold: {
    background: "linear-gradient(135deg, #b7955b 0%, #d4b07a 100%)",
    color: "#fff",
    border: "1px solid rgba(183,149,91,0.3)",
  },
  danger: {
    background: "var(--red-soft)",
    color: "var(--red-text)",
    border: "1px solid rgba(239,68,68,0.2)",
  },
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: 30, padding: "0 12px", fontSize: 12, borderRadius: 8 },
  md: { height: 38, padding: "0 18px", fontSize: 13, borderRadius: 10 },
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity 0.15s",
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.85";
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
        onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
}
