
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends 
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  format?: "percentage" | "fraction";
  max?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
  className, 
  value, 
  indicatorColor,
  size = "md",
  showValue = false,
  format = "percentage",
  max = 100,
  ...props 
}, ref) => {
  const percentage = value != null ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  
  // Size-based classes
  const sizeClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  }
  
  // Default color or custom color
  const bgClass = indicatorColor || "bg-primary"
  
  const displayValue = React.useMemo(() => {
    if (!showValue || value == null) return null;
    
    if (format === "percentage") {
      return `${Math.round(percentage)}%`;
    }
    
    return `${value}/${max}`;
  }, [showValue, value, format, percentage, max]);
  
  return (
    <div className={cn("w-full flex items-center gap-2", className)}>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full bg-secondary",
          sizeClasses[size],
          showValue ? "flex-1" : "w-full"
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full w-full flex-1 transition-all", bgClass)}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
      
      {displayValue && (
        <span className="text-xs font-medium">{displayValue}</span>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
