
export const useBatchStatus = () => {
  const calculateBatchStatus = (
    availableTickets: number, 
    startDateTime: Date, 
    endDateTime: Date | null
  ): string => {
    // Verificar se tem ingressos disponíveis
    if (availableTickets <= 0) {
      return 'sold_out';
    }
    
    // Verificar datas
    const now = new Date();
    
    if (now < startDateTime) {
      return 'upcoming';
    } else if (endDateTime && now > endDateTime) {
      return 'ended';
    } else {
      return 'active';
    }
  };

  return { calculateBatchStatus };
};
