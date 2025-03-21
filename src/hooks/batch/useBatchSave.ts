
import { supabase } from "@/integrations/supabase/client";
import { BatchFormData } from "./types";
import { useBatchStatus } from "./useBatchStatus";

export const useBatchSave = () => {
  const { calculateBatchStatus } = useBatchStatus();

  const prepareBatchData = async (
    formData: BatchFormData, 
    eventId: string, 
    orderNumber: number | undefined,
    batchId: string | null | undefined
  ) => {
    // Se estiver editando, precisamos primeiro obter os dados atuais do lote
    let soldTickets = 0;
    if (batchId) {
      console.log("Buscando dados atuais do lote para atualização");
      const { data: currentBatch, error: fetchError } = await supabase
        .from('batches')
        .select('total_tickets, available_tickets')
        .eq('id', batchId)
        .single();
        
      if (fetchError) {
        console.error("Erro ao buscar dados atuais do lote:", fetchError);
        throw fetchError;
      }
      
      if (currentBatch) {
        // Calcular quantos ingressos foram vendidos
        soldTickets = currentBatch.total_tickets - currentBatch.available_tickets;
        console.log(`Lote tem ${soldTickets} ingressos vendidos de ${currentBatch.total_tickets} total`);
      }
    }

    const newTotalTickets = parseInt(formData.totalTickets);
    
    // Calcular tickets disponíveis
    // Para novos lotes: igual ao total
    // Para edição: total menos vendidos
    const availableTickets = batchId 
      ? Math.max(0, newTotalTickets - soldTickets)
      : newTotalTickets;

    console.log("Novos valores calculados:", {
      newTotalTickets,
      availableTickets,
      soldTickets
    });

    // Determinar status baseado nos tickets disponíveis e data
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00Z`);
    const endDateTime = formData.endDate 
      ? new Date(`${formData.endDate}T${formData.endTime || "23:59"}:00Z`) 
      : null;
    
    // Verificar primeiro se há ingressos disponíveis
    let status;
    if (availableTickets <= 0) {
      status = 'sold_out';
      console.log("Status determinado: sold_out (sem ingressos disponíveis)");
    } else {
      // Se tiver ingressos, usar a lógica normal baseada em datas
      status = calculateBatchStatus(availableTickets, startDateTime, endDateTime);
      console.log("Status calculado para o lote:", status);
    }

    const batchData = {
      title: formData.title,
      price: parseFloat(formData.price),
      total_tickets: newTotalTickets,
      available_tickets: availableTickets,
      start_date: `${formData.startDate}T${formData.startTime}:00Z`,
      end_date: formData.endDate ? `${formData.endDate}T${formData.endTime || "23:59"}:00Z` : null,
      visibility: formData.visibility,
      is_visible: formData.isVisible,
      description: formData.description || null,
      min_purchase: parseInt(formData.minPurchase),
      max_purchase: formData.maxPurchase ? parseInt(formData.maxPurchase) : null,
      batch_group: formData.batchGroup || null,
      event_id: eventId,
      order_number: batchId ? undefined : orderNumber, // Não atualiza order_number na edição
      status: status
    };

    console.log(batchId ? "Atualizando lote:" : "Enviando dados do lote:", batchData);
    return batchData;
  };

  const saveBatch = async (
    batchData: any,
    batchId: string | null | undefined
  ) => {
    let operation;
    if (batchId) {
      // Atualizando lote existente
      operation = supabase
        .from('batches')
        .update(batchData)
        .eq('id', batchId)
        .select();
    } else {
      // Criando novo lote
      operation = supabase
        .from('batches')
        .insert([batchData])
        .select();
    }

    const { data, error } = await operation;

    if (error) {
      console.error('Erro ao salvar lote:', error);
      throw new Error(`Erro ao salvar lote: ${error.message}`);
    }

    console.log("Lote salvo com sucesso:", data);
    return data;
  };

  return {
    prepareBatchData,
    saveBatch
  };
};
