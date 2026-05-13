import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function Card({ children, className, style }: CardProps) {
  return (
    <div className={cn("glass-card", className)} style={style}>
      {children}
    </div>
  );
}
