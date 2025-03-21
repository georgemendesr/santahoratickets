
import { computeBatchStatus } from "@/utils/batchStatusUtils";

export const useBatchStatus = () => {
  const calculateBatchStatus = (
    availableTickets: number, 
    startDateTime: Date, 
    endDateTime: Date | null
  ): string => {
    // Criar um objeto com as propriedades necessárias
    const batchData = {
      is_visible: true,
      available_tickets: availableTickets,
      start_date: startDateTime.toISOString(),
      end_date: endDateTime ? endDateTime.toISOString() : null
    };
    
    // Usar a função de utilidade
    return computeBatchStatus(batchData as any);
  };

  return { calculateBatchStatus };
};
