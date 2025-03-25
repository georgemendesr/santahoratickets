
import { corsHeaders } from "../_shared/cors.ts";

// Função para testar geração básica de preferência do Mercado Pago
export async function testBasicPixGeneration(accessToken, testAccessToken, isTestMode) {
  console.log("Iniciando teste básico com token:", isTestMode ? "TESTE" : "PRODUÇÃO");
  
  const token = isTestMode ? testAccessToken : accessToken;
  
  try {
    // Criar uma preferência simples para teste
    const preferenceData = {
      items: [
        {
          title: "Teste de Integração",
          quantity: 1,
          unit_price: 0.01,
          currency_id: "BRL"
        }
      ],
      payment_methods: {
        excluded_payment_types: [{id: "credit_card"}],
        installments: 1
      },
      external_reference: "test-reference",
      notification_url: "https://webhook.site/test-notification"
    };
    
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(preferenceData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Erro no teste: ${data.message || response.statusText}`);
    }
    
    return {
      status: "success",
      preference_id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    };
  } catch (error) {
    console.error("Erro no teste de preferência:", error);
    return {
      status: "error",
      message: error.message
    };
  }
}

// Função para criar preferência do Checkout Pro
export async function createCheckoutPreference(event, preference, accessToken, testAccessToken, isTestMode) {
  console.log("Criando preferência do Checkout Pro com dados:", {
    eventTitle: event.title,
    amount: preference.total_amount,
    quantity: preference.ticket_quantity,
    isTestMode
  });
  
  const token = isTestMode ? testAccessToken : accessToken;
  const baseUrl = Deno.env.get("APP_URL") || "https://app.yourdomain.com";
  
  // Estrutura de referência: "eventId|preferenceId|userId"
  const externalReference = `${event.id}|${preference.id}|${preference.user_id || 'guest'}`;
  
  // URLs de retorno para o cliente após o pagamento
  const successUrl = `${baseUrl}/payment-status?status=approved&external_reference=${externalReference}`;
  const failureUrl = `${baseUrl}/payment-status?status=rejected&external_reference=${externalReference}`;
  const pendingUrl = `${baseUrl}/payment-status?status=pending&external_reference=${externalReference}`;
  
  try {
    const preferenceData = {
      items: [
        {
          id: event.id,
          title: `Ingresso para ${event.title}`,
          description: `${preference.ticket_quantity} ingresso(s) para o evento ${event.title}`,
          quantity: preference.ticket_quantity,
          currency_id: "BRL",
          unit_price: parseFloat((preference.total_amount / preference.ticket_quantity).toFixed(2))
        }
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl
      },
      auto_return: "approved",
      external_reference: externalReference,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/webhook-payment`
    };
    
    // Se for checkout como convidado, adicionar dados do comprador
    if (preference.metadata?.is_guest) {
      preferenceData.payer = {
        name: preference.metadata.guest_name,
        email: preference.metadata.guest_email,
        identification: {
          type: "CPF",
          number: preference.metadata.guest_cpf
        },
        phone: preference.metadata.guest_phone ? {
          area_code: "",
          number: preference.metadata.guest_phone
        } : undefined
      };
    }
    
    console.log("Enviando dados para o Mercado Pago:", JSON.stringify(preferenceData));
    
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(preferenceData)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("Erro na resposta do Mercado Pago:", responseData);
      throw new Error(`Erro ao criar preferência: ${responseData.message || response.statusText}`);
    }
    
    console.log("Preferência criada com sucesso:", {
      id: responseData.id,
      init_point: responseData.init_point
    });
    
    return {
      data: {
        checkout_url: responseData.init_point,
        preference_id: responseData.id
      },
      status: "pending"
    };
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    throw new Error(`Falha na criação da preferência: ${error.message}`);
  }
}

// Função para criar dados PIX usando Mercado Pago
export async function createPixData(event, preference, accessToken, testAccessToken, isTestEnvironment) {
  try {
    // Usar token apropriado para o ambiente
    const token = isTestEnvironment ? testAccessToken : accessToken;
    
    if (!token) {
      throw new Error(`Token de acesso ${isTestEnvironment ? "de teste" : "de produção"} não configurado`);
    }
    
    console.log("Ambiente de pagamento:", isTestEnvironment ? "TESTE" : "PRODUÇÃO");
    console.log("Usando token que começa com:", token.substring(0, 10) + "...");
    
    // Gerar dados para o pagamento PIX
    const externalReference = `${event.id}|${preference.id}`;
    
    // Usar um valor fixo para o nome do beneficiário
    const organizerName = "Santa Hora"; // Valor fixo para o beneficiário
    
    console.log("Gerando QR Code PIX para:", {
      eventId: event.id,
      eventTitle: event.title,
      beneficiaryName: organizerName,
      preferenceId: preference.id,
      amount: preference.total_amount
    });
    
    // Simplificar a requisição - conforme recomendado
    // Usar apenas os campos essenciais para o Mercado Pago
    const pixRequestBody = {
      transaction_amount: preference.total_amount,
      description: `Pagamento para Santa Hora`,
      payment_method_id: "pix",
      payer: {
        email: "cliente@email.com"
      }
    };
    
    // Adicionar logs de diagnóstico
    console.log("Enviando requisição para Mercado Pago:", 
                JSON.stringify({...pixRequestBody, access_token: "[REDACTED]"}));
    
    // Chamar a API do Mercado Pago
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(pixRequestBody),
    });
    
    const mpResponse = await response.json();
    
    // Log detalhado da resposta para diagnóstico
    console.log("Resposta completa da API:", JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers]),
      body: mpResponse
    }));
    
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

// Exportar funções e tipos para usar em outros arquivos
export type PixResponse = {
  status: string;
  data: any;
  payment_id: string;
};
