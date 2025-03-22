
// Função auxiliar para validar dados de entrada
export function validateInput(data: any) {
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

// Função para gerar resposta de sucesso
export function createSuccessResponse(pixData, isTestEnvironment) {
  return new Response(
    JSON.stringify({ 
      success: true, 
      environment: isTestEnvironment ? "test" : "production",
      data: pixData.data,
      status: pixData.status 
    }),
    { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        "Content-Type": "application/json" 
      },
      status: 200
    }
  );
}

// Função para gerar resposta de erro
export function createErrorResponse(error) {
  return new Response(
    JSON.stringify({
      success: false,
      message: error.message || "Erro ao processar pagamento",
      error: error.toString()
    }),
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        "Content-Type": "application/json"
      },
      status: 500
    }
  );
}

// Função para gerar resposta de teste
export function createTestResponse(testResult, isTestEnvironment) {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: "Teste básico executado com sucesso",
      environment: isTestEnvironment ? "test" : "production",
      data: testResult
    }),
    { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        "Content-Type": "application/json" 
      },
      status: 200
    }
  );
}
