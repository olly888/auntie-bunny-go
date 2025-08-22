import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "busy" | "offline";
  text: string;
  className?: string;
}

export function StatusIndicator({ status, text, className }: StatusIndicatorProps) {
  const statusColors = {
    online: "bg-success text-success-foreground",
    busy: "bg-destructive text-destructive-foreground", 
    offline: "bg-muted text-muted-foreground"
  };

  return (
    <div className={cn(
      "w-full py-6 px-6 rounded-xl font-semibold text-lg text-center transition-smooth",
      statusColors[status],
      className
    )}>
      <div className="flex items-center justify-center gap-2">
        <div className={cn(
          "w-3 h-3 rounded-full",
          status === "online" && "bg-success-foreground",
          status === "busy" && "bg-destructive-foreground",
          status === "offline" && "bg-muted-foreground"
        )} />
        {text}
      </div>
    </div>
  );
}