
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN") || '';

// Função auxiliar para validar dados de entrada
function validateInput(data: any) {
  if (!data) {
    throw new Error("Dados de entrada inválidos ou ausentes");
  }
  
  if (data.regenerate && !data.preferenceId) {
    throw new Error("ID de preferência ausente para regeneração");
  }
  
  if (!data.regenerate && (!data.eventId || !data.userId || !data.ticketQuantity || !data.totalAmount)) {
    throw new Error("Dados obrigatórios ausentes para criar novo pagamento");
  }
}

// Função para obter dados do evento com tratamento de erros
async function getEventData(supabase, eventId) {
  try {
    console.log("Buscando dados do evento:", eventId);
    
    const { data: event, error } = await supabase
      .from('events')
      .select('title, price, id, creator_id')
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
async function getExistingPreference(supabase, preferenceId) {
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

// Função para testar geração básica de PIX (dados mínimos garantidos)
async function testBasicPixGeneration() {
  try {
    console.log("INICIANDO TESTE BÁSICO PIX");
    
    // Dados mínimos garantidos conforme documentação do Mercado Pago
    const minimalRequest = {
      transaction_amount: 1.00,
      description: "Teste básico PIX",
      payment_method_id: "pix",
      payer: {
        email: "test_user_24634007@testuser.com"
      }
    };
    
    console.log("Requisição mínima de teste:", JSON.stringify(minimalRequest));
    
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mercadoPagoAccessToken}`
      },
      body: JSON.stringify(minimalRequest),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("Erro no teste básico:", responseData);
      throw new Error(`Erro na API do Mercado Pago: ${responseData.message || 'Erro desconhecido'}`);
    }
    
    console.log("TESTE BÁSICO BEM-SUCEDIDO:", JSON.stringify(responseData));
    
    // Verificar se os campos esperados existem
    if (responseData.point_of_interaction?.transaction_data?.qr_code) {
      console.log("QR CODE GERADO COM SUCESSO");
    } else {
      console.log("RESPOSTA SEM QR CODE:", JSON.stringify(responseData));
    }
    
    return responseData;
  } catch (error) {
    console.error("ERRO NO TESTE BÁSICO:", JSON.stringify(error.response?.data || error.message));
    throw error;
  }
}

// Função para criar dados PIX usando Mercado Pago
async function createPixData(event, preference) {
  try {
    // Gerar dados para o pagamento PIX
    const externalReference = `${event.id}|${preference.id}`;
    
    // AQUI ESTÁ A CORREÇÃO - Linha 393 aproximadamente
    // Usar um valor fixo para o nome do beneficiário em vez de event.organizer_name
    const organizerName = "Santa Hora"; // Valor fixo para o beneficiário
    
    console.log("Gerando QR Code PIX para:", {
      eventId: event.id,
      eventTitle: event.title,
      beneficiaryName: organizerName, // Usar o valor fixo
      preferenceId: preference.id,
      amount: preference.total_amount
    });
    
    // Detalhes do pagador - valores fixos para teste
    const payer = {
      email: "test_user_24634007@testuser.com",
      first_name: "Test",
      last_name: "User"
    };
    
    // Dados para a API do Mercado Pago
    const paymentData = {
      transaction_amount: preference.total_amount,
      description: `Ingresso para ${event.title}`,
      payment_method_id: "pix",
      external_reference: externalReference,
      payer: payer
    };
    
    console.log("DADOS DE PAGAMENTO:", JSON.stringify(paymentData));
    
    // Chamar a API do Mercado Pago
    console.log("REQUISIÇÃO AO MERCADO PAGO:", JSON.stringify(paymentData));
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mercadoPagoAccessToken}`
      },
      body: JSON.stringify(paymentData),
    });
    
    const mpResponse = await response.json();
    
    // Verificar resposta
    if (!response.ok) {
      console.error("ERRO COMPLETO:", JSON.stringify({
        message: mpResponse.message,
        response: mpResponse,
        status: response.status
      }));
      throw new Error(`Erro na resposta do Mercado Pago: ${mpResponse.message || 'Erro desconhecido'}`);
    }
    
    console.log("RESPOSTA DO MERCADO PAGO:", JSON.stringify(mpResponse));
    console.log("Resposta do Mercado Pago (resumo):", {
      id: mpResponse.id,
      status: mpResponse.status,
      has_qr_code: !!mpResponse.point_of_interaction?.transaction_data?.qr_code,
      has_qr_code_base64: !!mpResponse.point_of_interaction?.transaction_data?.qr_code_base64
    });
    
    return {
      status: mpResponse.status,
      data: mpResponse.point_of_interaction?.transaction_data,
      payment_id: mpResponse.id
    };
  } catch (error) {
    console.error("ERRO COMPLETO:", JSON.stringify({
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    }));
    console.error("Erro ao criar dados PIX:", error);
    throw new Error(`Erro ao criar dados PIX: ${error.message}`);
  }
}

// Função para atualizar a preferência de pagamento
async function updatePaymentPreference(supabase, preference, pixData) {
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

// Função para criar nova preferência de pagamento
async function createPaymentPreference(supabase, data, eventData) {
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

serve(async (req) => {
  // Gerenciar CORS e preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Inicializar client supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Extrair e validar dados da requisição
    const reqData = await req.json();
    validateInput(reqData);
    
    console.log("Dados da requisição:", reqData);
    
    // Verificar se é um pedido de teste básico
    if (reqData.testOnly) {
      console.log("Executando apenas teste básico de geração PIX");
      const testResult = await testBasicPixGeneration();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Teste básico executado com sucesso",
          data: testResult
        }),
        { 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          },
          status: 200
        }
      );
    }
    
    let preference;
    let event;
    
    // Fluxo para regeneração de PIX
    if (reqData.regenerate && reqData.preferenceId) {
      console.log("Modo de regeneração do código PIX");
      preference = await getExistingPreference(supabase, reqData.preferenceId);
      
      if (!preference.event_id) {
        throw new Error("ID do evento ausente na preferência");
      }
      
      event = await getEventData(supabase, preference.event_id);
    } 
    // Fluxo para novo pagamento
    else {
      console.log("Modo de criação de novo pagamento");
      event = await getEventData(supabase, reqData.eventId);
      preference = await createPaymentPreference(supabase, reqData, event);
    }
    
    // Criar dados PIX usando Mercado Pago
    const pixData = await createPixData(event, preference);
    
    // Atualizar a preferência com dados do PIX
    await updatePaymentPreference(supabase, preference, pixData);
    
    // Resposta de sucesso
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: pixData.data,
        status: pixData.status 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200
      }
    );
  } catch (error) {
    console.error("Erro durante processamento:", error);
    
    // Resposta de erro detalhada
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Erro ao processar pagamento",
        error: error.toString()
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      }
    );
  }
});
