
/**
 * Função para testar geração básica de preferência do Mercado Pago
 */
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
