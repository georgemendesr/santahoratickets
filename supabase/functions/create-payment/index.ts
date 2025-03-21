
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"
import qrcode from "https://esm.sh/qrcode@1.5.3"

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

    // Gerar um código PIX estático para teste
    const qrCode = "00020126330014BR.GOV.BCB.PIX0111test@test.com5204000053039865406123.455802BR5913Bora Pagodear6008Sao Paulo62070503***6304E2CA"
    
    try {
      // Gerar QR code base64
      const qrCodeBase64Promise = qrcode.toDataURL(qrCode, {
        errorCorrectionLevel: 'H',
        margin: 1,
        scale: 8
      });
      
      // Adicionando um timeout de 5 segundos para a geração
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout gerando QR code")), 5000)
      );
      
      // Corrida entre a geração e o timeout
      const qrCodeBase64 = await Promise.race([
        qrCodeBase64Promise,
        timeoutPromise
      ]);
      
      // Remover o prefixo data:image/png;base64, do base64
      const base64Clean = typeof qrCodeBase64 === 'string' 
        ? qrCodeBase64.replace(/^data:image\/png;base64,/, '')
        : null;

      if (!base64Clean) {
        throw new Error("Falha ao gerar QR code base64");
      }

      // Atualizar a preferência com os dados do PIX
      const { error: updateError } = await supabaseClient
        .from('payment_preferences')
        .update({
          qr_code: qrCode,
          qr_code_base64: base64Clean,
          last_attempt_at: new Date().toISOString()
        })
        .eq('id', preferenceId)

      if (updateError) {
        console.error("Erro ao atualizar preferência com QR code:", updateError)
        throw new Error(`Erro ao atualizar QR code: ${updateError.message}`)
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
            qr_code_base64: base64Clean
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (qrError) {
      console.error("Erro ao gerar QR code:", qrError)
      
      // Mesmo com erro no QR, retornar o código PIX
      return new Response(
        JSON.stringify({
          success: true,
          message: "Código PIX gerado com sucesso, mas houve erro no QR Code",
          status: "pending",
          payment_id: preferenceId,
          data: {
            preferenceId,
            qr_code: qrCode,
            qr_code_base64: null
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
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
