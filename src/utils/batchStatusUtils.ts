
import { Batch } from "@/types/event.types";

export type BatchStatus = 'active' | 'upcoming' | 'ended' | 'sold_out' | 'hidden';

/**
 * Calcula o status real de um lote com base em suas propriedades
 * @param batch O objeto de lote para calcular o status
 * @returns O status calculado do lote
 */
export function computeBatchStatus(
  batch: Batch, 
  now: Date = new Date()
): BatchStatus {
  // Se o lote não estiver visível, retornar hidden
  if (batch.is_visible === false) {
    return 'hidden';
  }
  
  // Obtenção segura de valores
  const availableTickets = batch.available_tickets ?? 0;
  const startDate = new Date(batch.start_date);
  const endDate = batch.end_date ? new Date(batch.end_date) : null;
  
  // Verificar datas primeiro (prioridade mais alta)
  if (now < startDate) {
    return 'upcoming';
  }
  
  if (endDate && now > endDate) {
    return 'ended';
  }
  
  // Verificar disponibilidade (apenas se estiver dentro do período de vendas)
  if (availableTickets <= 0) {
    return 'sold_out';
  }
  
  // Se passou por todas as verificações, está ativo
  return 'active';
}

/**
 * Função para adicionar informações de debug a um lote
 */
export function getBatchDebugInfo(batch: Batch): any {
  const now = new Date();
  const startDate = new Date(batch.start_date);
  const endDate = batch.end_date ? new Date(batch.end_date) : null;
  
  return {
    id: batch.id,
    title: batch.title,
    isVisible: batch.is_visible,
    now: now.toISOString(),
    startDate: startDate.toISOString(),
    endDate: endDate?.toISOString() || 'indefinido',
    currentTime: now.toLocaleString(),
    beforeStart: now < startDate,
    afterEnd: endDate ? now > endDate : false,
    totalTickets: batch.total_tickets,
    availableTickets: batch.available_tickets,
    soldTickets: batch.total_tickets - batch.available_tickets,
    status: batch.status,
    computedStatus: computeBatchStatus(batch, now)
  };
}
