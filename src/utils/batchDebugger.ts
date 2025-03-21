
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

// Função para gerar log detalhado
window.logBatchDetails = async (eventId: string) => {
  try {
    console.log("🔍 INICIANDO LOG DETALHADO DE LOTES");
    console.log("🔍 Evento ID:", eventId);
    
    // Buscar lotes
    const { data: batches, error: batchesError } = await supabase
      .from('batches')
      .select('*')
      .eq('event_id', eventId)
      .order('order_number', { ascending: true });
      
    if (batchesError) {
      console.error("❌ Erro ao buscar lotes:", batchesError);
      return;
    }
    
    if (!batches || batches.length === 0) {
      console.log("ℹ️ Nenhum lote encontrado para este evento.");
      return;
    }
    
    console.log(`✅ Encontrados ${batches.length} lotes`);
    
    // Verificar cada lote em detalhe
    for (const batch of batches) {
      const now = new Date();
      const startDate = new Date(batch.start_date);
      const endDate = batch.end_date ? new Date(batch.end_date) : null;
      
      console.group(`🎫 ANÁLISE DETALHADA DO LOTE: ${batch.title} (ID: ${batch.id})`);
      
      // Informações básicas
      console.log("📋 DADOS BÁSICOS");
      console.log("- ID:", batch.id);
      console.log("- Título:", batch.title);
      console.log("- Descrição:", batch.description || "Não definida");
      console.log("- ID do Evento:", batch.event_id);
      console.log("- Ordem:", batch.order_number);
      
      // Visibilidade
      console.log("\n🔍 CONFIGURAÇÕES DE VISIBILIDADE");
      console.log("- Visibilidade:", batch.visibility);
      console.log("- Está visível?", batch.is_visible ? "SIM" : "NÃO");
      console.log("- Compra mínima:", batch.min_purchase);
      console.log("- Compra máxima:", batch.max_purchase || "Sem limite");
      console.log("- Grupo:", batch.batch_group || "Não agrupado");
      
      // Datas
      console.log("\n📅 DATAS");
      console.log("- Data inicial:", startDate.toLocaleString());
      console.log("- Data final:", endDate ? endDate.toLocaleString() : "Sem data final");
      console.log("- Data atual:", now.toLocaleString());
      console.log("- Antes da data inicial?", now < startDate ? "SIM" : "NÃO");
      console.log("- Depois da data final?", endDate && now > endDate ? "SIM" : "NÃO");
      
      // Ingressos e Status
      console.log("\n🎟️ INGRESSOS E STATUS");
      console.log("- Preço:", batch.price);
      console.log("- Total de ingressos:", batch.total_tickets);
      console.log("- Ingressos disponíveis:", batch.available_tickets);
      console.log("- Ingressos vendidos:", batch.total_tickets - batch.available_tickets);
      console.log("- Status na DB:", batch.status);
      
      // Status calculado
      let calculatedStatus = "unknown";
      if (!batch.is_visible) {
        calculatedStatus = "hidden";
      } else if (now < startDate) {
        calculatedStatus = "upcoming";
      } else if (endDate && now > endDate) {
        calculatedStatus = "ended";
      } else if (batch.available_tickets <= 0) {
        calculatedStatus = "sold_out";
      } else {
        calculatedStatus = "active";
      }
      
      console.log("- Status calculado:", calculatedStatus);
      console.log("- Status corresponde?", batch.status === calculatedStatus ? "SIM" : "NÃO");
      
      // Problemas identificados
      console.log("\n⚠️ PROBLEMAS IDENTIFICADOS");
      
      const problems = [];
      
      if (batch.status !== calculatedStatus) {
        problems.push(`Status incorreto: ${batch.status} (deveria ser ${calculatedStatus})`);
      }
      
      if (batch.available_tickets === null || batch.available_tickets === undefined) {
        problems.push("available_tickets é null ou undefined");
      }
      
      if (batch.available_tickets < 0) {
        problems.push("available_tickets é negativo");
      }
      
      if (batch.total_tickets === null || batch.total_tickets === undefined) {
        problems.push("total_tickets é null ou undefined");
      }
      
      if (batch.total_tickets < 0) {
        problems.push("total_tickets é negativo");
      }
      
      if (batch.available_tickets > batch.total_tickets) {
        problems.push("available_tickets é maior que total_tickets");
      }
      
      if (problems.length === 0) {
        console.log("✅ Nenhum problema encontrado!");
      } else {
        problems.forEach((problem, index) => {
          console.log(`- Problema ${index + 1}: ${problem}`);
        });
      }
      
      console.groupEnd();
    }
    
    console.log("\n📊 DIAGNÓSTICO COMPLETO");
    console.log("Para corrigir problemas, utilize as funções de correção disponíveis.");
    
  } catch (err) {
    console.error("❌ Erro durante análise detalhada:", err);
  }
};

// Mensagem para instruir o desenvolvedor
console.log(`
🔧 Ferramentas de diagnóstico de lotes disponíveis no console:
- window.diagnoseBatches("event-id") - Diagnosticar todos os lotes de um evento
- window.fixBatchStatus("batch-id") - Corrigir o status de um lote específico
- window.fixAllBatchesForEvent("event-id") - Corrigir todos os lotes de um evento
- window.fixAvailableTickets("event-id") - Forçar available_tickets = total_tickets para todos os lotes de um evento
- window.logBatchDetails("event-id") - Gerar log detalhado de todos os lotes de um evento
`);

export {};
