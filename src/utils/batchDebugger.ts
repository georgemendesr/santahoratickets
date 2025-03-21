
import { supabase } from "@/integrations/supabase/client";
import { getBatchDebugInfo } from "./batchStatusUtils";
import { Batch } from "@/types/event.types";

// Update the type to accept string for status
type BatchWithStringStatus = Omit<Batch, 'status'> & { 
  status: string 
};

// Ferramenta de diagnóstico para executar no console do navegador
window.diagnoseBatches = async (eventId: string) => {
  console.log(`🔍 Diagnóstico de lotes para o evento: ${eventId}`);
  
  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('event_id', eventId)
      .order('order_number', { ascending: true });
      
    if (error) {
      console.error('❌ Erro ao buscar lotes:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('ℹ️ Nenhum lote encontrado para este evento.');
      return;
    }
    
    console.log(`✅ Encontrados ${data.length} lotes`);
    
    // Verificar cada lote
    data.forEach(batch => {
      // Cast batch as BatchWithStringStatus to handle the status field
      const batchWithProperType = batch as unknown as BatchWithStringStatus;
      const debugInfo = getBatchDebugInfo(batchWithProperType as any);
      
      console.group(`🎫 Lote: ${batch.title} (${batch.id})`);
      console.log('Status calculado:', debugInfo.computedStatus);
      console.log('Status na DB:', batch.status || 'não definido');
      console.log('Ingressos:', `${batch.available_tickets}/${batch.total_tickets}`);
      console.log('Visível:', batch.is_visible ? 'Sim' : 'Não');
      console.log('Período:', `${new Date(batch.start_date).toLocaleString()} - ${batch.end_date ? new Date(batch.end_date).toLocaleString() : 'indefinido'}`);
      console.log('Informações completas:', debugInfo);
      console.groupEnd();
    });
    
    console.log('📊 Diagnóstico concluído. Para corrigir problemas de status, execute a função fixBatchStatus()');
    
  } catch (err) {
    console.error('❌ Erro durante o diagnóstico:', err);
  }
};

// Função para corrigir status de lotes
window.fixBatchStatus = async (batchId: string) => {
  try {
    // Primeiro buscar o lote
    const { data: batch, error: fetchError } = await supabase
      .from('batches')
      .select('*')
      .eq('id', batchId)
      .single();
      
    if (fetchError || !batch) {
      console.error('❌ Erro ao buscar o lote:', fetchError);
      return;
    }
    
    // Cast batch as BatchWithStringStatus to handle the status field
    const batchWithProperType = batch as unknown as BatchWithStringStatus;
    const debugInfo = getBatchDebugInfo(batchWithProperType as any);
    const correctStatus = debugInfo.computedStatus;
    
    console.log(`🔧 Corrigindo lote ${batch.title}`);
    console.log(`Status atual: ${batch.status}, Status correto: ${correctStatus}`);
    
    // Atualizar o status
    const { error: updateError } = await supabase
      .from('batches')
      .update({ status: correctStatus })
      .eq('id', batchId);
      
    if (updateError) {
      console.error('❌ Erro ao atualizar status:', updateError);
      return;
    }
    
    console.log(`✅ Status atualizado com sucesso para: ${correctStatus}`);
    
  } catch (err) {
    console.error('❌ Erro ao corrigir status:', err);
  }
};

// Corrigir todos os lotes de um evento
window.fixAllBatchesForEvent = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('event_id', eventId);
      
    if (error) {
      console.error('❌ Erro ao buscar lotes:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('ℹ️ Nenhum lote encontrado para este evento.');
      return;
    }
    
    console.log(`🔧 Corrigindo ${data.length} lotes...`);
    
    let correctedCount = 0;
    
    for (const batch of data) {
      // Cast batch as BatchWithStringStatus to handle the status field
      const batchWithProperType = batch as unknown as BatchWithStringStatus;
      const debugInfo = getBatchDebugInfo(batchWithProperType as any);
      const correctStatus = debugInfo.computedStatus;
      
      if (batch.status !== correctStatus) {
        console.log(`Lote ${batch.title}: ${batch.status} -> ${correctStatus}`);
        
        const { error: updateError } = await supabase
          .from('batches')
          .update({ status: correctStatus })
          .eq('id', batch.id);
          
        if (updateError) {
          console.error(`Erro ao atualizar lote ${batch.id}:`, updateError);
        } else {
          correctedCount++;
        }
      }
    }
    
    console.log(`✅ Concluído! ${correctedCount} lotes corrigidos.`);
    
  } catch (err) {
    console.error('❌ Erro ao corrigir lotes:', err);
  }
};

// Adicionar função para forçar available_tickets = total_tickets
window.fixAvailableTickets = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .eq('event_id', eventId);
      
    if (error) {
      console.error('❌ Erro ao buscar lotes:', error);
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('ℹ️ Nenhum lote encontrado para este evento.');
      return;
    }
    
    console.log(`🔧 Corrigindo available_tickets para ${data.length} lotes...`);
    
    let correctedCount = 0;
    
    for (const batch of data) {
      console.log(`Lote ${batch.title}: available_tickets=${batch.available_tickets}, total_tickets=${batch.total_tickets}`);
      
      const { error: updateError } = await supabase
        .from('batches')
        .update({ 
          available_tickets: batch.total_tickets,
          status: 'active' 
        })
        .eq('id', batch.id);
        
      if (updateError) {
        console.error(`Erro ao atualizar lote ${batch.id}:`, updateError);
      } else {
        correctedCount++;
      }
    }
    
    console.log(`✅ Concluído! Disponibilidade de ingressos corrigida para ${correctedCount} lotes.`);
    
  } catch (err) {
    console.error('❌ Erro ao corrigir available_tickets:', err);
  }
};

// Mensagem para instruir o desenvolvedor
console.log(`
🔧 Ferramentas de diagnóstico de lotes disponíveis no console:
- window.diagnoseBatches("event-id") - Diagnosticar todos os lotes de um evento
- window.fixBatchStatus("batch-id") - Corrigir o status de um lote específico
- window.fixAllBatchesForEvent("event-id") - Corrigir todos os lotes de um evento
- window.fixAvailableTickets("event-id") - Forçar available_tickets = total_tickets para todos os lotes de um evento
`);

export {};
