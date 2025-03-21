
import React, { useEffect } from "react";
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
  // Validação de entrada
  if (!startDate) {
    console.error("BatchStatusBadge: startDate não fornecida", { status, isVisible, startDate, endDate });
    return <Badge variant="outline">Status inválido</Badge>;
  }

  // Log para diagnóstico
  console.group("BatchStatusBadge props:");
  console.log("status:", status);
  console.log("isVisible:", isVisible);
  console.log("startDate:", startDate);
  console.log("endDate:", endDate);
  console.log("availableTickets:", availableTickets);
  console.log("totalTickets:", totalTickets);
  console.groupEnd();
  
  // Criar um objeto de lote com as propriedades necessárias para cálculo
  const batchData = {
    id: "badge-component", // ID fictício para logs
    title: "badge-component", // Título fictício para logs
    status: status as string,
    is_visible: isVisible === null ? true : isVisible,
    start_date: startDate,
    end_date: endDate,
    available_tickets: availableTickets ?? 0,
    total_tickets: totalTickets ?? 0,
    // Campos obrigatórios na interface mas não usados para o cálculo
    event_id: "",
    price: 0,
    order_number: 0,
    visibility: "public" as const,
    min_purchase: 1
  };
  
  // Usar a função de cálculo de status
  const currentStatus = computeBatchStatus(batchData as any);
  console.log("Status calculado no badge:", currentStatus);
  
  // Efeito para logar sempre que o status calculado mudar
  useEffect(() => {
    console.log("UseEffect: Status recalculado no badge:", {
      propsStatus: status,
      calculatedStatus: currentStatus,
      isVisible,
      availableTickets,
      startDate,
      endDate
    });
  }, [currentStatus, status, isVisible, availableTickets, startDate, endDate]);
  
  // Map status to badge variant and label
  const getBadgeProps = (status: BatchStatus) => {
    switch (status) {
      case "active":
        return { 
          variant: "default" as const, 
          label: "Ativo" 
        };
      case "upcoming":
        return { 
          variant: "outline" as const, 
          label: "Futuro" 
        };
      case "ended":
        return { 
          variant: "secondary" as const, 
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
    try {
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: pt });
    } catch (e) {
      console.error("Erro ao formatar data:", e, date);
      return "Data inválida";
    }
  };
  
  const tooltipContent = () => {
    if (!showDetails) return null;
    
    let start;
    try {
      start = new Date(startDate);
      if (isNaN(start.getTime())) {
        console.error("Data de início inválida:", startDate);
        start = new Date();
      }
    } catch (e) {
      console.error("Erro ao converter data de início:", e);
      start = new Date();
    }
    
    let end = null;
    if (endDate) {
      try {
        end = new Date(endDate);
        if (isNaN(end.getTime())) {
          console.error("Data de término inválida:", endDate);
          end = null;
        }
      } catch (e) {
        console.error("Erro ao converter data de término:", e);
        end = null;
      }
    }
    
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
