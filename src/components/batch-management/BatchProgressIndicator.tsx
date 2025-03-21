
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BatchProgressIndicatorProps {
  available: number;
  total: number;
  showPercentage?: boolean;
  showTooltip?: boolean;
}

export const BatchProgressIndicator = ({
  available,
  total,
  showPercentage = false,
  showTooltip = true,
}: BatchProgressIndicatorProps) => {
  // Calculate values
  const sold = total - available;
  const percentage = total > 0 ? Math.round((sold / total) * 100) : 0;
  
  // Determine color based on percentage sold
  const getIndicatorColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-amber-500";
    if (percentage >= 50) return "bg-blue-500";
    return "bg-emerald-500";
  };
  
  const progressBar = (
    <Progress 
      value={percentage} 
      indicatorColor={getIndicatorColor()}
      size="sm"
      showValue={showPercentage}
      format="percentage"
    />
  );
  
  if (!showTooltip) {
    return progressBar;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            {progressBar}
          </div>
        </TooltipTrigger>
        <TooltipContent variant="info">
          <div className="text-center">
            <div className="font-medium">
              {sold} vendidos de {total} ingressos
            </div>
            <div className="text-xs mt-1">
              {available} disponíveis ({percentage}% vendido)
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
