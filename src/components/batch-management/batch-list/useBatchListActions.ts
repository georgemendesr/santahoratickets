
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Batch } from "@/types/event.types";

export const useBatchListActions = (refetch: () => void) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState<string | null>(null);
  const [isFixingAvailability, setIsFixingAvailability] = useState<string | null>(null);

  const hasInconsistentTickets = (batch: Batch) => {
    return batch.available_tickets <= 0 && batch.status !== 'sold_out';
  };

  const handleDeleteBatch = async (batch: Batch) => {
    if (!confirm("Tem certeza que deseja excluir este lote? Esta ação não pode ser desfeita.")) {
      return;
    }

    setIsDeleting(batch.id);
    
    try {
      const { error } = await supabase
        .from('batches')
        .delete()
        .eq('id', batch.id);
        
      if (error) throw error;
      
      refetch();
      toast.success("Lote excluído com sucesso");
    } catch (error) {
      console.error('Erro ao excluir lote:', error);
      toast.error('Não foi possível excluir o lote.');
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleBatchVisibility = async (batch: Batch) => {
    setIsToggling(batch.id);
    
    try {
      const newVisibility = !batch.is_visible;
      
      const { error } = await supabase
        .from('batches')
        .update({ is_visible: newVisibility })
        .eq('id', batch.id);
        
      if (error) throw error;
      
      refetch();
      toast.success(`Lote ${newVisibility ? 'ativado' : 'desativado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar visibilidade do lote:', error);
      toast.error('Não foi possível alterar a visibilidade do lote.');
    } finally {
      setIsToggling(null);
    }
  };

  const resetBatchStatus = async (batch: Batch) => {
    if (!confirm(`Tem certeza que deseja reativar este lote? Isto irá definir o status como 'ativo' novamente.`)) {
      return;
    }
    
    setIsResetting(batch.id);
    
    try {
      // Garantir que o status seja 'active'
      const { error } = await supabase
        .from('batches')
        .update({ 
          status: 'active'
        })
        .eq('id', batch.id);
        
      if (error) throw error;
      
      refetch();
      toast.success("Lote reativado com sucesso");
    } catch (error) {
      console.error('Erro ao reativar lote:', error);
      toast.error('Não foi possível reativar o lote.');
    } finally {
      setIsResetting(null);
    }
  };

  const fixAvailableTickets = async (batch: Batch) => {
    if (!confirm(`Tem certeza que deseja corrigir a disponibilidade de ingressos deste lote? Isso vai definir os ingressos disponíveis para o mesmo valor do total de ingressos.`)) {
      return;
    }
    
    setIsFixingAvailability(batch.id);
    
    try {
      // Corrigir available_tickets para ser igual ao total_tickets
      const { error } = await supabase
        .from('batches')
        .update({ 
          available_tickets: batch.total_tickets,
          status: 'active'
        })
        .eq('id', batch.id);
        
      if (error) throw error;
      
      refetch();
      toast.success("Disponibilidade de ingressos corrigida com sucesso");
    } catch (error) {
      console.error('Erro ao corrigir disponibilidade:', error);
      toast.error('Não foi possível corrigir a disponibilidade de ingressos.');
    } finally {
      setIsFixingAvailability(null);
    }
  };

  const duplicateBatch = async (batch: Batch) => {
    setIsDuplicating(batch.id);
    
    try {
      const { data: maxOrderData, error: maxOrderError } = await supabase
        .from('batches')
        .select('order_number')
        .eq('event_id', batch.event_id)
        .order('order_number', { ascending: false })
        .limit(1);
        
      if (maxOrderError) throw maxOrderError;
      
      const nextOrderNumber = maxOrderData && maxOrderData.length > 0 
        ? maxOrderData[0].order_number + 1 
        : 1;
      
      const newBatch = {
        ...batch,
        id: undefined,
        title: `${batch.title} (Cópia)`,
        order_number: nextOrderNumber,
        created_at: undefined,
        updated_at: undefined
      };
      
      const { error: insertError } = await supabase
        .from('batches')
        .insert([newBatch]);
        
      if (insertError) throw insertError;
      
      refetch();
      toast.success("Lote duplicado com sucesso");
    } catch (error) {
      console.error('Erro ao duplicar lote:', error);
      toast.error('Não foi possível duplicar o lote.');
    } finally {
      setIsDuplicating(null);
    }
  };

  return {
    isDeleting,
    isToggling,
    isDuplicating,
    isResetting,
    isFixingAvailability,
    hasInconsistentTickets,
    handleDeleteBatch,
    toggleBatchVisibility,
    resetBatchStatus,
    fixAvailableTickets,
    duplicateBatch
  };
};
