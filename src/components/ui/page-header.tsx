import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => {
  return (
    <div className={cn("pt-safe-top pb-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="ml-4 pr-safe-right">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};