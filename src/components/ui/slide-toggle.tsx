import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SlideToggleProps {
  isOn: boolean;
  onToggle: (newState: boolean) => void;
  onText?: string;
  offText?: string;
  className?: string;
  disabled?: boolean;
}

export function SlideToggle({
  isOn,
  onToggle,
  onText = "上线接单",
  offText = "下线休息", 
  className,
  disabled = false
}: SlideToggleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleStart = useCallback((clientX: number) => {
    if (disabled) return;
    setIsDragging(true);
    setDragOffset(0);
  }, [disabled]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const thumbWidth = 40; // 滑块宽度
    const maxOffset = containerWidth - thumbWidth - 8; // 减去padding

    let offset = clientX - rect.left - thumbWidth / 2;
    offset = Math.max(0, Math.min(offset, maxOffset));
    
    setDragOffset(offset);
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const thumbWidth = 40;
    const maxOffset = containerWidth - thumbWidth - 8;
    const threshold = maxOffset * 0.6; // 60% 阈值

    const shouldToggle = isOn ? dragOffset < threshold : dragOffset > threshold;

    if (shouldToggle) {
      onToggle(!isOn);
      toast({
        description: !isOn ? "✅ 已上线，准备接单" : "⏸️ 已下线，暂停接单",
        duration: 2000,
      });
    }

    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, isOn, onToggle, toast]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(!isOn);
      toast({
        description: !isOn ? "✅ 已上线，准备接单" : "⏸️ 已下线，暂停接单",
        duration: 2000,
      });
    }
  };

  const thumbPosition = isDragging ? dragOffset : isOn ? 'calc(100% - 48px)' : '4px';

  return (
    <div 
      className={cn(
        "relative w-full h-16 rounded-full border-2 transition-all ease-smooth duration-300 cursor-pointer select-none overflow-hidden",
        isOn 
          ? "bg-success border-success shadow-button" 
          : "bg-muted border-muted-foreground/30",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={isDragging ? handleTouchMove : undefined}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="switch"
      aria-checked={isOn}
      aria-label={isOn ? "当前已上线，滑动下线" : "当前已下线，滑动上线"}
    >
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "font-semibold text-sm transition-all ease-smooth duration-300",
          isOn ? "text-success-foreground" : "text-muted-foreground"
        )}>
          滑动 {isOn ? offText : onText}
        </span>
      </div>

      {/* Sliding thumb */}
      <div
        className={cn(
          "absolute top-1 w-10 h-10 rounded-full transition-all ease-smooth duration-300 flex items-center justify-center shadow-lg",
          isOn 
            ? "bg-success-foreground text-success" 
            : "bg-card text-muted-foreground",
          isDragging && "transition-none"
        )}
        style={{
          left: thumbPosition,
          transform: isDragging ? 'none' : undefined
        }}
      >
        {isOn ? "🟢" : "⚪"}
      </div>

      {/* Ripple effect on drag */}
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 animate-pulse rounded-full" />
      )}
    </div>
  );
}