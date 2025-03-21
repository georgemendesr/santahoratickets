
import { computeBatchStatus } from "@/utils/batchStatusUtils";

export const useBatchStatus = () => {
  const calculateBatchStatus = (
    availableTickets: number, 
    startDateTime: Date, 
    endDateTime: Date | null
  ): string => {
    // Log para diagnóstico
    console.log("calculateBatchStatus params:", { 
      availableTickets, 
      startDateTime: startDateTime?.toISOString(), 
      endDateTime: endDateTime?.toISOString() 
    });
    
    // Validação de entrada
    if (isNaN(availableTickets) || availableTickets < 0) {
      console.error("Available tickets inválido:", availableTickets);
      availableTickets = 0;
    }
    
    if (!startDateTime || isNaN(startDateTime.getTime())) {
      console.error("Data de início inválida:", startDateTime);
      startDateTime = new Date();
    }
    
    // Criar um objeto com as propriedades necessárias
    const batchData = {
      id: "temp-batch", // ID temporário para logs
      title: "temp-batch", // Título temporário para logs
      event_id: "temp-event", // ID de evento temporário
      price: 0,
      order_number: 0,
      visibility: "public" as const,
      min_purchase: 1,
      is_visible: true,
      available_tickets: availableTickets,
      total_tickets: availableTickets, // Considerando que estamos criando um novo lote
      start_date: startDateTime.toISOString(),
      end_date: endDateTime ? endDateTime.toISOString() : null
    };
    
    // Usar a função de utilidade
    const status = computeBatchStatus(batchData as any);
    console.log("Status calculado:", status);
    return status;
  };

  return { calculateBatchStatus };
};
