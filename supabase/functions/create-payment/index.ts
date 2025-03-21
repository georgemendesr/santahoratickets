
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"
import qrcode from "https://esm.sh/qrcode@1.5.3"

// Função auxiliar para gerar o CRC16
function crc16CCITT(str) {
  const crcTable = [
    0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7,
    0x8108, 0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef,
    0x1231, 0x0210, 0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
    0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de,
    0x2462, 0x3443, 0x0420, 0x1401, 0x64e6, 0x74c7, 0x44a4, 0x5485,
    0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6, 0x5695, 0x46b4,
    0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d, 0xc7bc,
    0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b,
    0x5af5, 0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12,
    0xdbfd, 0xcbdc, 0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
    0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41,
    0xedae, 0xfd8f, 0xcdec, 0xddcd, 0xad2a, 0xbd0b, 0x8d68, 0x9d49,
    0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
    0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a, 0x9f59, 0x8f78,
    0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e, 0xe16f,
    0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e,
    0x02b1, 0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256,
    0xb5ea, 0xa5cb, 0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
    0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
    0xa7db, 0xb7fa, 0x8799, 0x97b8, 0xe75f, 0xf77e, 0xc71d, 0xd73c,
    0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9, 0xb98a, 0xa9ab,
    0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882, 0x28a3,
    0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
    0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92,
    0xfd2e, 0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9,
    0x7c26, 0x6c07, 0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
    0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8,
    0x6e17, 0x7e36, 0x4e55, 0x5e74, 0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
  ];

  // Inicializa o valor do CRC
  let crc = 0xFFFF;
  
  // Calcula o CRC
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    const j = (c ^ (crc >> 8)) & 0xFF;
    crc = crcTable[j] ^ (crc << 8);
  }
  
  // Complemento de 2 de 16 bits
  crc = ((crc ^ 0) & 0xFFFF);
  
  // Converte para hexadecimal de 4 caracteres
  return crc.toString(16).padStart(4, '0').toUpperCase();
}

// Função para gerar o payload do PIX
function generatePixPayload(
  merchantName,
  merchantCity,
  pixKey,
  txid,
  amount,
  description = ''
) {
  // Dados constantes do payload PIX
  const payload = {};
  
  // Payload Format Indicator (obrigatório, fixo "01")
  payload["00"] = "01";
  
  // Merchant Account Information (obrigatório para o domínio "br.gov.bcb.pix")
  payload["26"] = {
    "00": "br.gov.bcb.pix", // GUI
    "01": pixKey, // Chave PIX (CPF, CNPJ, email, telefone ou EVP)
    ...(description ? { "02": description } : {}) // Descrição do pagamento (opcional)
  };
  
  // Merchant Category Code (opcional, padrão "0000")
  payload["52"] = "0000";
  
  // Transaction Currency (obrigatório, "986" para BRL)
  payload["53"] = "986";
  
  // Transaction Amount (opcional para QR dinâmico, obrigatório para estático)
  if (amount) {
    payload["54"] = amount.toFixed(2);
  }
  
  // Country Code (obrigatório, "BR")
  payload["58"] = "BR";
  
  // Merchant Name (obrigatório)
  payload["59"] = merchantName;
  
  // Merchant City (obrigatório)
  payload["60"] = merchantCity;
  
  // Additional Data Field (opcional)
  payload["62"] = {
    "05": txid // ID da transação
  };
  
  // Converte o payload para string no formato do PIX
  let pixCode = "";
  
  // Processa os campos de primeiro nível
  for (const [id, value] of Object.entries(payload)) {
    if (typeof value === "object") {
      let subValue = "";
      // Processa subcampos
      for (const [subId, subContent] of Object.entries(value)) {
        subValue += `${subId}${subContent.length.toString().padStart(2, '0')}${subContent}`;
      }
      pixCode += `${id}${subValue.length.toString().padStart(2, '0')}${subValue}`;
    } else {
      pixCode += `${id}${value.length.toString().padStart(2, '0')}${value}`;
    }
  }
  
  // Adiciona os campos obrigatórios finais
  pixCode += "6304";
  
  // Calcula e adiciona o CRC16
  const crcValue = crc16CCITT(pixCode);
  pixCode += crcValue;
  
  return pixCode;
}

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

    // Buscar mais informações para o PIX
    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('title, location')
      .eq('id', preference.event_id)
      .single();
      
    if (eventError) {
      console.error("Erro ao buscar dados do evento:", eventError)
    }

    // Dados para o PIX (ainda são simulados, mas com formato correto)
    const pixKey = "05373979073" // CPF/CNPJ como chave PIX (simulado)
    const merchantName = "BORA PAGODEAR"
    const merchantCity = event?.location?.split(',').pop()?.trim() || "SAO PAULO"
    const amount = preference.total_amount
    const txid = preferenceId.replace(/-/g, '').substring(0, 25)
    const description = event?.title || "Ingresso"

    // Gerar PIX utilizando a função auxiliar (EMV BR Code)
    const qrCode = generatePixPayload(
      merchantName,
      merchantCity,
      pixKey,
      txid,
      amount,
      description
    )
    
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
