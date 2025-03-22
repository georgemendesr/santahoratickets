
import { corsHeaders } from "../_shared/cors.ts";

// Função para testar geração básica de PIX (dados mínimos garantidos)
export async function testBasicPixGeneration(
  mercadoPagoAccessToken: string,
  mercadoPagoTestAccessToken: string,
  isTestEnvironment: boolean = false
) {
  try {
    console.log("INICIANDO TESTE BÁSICO PIX");
    console.log("Ambiente:", isTestEnvironment ? "TESTE" : "PRODUÇÃO");
    
    // Usar token correto com base no ambiente
    // Para o ambiente de teste, sempre usamos a credencial fixa fornecida
    const accessToken = isTestEnvironment ? 
      "APP_USR-1217057600984731-021621-77ecfa5c3d1443fc1ff44c763e928eba-106423283" : 
      mercadoPagoAccessToken;
    
    if (!accessToken) {
      throw new Error(`Token de acesso ${isTestEnvironment ? "de teste" : "de produção"} não configurado`);
    }
    
    // Dados mínimos garantidos conforme documentação do Mercado Pago
    const minimalRequest = {
      transaction_amount: 1.00,
      description: `Teste básico PIX (${isTestEnvironment ? "ambiente de teste" : "ambiente de produção"})`,
      payment_method_id: "pix",
      payer: {
        email: "test_user_24634007@testuser.com"
      }
    };
    
    console.log("Requisição mínima de teste:", JSON.stringify(minimalRequest));
    console.log("Usando token que começa com:", accessToken.substring(0, 10) + "...");
    
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(minimalRequest),
    });
    
    const responseData = await response.json();
    
    // Log detalhado para diagnóstico
    console.log("Resposta do teste básico:", JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers]),
      body: responseData
    }));
    
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
export async function createPixData(
  event: any,
  preference: any,
  mercadoPagoAccessToken: string,
  mercadoPagoTestAccessToken: string,
  isTestEnvironment: boolean = false
) {
  try {
    // Usar token correto com base no ambiente
    // Para o ambiente de teste, sempre usamos a credencial fixa fornecida
    const accessToken = isTestEnvironment ? 
      "APP_USR-1217057600984731-021621-77ecfa5c3d1443fc1ff44c763e928eba-106423283" : 
      mercadoPagoAccessToken;
    
    if (!accessToken) {
      throw new Error(`Token de acesso ${isTestEnvironment ? "de teste" : "de produção"} não configurado`);
    }
    
    console.log("Ambiente de pagamento:", isTestEnvironment ? "TESTE" : "PRODUÇÃO");
    console.log("Usando token que começa com:", accessToken.substring(0, 10) + "...");
    
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
        "Authorization": `Bearer ${accessToken}`
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
