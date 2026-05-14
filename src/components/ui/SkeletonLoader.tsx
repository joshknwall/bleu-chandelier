"use client";

interface SkeletonLoaderProps {
  variant?: "card" | "row";
  count?: number;
}

function SkeletonCard() {
  return (
    <div
      className="glass-card"
      style={{
        padding: 20,
        animation: "pulse 1.4s ease-in-out infinite",
      }}
    >
      <div
        style={{
          height: 14,
          width: "60%",
          borderRadius: 6,
          background: "var(--border)",
          marginBottom: 12,
        }}
      />
      <div
        style={{
          height: 11,
          width: "85%",
          borderRadius: 6,
          background: "var(--border)",
          marginBottom: 8,
        }}
      />
      <div
        style={{
          height: 11,
          width: "45%",
          borderRadius: 6,
          background: "var(--border)",
          marginBottom: 16,
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            height: 22,
            width: 60,
            borderRadius: 999,
            background: "var(--border)",
          }}
        />
        <div
          style={{
            height: 22,
            width: 80,
            borderRadius: 999,
            background: "var(--border)",
          }}
        />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 0",
        borderBottom: "1px solid var(--border)",
        animation: "pulse 1.4s ease-in-out infinite",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--border)",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 13,
            width: "40%",
            borderRadius: 6,
            background: "var(--border)",
            marginBottom: 6,
          }}
        />
        <div
          style={{
            height: 11,
            width: "60%",
            borderRadius: 6,
            background: "var(--border)",
          }}
        />
      </div>
      <div
        style={{
          height: 22,
          width: 70,
          borderRadius: 999,
          background: "var(--border)",
        }}
      />
    </div>
  );
}

export default function SkeletonLoader({
  variant = "card",
  count = 4,
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count });

  if (variant === "row") {
    return (
      <div>
        {items.map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20,
      }}
    >
      {items.map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
