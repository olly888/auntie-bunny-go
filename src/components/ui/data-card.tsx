import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export function DataCard({ title, value, unit, className }: DataCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-xl p-4 text-center shadow-card",
      className
    )}>
      <div className="text-2xl font-bold text-card-foreground mb-1">
        {value}
        {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}