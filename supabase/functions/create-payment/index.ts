
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, quantity, paymentType, token, installments, preferenceId, regenerate } = await req.json();
    
    // Log para identificar se é uma regeneração ou uma nova criação
    if (regenerate) {
      console.log('Regenerando pagamento para preferência:', preferenceId);
    } else {
      console.log('Dados recebidos para novo pagamento:', { eventId, quantity, paymentType });
    }

    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verificar JWT do usuário
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autorizado');
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      throw new Error('Usuário não autorizado');
    }

    // Para regeneração, buscar a preferência existente
    if (regenerate && preferenceId) {
      const { data: preference, error: preferenceError } = await supabaseClient
        .from('payment_preferences')
        .select('*')
        .eq('id', preferenceId)
        .single();

      if (preferenceError || !preference) {
        throw new Error('Preferência não encontrada');
      }

      // Buscar evento e lote
      const { data: event, error: eventError } = await supabaseClient
        .from('events')
        .select('*')
        .eq('id', preference.event_id)
        .single();

      if (eventError || !event) {
        throw new Error('Evento não encontrado');
      }

      // Buscar lote ativo
      const { data: batch, error: batchError } = await supabaseClient
        .from('batches')
        .select('*')
        .eq('event_id', preference.event_id)
        .eq('status', 'active')
        .order('order_number', { ascending: true })
        .limit(1)
        .single();

      if (batchError || !batch) {
        throw new Error('Nenhum lote disponível');
      }

      // Utilizar dados da preferência existente
      eventId = preference.event_id;
      quantity = preference.ticket_quantity;
      paymentType = preference.payment_type;
      
      // Criar pagamento no Mercado Pago (mesma lógica abaixo)
      // continuação da função...
    } else {
      // Validar dados necessários para novo pagamento
      if (!eventId || !quantity || !paymentType) {
        throw new Error('Dados incompletos');
      }

      // Buscar evento
      const { data: event, error: eventError } = await supabaseClient
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError || !event) {
        throw new Error('Evento não encontrado');
      }

      // Buscar lote ativo
      const { data: batch, error: batchError } = await supabaseClient
        .from('batches')
        .select('*')
        .eq('event_id', eventId)
        .eq('status', 'active')
        .order('order_number', { ascending: true })
        .limit(1)
        .single();

      if (batchError || !batch) {
        throw new Error('Nenhum lote disponível');
      }

      // Verificar disponibilidade
      if (batch.available_tickets < quantity) {
        throw new Error('Quantidade indisponível');
      }

      // Se não for regeneração, criar nova preferência
      if (!preferenceId) {
        const { data: newPreference, error: preferenceError } = await supabaseClient
          .from('payment_preferences')
          .insert({
            event_id: eventId,
            user_id: user.id,
            ticket_quantity: quantity,
            total_amount: batch.price * quantity,
            init_point: '',
            status: 'pending',
            payment_type: paymentType
          })
          .select()
          .single();

        if (preferenceError || !newPreference) {
          throw new Error('Erro ao criar preferência');
        }

        preferenceId = newPreference.id;
      }
    }

    // Buscar a preferência atual (regeneração ou recém-criada)
    const { data: currentPreference, error: currentPreferenceError } = await supabaseClient
      .from('payment_preferences')
      .select('*')
      .eq('id', preferenceId)
      .single();

    if (currentPreferenceError || !currentPreference) {
      throw new Error('Preferência não encontrada');
    }

    // Buscar dados necessários para o pagamento
    const { data: event } = await supabaseClient
      .from('events')
      .select('*')
      .eq('id', currentPreference.event_id)
      .single();

    const { data: batch } = await supabaseClient
      .from('batches')
      .select('*')
      .eq('event_id', currentPreference.event_id)
      .eq('status', 'active')
      .order('order_number', { ascending: true })
      .limit(1)
      .single();

    const mercadoPagoAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mercadoPagoAccessToken) {
      throw new Error('Token do Mercado Pago não configurado');
    }

    // Criar pagamento no Mercado Pago
    const paymentData: any = {
      transaction_amount: currentPreference.total_amount,
      description: `${currentPreference.ticket_quantity}x Ingressos para ${event.title}`,
      payment_method_id: currentPreference.payment_type === 'credit_card' ? 'master' : 'pix',
      payer: {
        email: user.email
      },
      external_reference: `${currentPreference.event_id}|${preferenceId}`,
      notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-payment`
    };

    // Adicionar dados específicos para cartão de crédito
    if (currentPreference.payment_type === 'credit_card' && token) {
      paymentData.token = token;
      paymentData.installments = installments || 1;
    }

    console.log('Criando pagamento:', paymentData);

    // Gerar uma chave de idempotência única
    const idempotencyKey = crypto.randomUUID();

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mercadoPagoAccessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(paymentData)
    });

    const responseData = await response.json();
    console.log('Resposta do MercadoPago:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      // Atualizar preferência com erro
      await supabaseClient
        .from('payment_preferences')
        .update({
          status: 'rejected',
          error_message: responseData.message || 'Erro desconhecido'
        })
        .eq('id', preferenceId);

      throw new Error(responseData.message || 'Erro ao criar pagamento');
    }

    // Para PIX, extrair o QR code
    let qrCode = null;
    let qrCodeBase64 = null;

    if (currentPreference.payment_type === 'pix' && responseData.point_of_interaction?.transaction_data) {
      qrCode = responseData.point_of_interaction.transaction_data.qr_code;
      qrCodeBase64 = responseData.point_of_interaction.transaction_data.qr_code_base64;
      console.log('QR Code gerado com sucesso');
    }

    // Atualizar preferência com dados do pagamento
    const { error: updateError } = await supabaseClient
      .from('payment_preferences')
      .update({
        external_id: responseData.id.toString(),
        status: responseData.status,
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64,
        payment_method_id: responseData.payment_method_id,
        card_token: token,
        installments: installments
      })
      .eq('id', preferenceId);

    if (updateError) {
      console.error('Erro ao atualizar preferência:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        id: responseData.id,
        status: responseData.status,
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64,
        payment_id: responseData.id,
        preference_id: preferenceId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
