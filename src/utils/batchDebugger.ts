
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { computeBatchStatus } from "./batchStatusUtils";
import { Batch } from "@/types/event.types";

// Função para diagnosticar lotes de um evento
const diagnoseBatches = async (eventId: string) => {
  console.group("🔍 DIAGNÓSTICO DE LOTES");
  console.log("Analisando lotes para o evento:", eventId);
  
  try {
    // Buscar todos os lotes do evento
    const { data: batches, error } = await supabase
      .from("batches")
      .select("*")
      .eq("event_id", eventId)
      .order("order_number", { ascending: true });
      
    if (error) {
      console.error("Erro ao buscar lotes:", error);
      throw error;
    }
    
    if (!batches || batches.length === 0) {
      console.log("⚠️ Nenhum lote encontrado para este evento.");
      return;
    }
    
    console.log(`Encontrados ${batches.length} lotes:`);
    
    // Analisar cada lote
    batches.forEach(batch => {
      console.group(`Lote: ${batch.title} (ID: ${batch.id})`);
      
      // Verificar tickets disponíveis
      console.log(`Tickets: ${batch.available_tickets} disponíveis de ${batch.total_tickets} totais`);
      
      // Verificar disponibilidade
      if (batch.available_tickets <= 0) {
        console.warn("⚠️ PROBLEMA: Lote sem ingressos disponíveis");
      } else if (batch.available_tickets < batch.total_tickets * 0.1) {
        console.warn(`⚠️ ALERTA: Restam apenas ${batch.available_tickets} ingressos (menos de 10%)`);
      }
      
      // Verificar consistência available_tickets vs total_tickets
      if (batch.available_tickets > batch.total_tickets) {
        console.error("❌ ERRO: available_tickets maior que total_tickets!");
      }
      
      // Verificar datas
      const startDate = new Date(batch.start_date);
      const endDate = batch.end_date ? new Date(batch.end_date) : null;
      const now = new Date();
      
      console.log(`Data início: ${startDate.toLocaleString('pt-BR')}`);
      if (endDate) {
        console.log(`Data término: ${endDate.toLocaleString('pt-BR')}`);
      } else {
        console.log("Data término: Não definida");
      }
      
      // Verificar se está no período válido
      if (now < startDate) {
        console.warn("⚠️ ALERTA: Lote ainda não iniciou");
      }
      
      if (endDate && now > endDate) {
        console.warn("⚠️ ALERTA: Lote já encerrado");
      }
      
      // Verificar status atual vs status esperado
      // Precisamos converter visibility para um tipo válido antes de passar para computeBatchStatus
      const batchWithValidVisibility = {
        ...batch,
        visibility: (batch.visibility as "public" | "guest_only" | "internal_pdv") || "public"
      } as Batch;
      
      const expectedStatus = computeBatchStatus(batchWithValidVisibility);
      console.log(`Status atual: ${batch.status}`);
      console.log(`Status esperado: ${expectedStatus}`);
      
      if (batch.status !== expectedStatus) {
        console.error(`❌ INCONSISTÊNCIA: Status atual (${batch.status}) diferente do esperado (${expectedStatus})`);
      }
      
      // Verificar visibilidade
      console.log(`Visibilidade: ${batch.is_visible ? "Visível" : "Oculto"}`);
      console.log(`Tipo de visibilidade: ${batch.visibility}`);
      
      console.groupEnd();
    });
    
    // Resumo final
    const inconsistentStatuses = batches.map(batch => {
      // Converter visibility para o tipo esperado
      const batchWithValidVisibility = {
        ...batch,
        visibility: (batch.visibility as "public" | "guest_only" | "internal_pdv") || "public"
      } as Batch;
      
      return {
        batch: batchWithValidVisibility,
        computedStatus: computeBatchStatus(batchWithValidVisibility)
      };
    }).filter(item => item.batch.status !== item.computedStatus);
    
    const zeroTickets = batches.filter(b => b.available_tickets <= 0);
    const inconsistentTickets = batches.filter(b => b.available_tickets > b.total_tickets);
    
    console.group("📊 RESUMO DO DIAGNÓSTICO");
    console.log(`Total de lotes: ${batches.length}`);
    console.log(`Lotes com status inconsistente: ${inconsistentStatuses.length}`);
    console.log(`Lotes sem ingressos disponíveis: ${zeroTickets.length}`);
    console.log(`Lotes com tickets inconsistentes: ${inconsistentTickets.length}`);
    console.groupEnd();
    
  } catch (error) {
    console.error("Erro durante o diagnóstico:", error);
  } finally {
    console.groupEnd();
  }
};

// Função para corrigir status de um lote específico
const fixBatchStatus = async (batchId: string) => {
  console.group(`🔧 CORRIGINDO STATUS DO LOTE ${batchId}`);
  
  try {
    // Buscar dados do lote
    const { data: batch, error } = await supabase
      .from("batches")
      .select("*")
      .eq("id", batchId)
      .single();
      
    if (error) {
      console.error("Erro ao buscar lote:", error);
      throw error;
    }
    
    if (!batch) {
      console.log("⚠️ Lote não encontrado.");
      return;
    }
    
    // Calcular o status correto - precisamos converter visibility para o tipo esperado
    const batchWithValidVisibility = {
      ...batch,
      visibility: (batch.visibility as "public" | "guest_only" | "internal_pdv") || "public"
    } as Batch;
    
    const correctStatus = computeBatchStatus(batchWithValidVisibility);
    console.log(`Status atual: ${batch.status}`);
    console.log(`Status correto: ${correctStatus}`);
    
    // Atualizar o status
    const { error: updateError } = await supabase
      .from("batches")
      .update({ status: correctStatus })
      .eq("id", batchId);
      
    if (updateError) {
      console.error("Erro ao atualizar status:", updateError);
      throw updateError;
    }
    
    console.log("✅ Status do lote corrigido com sucesso!");
    
  } catch (error) {
    console.error("Erro durante a correção:", error);
  } finally {
    console.groupEnd();
  }
};

// Função para corrigir status de todos os lotes de um evento
const fixAllBatchesForEvent = async (eventId: string) => {
  console.group(`🔧 CORRIGINDO STATUS DE TODOS OS LOTES DO EVENTO ${eventId}`);
  
  try {
    // Buscar todos os lotes do evento
    const { data: batches, error } = await supabase
      .from("batches")
      .select("*")
      .eq("event_id", eventId);
      
    if (error) {
      console.error("Erro ao buscar lotes:", error);
      throw error;
    }
    
    if (!batches || batches.length === 0) {
      console.log("⚠️ Nenhum lote encontrado para este evento.");
      return;
    }
    
    console.log(`Corrigindo ${batches.length} lotes...`);
    
    // Corrigir cada lote
    for (const batch of batches) {
      // Precisamos converter visibility para o tipo esperado
      const batchWithValidVisibility = {
        ...batch,
        visibility: (batch.visibility as "public" | "guest_only" | "internal_pdv") || "public"
      } as Batch;
      
      const correctStatus = computeBatchStatus(batchWithValidVisibility);
      
      if (batch.status !== correctStatus) {
        console.log(`Lote ${batch.title}: ${batch.status} -> ${correctStatus}`);
        
        const { error: updateError } = await supabase
          .from("batches")
          .update({ status: correctStatus })
          .eq("id", batch.id);
          
        if (updateError) {
          console.error(`Erro ao atualizar lote ${batch.id}:`, updateError);
        }
      } else {
        console.log(`Lote ${batch.title}: Status já correto (${batch.status})`);
      }
    }
    
    console.log("✅ Status de todos os lotes corrigidos com sucesso!");
    toast.success("Status dos lotes foram corrigidos! Recarregue a página para ver as alterações.");
    
  } catch (error) {
    console.error("Erro durante a correção:", error);
    toast.error("Erro ao corrigir status dos lotes.");
  } finally {
    console.groupEnd();
  }
};

// Função para corrigir disponibilidade de ingressos (available_tickets = total_tickets)
const fixAvailableTickets = async (eventId: string) => {
  console.group(`🔧 CORRIGINDO DISPONIBILIDADE DE INGRESSOS DO EVENTO ${eventId}`);
  
  try {
    // Buscar todos os lotes do evento
    const { data: batches, error } = await supabase
      .from("batches")
      .select("*")
      .eq("event_id", eventId);
      
    if (error) {
      console.error("Erro ao buscar lotes:", error);
      throw error;
    }
    
    if (!batches || batches.length === 0) {
      console.log("⚠️ Nenhum lote encontrado para este evento.");
      return;
    }
    
    console.log(`Corrigindo ${batches.length} lotes...`);
    
    // Corrigir cada lote
    for (const batch of batches) {
      console.log(`Lote ${batch.title}: ${batch.available_tickets} -> ${batch.total_tickets}`);
      
      const { error: updateError } = await supabase
        .from("batches")
        .update({ 
          available_tickets: batch.total_tickets,
          status: 'active' // Também forçar o status como ativo
        })
        .eq("id", batch.id);
        
      if (updateError) {
        console.error(`Erro ao atualizar lote ${batch.id}:`, updateError);
      }
    }
    
    console.log("✅ Disponibilidade de ingressos corrigida com sucesso!");
    toast.success("Disponibilidade de ingressos corrigida! Recarregue a página para ver as alterações.");
    
  } catch (error) {
    console.error("Erro durante a correção:", error);
    toast.error("Erro ao corrigir disponibilidade de ingressos.");
  } finally {
    console.groupEnd();
  }
};

// Função para mostrar detalhes completos dos lotes (com log detalhado)
const logBatchDetails = async (eventId: string) => {
  console.group("📋 DETALHES COMPLETOS DOS LOTES");
  console.log("Analisando lotes para o evento:", eventId);
  
  try {
    // Buscar todos os lotes do evento
    const { data: batches, error } = await supabase
      .from("batches")
      .select("*")
      .eq("event_id", eventId)
      .order("order_number", { ascending: true });
      
    if (error) {
      console.error("Erro ao buscar lotes:", error);
      throw error;
    }
    
    if (!batches || batches.length === 0) {
      console.log("⚠️ Nenhum lote encontrado para este evento.");
      return;
    }
    
    // Mostrar detalhes completos de cada lote
    batches.forEach(batch => {
      console.group(`Lote: ${batch.title}`);
      console.log(JSON.stringify(batch, null, 2));
      console.groupEnd();
    });
    
  } catch (error) {
    console.error("Erro ao obter detalhes dos lotes:", error);
  } finally {
    console.groupEnd();
  }
};

// Expor funções globalmente
if (typeof window !== 'undefined') {
  window.diagnoseBatches = diagnoseBatches;
  window.fixBatchStatus = fixBatchStatus;
  window.fixAllBatchesForEvent = fixAllBatchesForEvent;
  window.fixAvailableTickets = fixAvailableTickets;
  window.logBatchDetails = logBatchDetails;
}
