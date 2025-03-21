
// Tipos compartilhados entre os hooks de lote
export interface BatchFormData {
  title: string;
  price: string;
  totalTickets: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  visibility: string;
  isVisible: boolean;
  description: string;
  minPurchase: string;
  maxPurchase: string;
  batchGroup: string;
  status?: string;
}

export interface UseBatchFormProps {
  eventId: string;
  orderNumber: number;
  batchId?: string | null;
  onSuccess: () => void;
}
