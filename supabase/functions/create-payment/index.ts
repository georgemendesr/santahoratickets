
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

    // IMPORTANTE: Gerar um código PIX real aqui (integração com gateway)
    // Usando código de exemplo para testes
    const pixKey = "12345678900" // CPF como chave PIX
    const merchantName = "Bora Pagodear"
    const city = "Sao Paulo"
    const amount = preference.total_amount
    const txid = preferenceId.replace(/-/g, '').substring(0, 25)

    // Gerar um código PIX estático (BRCode)
    // Esta é uma versão simplificada. Numa integração real, use a biblioteca
    // específica do gateway de pagamento ou uma biblioteca de PIX completa
    const qrCode = `00020126330014BR.GOV.BCB.PIX0111${pixKey}0221Pagamento de Ingresso52040000530398654${String(amount).padStart(2, '0')}5802BR5913${merchantName}6008${city}6304${txid}`
    
    let qrCodeBase64 = null;
    let generateSuccess = false;
    
    try {
      // Tenta gerar o QR code com maior nível de correção de erros
      try {
        qrCodeBase64 = await qrcode.toDataURL(qrCode, {
          errorCorrectionLevel: 'H',
          margin: 1,
          scale: 8,
          width: 300,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        generateSuccess = true;
      } catch (qrError) {
        console.error("Erro na primeira tentativa de gerar QR code:", qrError);
        
        // Segunda tentativa com configurações mais simples
        try {
          qrCodeBase64 = await qrcode.toDataURL(qrCode, {
            errorCorrectionLevel: 'M',
            margin: 1,
            scale: 4
          });
          generateSuccess = true;
        } catch (retryError) {
          console.error("Erro também na segunda tentativa:", retryError);
          // Continuar, mesmo sem o QR code base64
        }
      }
      
      // Remover o prefixo data:image/png;base64, do base64
      const base64Clean = typeof qrCodeBase64 === 'string' 
        ? qrCodeBase64.replace(/^data:image\/png;base64,/, '')
        : null;

      // Atualizar a preferência com os dados do PIX
      const { error: updateError } = await supabaseClient
        .from('payment_preferences')
        .update({
          qr_code: qrCode,
          qr_code_base64: base64Clean,
          last_attempt_at: new Date().toISOString(),
          attempts: (preference.attempts || 0) + 1
        })
        .eq('id', preferenceId)

      if (updateError) {
        console.error("Erro ao atualizar preferência com QR code:", updateError)
        throw new Error(`Erro ao atualizar QR code: ${updateError.message}`)
      }

      // Retornar a resposta com o status adequado
      const successMessage = generateSuccess 
        ? "QR Code PIX gerado com sucesso"
        : "Código PIX gerado com sucesso, mas houve erro no QR Code";
        
      return new Response(
        JSON.stringify({
          success: true,
          message: successMessage,
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
