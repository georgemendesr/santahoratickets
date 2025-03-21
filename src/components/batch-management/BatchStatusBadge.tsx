
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { computeBatchStatus, BatchStatus } from "@/utils/batchStatusUtils";

interface BatchStatusBadgeProps {
  status?: string | null;
  isVisible?: boolean | null;
  startDate: string;
  endDate?: string | null;
  showDetails?: boolean;
  availableTickets?: number;
  totalTickets?: number;
}

export const BatchStatusBadge = ({
  status,
  isVisible = true,
  startDate,
  endDate,
  showDetails = true,
  availableTickets,
  totalTickets,
}: BatchStatusBadgeProps) => {
  // Criar um objeto de lote com as propriedades necessárias para cálculo
  const batchData = {
    status: status as string,
    is_visible: isVisible,
    start_date: startDate,
    end_date: endDate,
    available_tickets: availableTickets ?? 0,
    total_tickets: totalTickets ?? 0
  };
  
  // Usar a função de cálculo de status
  const currentStatus = computeBatchStatus(batchData as any);
  
  // Map status to badge variant and label
  const getBadgeProps = (status: BatchStatus) => {
    switch (status) {
      case "active":
        return { 
          variant: "active" as const, 
          label: "Ativo" 
        };
      case "upcoming":
        return { 
          variant: "upcoming" as const, 
          label: "Futuro" 
        };
      case "ended":
        return { 
          variant: "ended" as const, 
          label: "Encerrado" 
        };
      case "sold_out":
        return { 
          variant: "destructive" as const, 
          label: "Esgotado" 
        };
      case "hidden":
        return { 
          variant: "secondary" as const, 
          label: "Oculto" 
        };
      default:
        return { 
          variant: "outline" as const, 
          label: status || "Desconhecido" 
        };
    }
  };
  
  const { variant, label } = getBadgeProps(currentStatus);
  
  // Format dates for tooltip
  const formatDateLocale = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: pt });
  };
  
  const tooltipContent = () => {
    if (!showDetails) return null;
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    return (
      <>
        <div className="font-medium mb-1">{label}</div>
        <div className="text-xs">
          <div>Início: {formatDateLocale(start)}</div>
          {end && <div>Término: {formatDateLocale(end)}</div>}
          {availableTickets !== undefined && totalTickets !== undefined && (
            <div>Ingressos: {availableTickets} de {totalTickets} disponíveis</div>
          )}
          {!isVisible && <div className="mt-1 font-medium">Este lote está oculto para os clientes</div>}
        </div>
      </>
    );
  };
  
  // If details not needed, just return the badge
  if (!showDetails) {
    return <Badge variant={variant}>{label}</Badge>;
  }
  
  // Return badge with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Badge variant={variant}>{label}</Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {tooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
