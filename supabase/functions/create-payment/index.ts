
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Configurações do Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { preferenceId, eventId, batchId, paymentType, regenerate } = await req.json()

    console.log("Recebendo solicitação de pagamento:", { 
      preferenceId, 
      eventId, 
      batchId, 
      paymentType,
      regenerate 
    })

    if (!preferenceId) {
      throw new Error("ID da preferência não fornecido")
    }

    // Buscar a preferência de pagamento
    const { data: preference, error: prefError } = await supabaseClient
      .from('payment_preferences')
      .select('*')
      .eq('id', preferenceId)
      .single()

    if (prefError) {
      console.error("Erro ao buscar preferência:", prefError)
      throw new Error(`Preferência não encontrada: ${prefError.message}`)
    }

    if (!preference) {
      throw new Error("Preferência não encontrada")
    }

    // Se o pagamento não for do tipo PIX, apenas retorne
    if (preference.payment_type !== 'pix') {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "Esta função suporta apenas pagamentos PIX",
          data: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log("Gerando QR Code PIX para a preferência:", preferenceId)

    // Gerar um UUID consistente para o código PIX
    const qrUUID = crypto.randomUUID();
    
    // Simular geração de QR Code PIX (em produção, isso seria integrado com MercadoPago ou outro provedor)
    const qrCode = `00020126580014BR.GOV.BCB.PIX0136${qrUUID}520400005303986540${preference.total_amount.toFixed(2)}5802BR5913Bora Pagodear6008Sao Paulo62070503***630452E5`
    
    // QR code base64 (fixo para demonstração)
    // Este QR code encoda o texto "PixExample" e é meramente demonstrativo
    const qrCodeBase64 = "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"

    // Atualizar a preferência com os dados do PIX
    const { error: updateError } = await supabaseClient
      .from('payment_preferences')
      .update({
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64,
        last_attempt_at: new Date().toISOString()
      })
      .eq('id', preferenceId)

    if (updateError) {
      console.error("Erro ao atualizar preferência com QR code:", updateError)
      throw new Error(`Erro ao gerar QR code: ${updateError.message}`)
    }

    // Por fim, retorne os dados ao cliente
    return new Response(
      JSON.stringify({
        success: true,
        message: "QR Code PIX gerado com sucesso",
        status: "pending",
        payment_id: preferenceId,
        data: {
          preferenceId,
          qr_code: qrCode,
          qr_code_base64: qrCodeBase64
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Erro ao processar pagamento:", error)
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Erro ao processar pagamento",
        error: error.toString()
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
