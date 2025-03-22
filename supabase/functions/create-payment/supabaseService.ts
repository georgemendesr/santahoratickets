
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Função para obter dados do evento com tratamento de erros
export async function getEventData(supabase, eventId) {
  try {
    console.log("Buscando dados do evento:", eventId);
    
    // Removendo creator_id da consulta que não existe na tabela events
    const { data: event, error } = await supabase
      .from('events')
      .select('title, price, id')
      .eq('id', eventId)
      .single();
    
    if (error) {
      console.error("Erro SQL ao buscar evento:", error);
      throw error;
    }
    
    if (!event) {
      console.error("Evento não encontrado:", eventId);
      throw new Error(`Evento não encontrado com ID: ${eventId}`);
    }
    
    // Adicionando um campo virtual creator_id para manter compatibilidade com código existente
    event.creator_id = null; // Valor padrão para manter compatibilidade
    
    console.log("Dados do evento recuperados com sucesso:", event);
    return event;
  } catch (error) {
    console.error("Erro detalhado ao buscar dados do evento:", {
      message: error.message,
      code: error.code,
      details: error.details
    });
    throw new Error(`Erro ao buscar dados do evento: ${error.message}`);
  }
}

// Função para obter dados de preferência existente
export async function getExistingPreference(supabase, preferenceId) {
  try {
    console.log("Buscando preferência:", preferenceId);
    const { data: preference, error } = await supabase
      .from('payment_preferences')
      .select('*')
      .eq('id', preferenceId)
      .single();
    
    if (error) throw error;
    if (!preference) throw new Error(`Preferência não encontrada: ${preferenceId}`);
    
    console.log("Preferência encontrada:", {
      id: preference.id,
      event_id: preference.event_id,
      status: preference.status
    });
    
    return preference;
  } catch (error) {
    console.error("Erro ao buscar preferência:", error);
    throw new Error(`Erro ao buscar preferência: ${error.message}`);
  }
}

// Função para atualizar a preferência de pagamento
export async function updatePaymentPreference(supabase, preference, pixData) {
  try {
    if (!pixData || !pixData.data) {
      throw new Error("Dados PIX incompletos ou inválidos");
    }
    
    const { data, error } = await supabase
      .from('payment_preferences')
      .update({
        qr_code: pixData.data.qr_code,
        qr_code_base64: pixData.data.qr_code_base64,
        status: pixData.status,
        external_id: pixData.payment_id,
        attempts: preference.attempts + 1,
        last_attempt_at: new Date()
      })
      .eq('id', preference.id)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Erro ao atualizar preferência de pagamento:", error);
    throw new Error(`Erro ao atualizar preferência: ${error.message}`);
  }
}

// Função para criar nova preferência de pagamento para usuário logado
export async function createPaymentPreference(supabase, data, eventData) {
  try {
    const preference = {
      ticket_quantity: data.ticketQuantity,
      total_amount: data.totalAmount,
      event_id: data.eventId,
      user_id: data.userId,
      status: 'pending',
      payment_type: "pix",
      payment_method_id: "pix",
      init_point: `${data.eventId}-${data.userId}-${Date.now()}`
    };
    
    const { data: savedPreference, error } = await supabase
      .from('payment_preferences')
      .insert(preference)
      .select()
      .single();
    
    if (error) throw error;
    return savedPreference;
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    throw new Error(`Erro ao criar preferência: ${error.message}`);
  }
}

// Função para criar nova preferência de pagamento para convidado
export async function createGuestPaymentPreference(supabase, data, eventData) {
  try {
    console.log("Criando preferência para checkout como convidado:", {
      eventId: data.eventId,
      guestInfo: {
        name: data.guestInfo.name,
        email: data.guestInfo.email,
        // CPF ofuscado para o log
        cpf: data.guestInfo.cpf ? `${data.guestInfo.cpf.substring(0, 3)}...` : null
      }
    });
    
    // Gerar identificador único para convidado usando dados fornecidos
    const guestId = `guest-${Date.now()}-${data.guestInfo.email.replace(/[^a-zA-Z0-9]/g, '')}`;
    
    const preference = {
      ticket_quantity: data.ticketQuantity,
      total_amount: data.totalAmount,
      event_id: data.eventId,
      // Usar ID de convidado no lugar do user_id
      user_id: guestId,
      status: 'pending',
      payment_type: data.paymentType || "pix",
      payment_method_id: data.paymentMethodId || "pix",
      init_point: `${data.eventId}-${guestId}-${Date.now()}`,
      // Armazenar informações do convidado como metadados
      metadata: {
        is_guest: true,
        guest_name: data.guestInfo.name,
        guest_email: data.guestInfo.email,
        guest_cpf: data.guestInfo.cpf,
        guest_phone: data.guestInfo.phone || null
      }
    };
    
    const { data: savedPreference, error } = await supabase
      .from('payment_preferences')
      .insert(preference)
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao salvar preferência de convidado:", error);
      throw error;
    }
    
    console.log("Preferência para convidado criada com sucesso:", {
      id: savedPreference.id,
      guestId,
      eventId: data.eventId
    });
    
    return savedPreference;
  } catch (error) {
    console.error("Erro ao criar preferência para convidado:", error);
    throw new Error(`Erro ao processar checkout como convidado: ${error.message}`);
  }
}
