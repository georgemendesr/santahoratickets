
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface BatchStatusBadgeProps {
  status: string | null;
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
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  // Determine actual status
  const getStatus = () => {
    // Se não está visível, status é "hidden"
    if (!isVisible) return "hidden";
    
    // Verificar datas (prioridade alta)
    if (start > now) return "upcoming";
    if (end && end < now) return "ended";
    
    // Verificar ingressos disponíveis
    if (availableTickets !== undefined && totalTickets !== undefined) {
      if (availableTickets <= 0) return "sold_out";
    } else if (status === "sold_out") {
      return "sold_out";
    }
    
    // Se tudo estiver ok, está ativo
    return "active";
  };
  
  const currentStatus = getStatus();
  
  // Map status to badge variant and label
  const getBadgeProps = () => {
    switch (currentStatus) {
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
  
  const { variant, label } = getBadgeProps();
  
  // Format dates for tooltip
  const formatDateLocale = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: pt });
  };
  
  const tooltipContent = () => {
    if (!showDetails) return null;
    
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
