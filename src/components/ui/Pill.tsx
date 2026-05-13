import { cn } from "@/lib/utils";

type PillVariant = "green" | "blue" | "amber" | "red" | "gray";

interface PillProps {
  variant?: PillVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Pill({ variant = "gray", children, className }: PillProps) {
  return (
    <span className={cn("pill", `pill-${variant}`, className)}>
      {children}
    </span>
  );
}
