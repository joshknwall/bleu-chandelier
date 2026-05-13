import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  change,
  changeLabel,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={cn("glass-card", className)}
      style={{ padding: "20px 24px" }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--ink-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 36,
          fontWeight: 700,
          color: "var(--ink)",
          lineHeight: 1.1,
          marginBottom: change !== undefined ? 8 : 0,
        }}
      >
        {value}
      </div>
      {change !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: isPositive ? "var(--green)" : "var(--red)",
          }}
        >
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>
            {isPositive ? "+" : ""}
            {change}%{changeLabel ? ` ${changeLabel}` : ""}
          </span>
        </div>
      )}
    </div>
  );
}
