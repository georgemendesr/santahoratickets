
import { corsHeaders } from "../../_shared/cors.ts";

/**
 * Função para criar dados PIX usando Mercado Pago
 */
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

// Exportar tipos para usar em outros arquivos
export type PixResponse = {
  status: string;
  data: any;
  payment_id: string;
};
