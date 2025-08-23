import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimePeriod } from "@/hooks/useIncomeData";

interface TimeFilterProps {
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function TimeFilter({ period, onPeriodChange, selectedDate, onDateChange }: TimeFilterProps) {
  const periodLabels = {
    day: '日',
    month: '月',
    year: '年'
  };

  const formatDate = (date: Date, period: TimePeriod) => {
    switch (period) {
      case 'day':
        return format(date, 'yyyy年MM月dd日');
      case 'month':
        return format(date, 'yyyy年MM月');
      case 'year':
        return format(date, 'yyyy年');
    }
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Period Selector */}
      <div className="flex bg-card border border-border rounded-lg p-1">
        {Object.entries(periodLabels).map(([key, label]) => (
          <Button
            key={key}
            variant={period === key ? "default" : "ghost"}
            size="sm"
            onClick={() => onPeriodChange(key as TimePeriod)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              period === key 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 justify-between bg-card border-border"
          >
            <span className="text-foreground">
              {formatDate(selectedDate, period)}
            </span>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}