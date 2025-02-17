
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import mercadopago from 'https://esm.sh/mercadopago@1.5.14'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] ?? ''
    )

    if (authError || !user) {
      throw new Error('Não autorizado')
    }

    const { 
      eventId, 
      batchId, 
      quantity, 
      cardToken, 
      installments, 
      paymentMethodId,
      paymentType 
    } = await req.json()

    if (!eventId || !quantity || !batchId) {
      throw new Error('Dados inválidos')
    }

    // Buscar informações do evento e do lote
    const { data: event } = await supabaseClient
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    const { data: batch } = await supabaseClient
      .from('batches')
      .select('*')
      .eq('id', batchId)
      .single()

    if (!event || !batch) {
      throw new Error('Evento ou lote não encontrado')
    }

    // Configurar MercadoPago
    mercadopago.configure({
      access_token: Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? ''
    })

    const totalAmount = batch.price * quantity

    let paymentData;
    if (paymentType === 'credit_card') {
      paymentData = {
        transaction_amount: totalAmount,
        token: cardToken,
        description: `${event.title} - ${batch.title} (${quantity} ingressos)`,
        installments: installments,
        payment_method_id: paymentMethodId,
        payer: {
          email: user.email,
        }
      }
    } else if (paymentType === 'pix') {
      paymentData = {
        transaction_amount: totalAmount,
        description: `${event.title} - ${batch.title} (${quantity} ingressos)`,
        payment_method_id: 'pix',
        payer: {
          email: user.email,
        }
      }
    } else {
      throw new Error('Método de pagamento inválido')
    }

    console.log('Criando pagamento:', paymentData);
    const paymentResponse = await mercadopago.payment.save(paymentData)
    console.log('Resposta do pagamento:', paymentResponse);

    if (paymentResponse.response.status === 'rejected') {
      throw new Error('Pagamento rejeitado: ' + paymentResponse.response.status_detail)
    }

    // Criar registro de pagamento
    const { data: paymentPreference, error: paymentError } = await supabaseClient
      .from('payment_preferences')
      .insert({
        event_id: eventId,
        user_id: user.id,
        ticket_quantity: quantity,
        total_amount: totalAmount,
        payment_method_id: paymentMethodId,
        status: paymentResponse.response.status,
        init_point: paymentType === 'pix' ? paymentResponse.response.point_of_interaction?.transaction_data?.qr_code : '',
        payment_type: paymentType
      })
      .select()
      .single()

    if (paymentError) {
      throw paymentError
    }

    const responseData = {
      status: paymentResponse.response.status,
      payment_id: paymentResponse.response.id
    }

    if (paymentType === 'pix') {
      responseData.qr_code = paymentResponse.response.point_of_interaction?.transaction_data?.qr_code
      responseData.qr_code_base64 = paymentResponse.response.point_of_interaction?.transaction_data?.qr_code_base64
    }

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
