
/**
 * Função para criar preferência do Checkout Pro
 */
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
