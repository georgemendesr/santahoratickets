
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface BatchStatusActionsProps {
  batchId: string;
  onReset: (batchId: string) => void;
  onFixAvailability?: (batchId: string) => void;
  isResetLoading?: string | null;
  isFixingAvailability?: string | null;
  needsFix?: boolean;
}

export const BatchStatusActions = ({
  batchId,
  onReset,
  onFixAvailability,
  isResetLoading,
  isFixingAvailability,
  needsFix = false
}: BatchStatusActionsProps) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onReset(batchId)}
              disabled={isResetLoading === batchId}
              className="h-6 w-6 rounded-full"
            >
              {isResetLoading === batchId ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-blue-500"></span>
              ) : (
                <Check className="h-3 w-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reativar lote</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {needsFix && onFixAvailability && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onFixAvailability(batchId)}
                disabled={isFixingAvailability === batchId}
                className="h-6 text-xs bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                {isFixingAvailability === batchId ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-yellow-500 mr-1"></span>
                ) : null}
                Corrigir
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Corrigir disponibilidade de ingressos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};
