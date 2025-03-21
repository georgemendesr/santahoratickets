
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
  // Validação de entrada para evitar problemas com dados inválidos
  if (!batch) {
    console.error("Batch inválido passado para computeBatchStatus:", batch);
    return 'active'; // Fallback seguro
  }

  // Log detalhado para diagnóstico
  console.group(`Computando status para lote ${batch.id} (${batch.title})`);
  console.log("Propriedades do lote:", {
    isVisible: batch.is_visible,
    availableTickets: batch.available_tickets,
    totalTickets: batch.total_tickets,
    startDate: batch.start_date,
    endDate: batch.end_date,
    now: now.toISOString(),
    currentStatus: batch.status
  });

  // Se o lote não estiver visível, retornar hidden
  if (batch.is_visible === false) {
    console.log("Lote está definido como NÃO visível (is_visible: false). Status calculado: hidden");
    console.groupEnd();
    return 'hidden';
  }
  
  // Validação e obtenção segura de valores
  let availableTickets: number;
  
  // Verificar se available_tickets é um número válido
  if (batch.available_tickets === null || batch.available_tickets === undefined) {
    console.warn("available_tickets é null ou undefined, usando 0 como fallback");
    availableTickets = 0;
  } else if (isNaN(Number(batch.available_tickets))) {
    console.warn(`available_tickets não é um número válido: ${batch.available_tickets}, usando 0 como fallback`);
    availableTickets = 0;
  } else {
    availableTickets = Number(batch.available_tickets);
  }
  
  // Verificar se a data de início é válida
  let startDate;
  try {
    startDate = new Date(batch.start_date);
    if (isNaN(startDate.getTime())) {
      console.error("Data de início inválida:", batch.start_date);
      startDate = new Date(0); // Usar uma data no passado como fallback
    }
  } catch (e) {
    console.error("Erro ao converter data de início:", e);
    startDate = new Date(0);
  }
  
  // Verificar se a data de término é válida (quando presente)
  let endDate = null;
  if (batch.end_date) {
    try {
      endDate = new Date(batch.end_date);
      if (isNaN(endDate.getTime())) {
        console.error("Data de término inválida:", batch.end_date);
        endDate = null;
      }
    } catch (e) {
      console.error("Erro ao converter data de término:", e);
      endDate = null;
    }
  }
  
  // Log de comparação de datas
  console.log("Comparação de datas:", {
    now: now.toISOString(),
    startDate: startDate.toISOString(),
    endDate: endDate?.toISOString(),
    beforeStart: now < startDate,
    afterEnd: endDate ? now > endDate : false
  });
  
  // Verificar datas primeiro (prioridade mais alta)
  if (now < startDate) {
    console.log("Status calculado: upcoming (data atual é anterior à data de início)");
    console.groupEnd();
    return 'upcoming';
  }
  
  if (endDate && now > endDate) {
    console.log("Status calculado: ended (data atual é posterior à data de término)");
    console.groupEnd();
    return 'ended';
  }
  
  // Verificar disponibilidade (apenas se estiver dentro do período de vendas)
  if (availableTickets <= 0) {
    console.log("Status calculado: sold_out (available_tickets <= 0)");
    console.groupEnd();
    return 'sold_out';
  }
  
  // Se passou por todas as verificações, está ativo
  console.log("Status calculado: active (todas as condições atendidas)");
  console.groupEnd();
  return 'active';
}

/**
 * Função para adicionar informações de debug a um lote
 */
export function getBatchDebugInfo(batch: Batch): any {
  if (!batch) {
    console.error("Batch inválido passado para getBatchDebugInfo");
    return { error: "Batch inválido" };
  }

  const now = new Date();
  
  // Verificação segura de datas
  let startDate;
  try {
    startDate = new Date(batch.start_date);
    if (isNaN(startDate.getTime())) {
      console.error("Data de início inválida:", batch.start_date);
      startDate = new Date(0);
    }
  } catch (e) {
    console.error("Erro ao converter data de início:", e);
    startDate = new Date(0);
  }
  
  let endDate = null;
  if (batch.end_date) {
    try {
      endDate = new Date(batch.end_date);
      if (isNaN(endDate.getTime())) {
        console.error("Data de término inválida:", batch.end_date);
        endDate = null;
      }
    } catch (e) {
      console.error("Erro ao converter data de término:", e);
      endDate = null;
    }
  }
  
  // Validação e obtenção segura de valores
  let availableTickets: number;
  
  // Verificar se available_tickets é um número válido
  if (batch.available_tickets === null || batch.available_tickets === undefined) {
    console.warn("available_tickets é null ou undefined, usando 0 como fallback");
    availableTickets = 0;
  } else if (isNaN(Number(batch.available_tickets))) {
    console.warn(`available_tickets não é um número válido: ${batch.available_tickets}, usando 0 como fallback`);
    availableTickets = 0;
  } else {
    availableTickets = Number(batch.available_tickets);
  }
  
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
    totalTickets: batch.total_tickets || 0,
    availableTickets: availableTickets,
    soldTickets: (batch.total_tickets || 0) - availableTickets,
    status: batch.status,
    computedStatus: computeBatchStatus(batch, now),
    rawBatch: batch
  };
}
