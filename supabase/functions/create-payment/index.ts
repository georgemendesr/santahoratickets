
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from "../_shared/cors.ts";
import { 
  testBasicPixGeneration, 
  createPixData,
  createCheckoutPreference 
} from "./mercadoPagoService.ts";
import { 
  getEventData, 
  getExistingPreference, 
  updatePaymentPreference,
  updatePreferenceWithCheckoutPro, 
  createPaymentPreference,
  createGuestPaymentPreference
} from "./supabaseService.ts";
import { 
  validateInput, 
  validateGuestInput,
  createSuccessResponse, 
  createErrorResponse, 
  createTestResponse,
  createCheckoutProResponse
} from "./utils.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN") || '';
// Usar o token de teste corrigido
const mercadoPagoTestAccessToken = Deno.env.get("MERCADO_PAGO_TEST_ACCESS_TOKEN") || 'TEST-1217057600984731-021621-11acd6ad8a3e1496fa519421793bfe42-106423283';

serve(async (req) => {
  // Gerenciar CORS e preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Inicializar client supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Extrair dados da requisição
    const reqData = await req.json();
    console.log("Dados da requisição:", reqData);
    
    // Verificar se estamos usando ambiente de teste
    const isTestEnvironment = reqData.useTestCredentials === true;
    console.log("Usando credenciais de:", isTestEnvironment ? "TESTE" : "PRODUÇÃO");
    
    // Verificar se é um pedido de teste básico
    if (reqData.testOnly) {
      console.log("Executando apenas teste básico de geração PIX");
      const testResult = await testBasicPixGeneration(
        mercadoPagoAccessToken, 
        mercadoPagoTestAccessToken, 
        isTestEnvironment
      );
      
      return createTestResponse(testResult, isTestEnvironment);
    }
    
    let preference;
    let event;
    
    // Verificar se estamos usando Checkout Pro
    const isCheckoutPro = reqData.paymentType === "checkout_pro" || !reqData.paymentType;
    console.log("Modo de pagamento:", isCheckoutPro ? "Checkout Pro" : "PIX/Cartão");
    
    // Fluxo para regeneração de pagamento
    if (reqData.regenerate && reqData.preferenceId) {
      console.log("Modo de regeneração do código PIX/checkout");
      preference = await getExistingPreference(supabase, reqData.preferenceId);
      
      if (!preference.event_id) {
        throw new Error("ID do evento ausente na preferência");
      }
      
      event = await getEventData(supabase, preference.event_id);
    } 
    // Fluxo para checkout como convidado
    else if (reqData.isGuestCheckout) {
      console.log("Modo de checkout como convidado");
      validateGuestInput(reqData);
      
      event = await getEventData(supabase, reqData.eventId);
      preference = await createGuestPaymentPreference(supabase, reqData, event);
    }
    // Fluxo para novo pagamento com usuário logado
    else {
      console.log("Modo de criação de novo pagamento com usuário autenticado");
      validateInput(reqData);
      
      event = await getEventData(supabase, reqData.eventId);
      preference = await createPaymentPreference(supabase, reqData, event);
    }
    
    // Processar o pagamento de acordo com o tipo (Checkout Pro ou PIX)
    if (isCheckoutPro) {
      // Criar dados do Checkout Pro usando Mercado Pago
      const checkoutData = await createCheckoutPreference(
        event, 
        preference, 
        mercadoPagoAccessToken, 
        mercadoPagoTestAccessToken, 
        isTestEnvironment
      );
      
      // Atualizar a preferência com URL de checkout
      await updatePreferenceWithCheckoutPro(supabase, preference, checkoutData);
      
      // Resposta de sucesso para Checkout Pro
      return createCheckoutProResponse(
        checkoutData.data.checkout_url, 
        isTestEnvironment,
        checkoutData.data.preference_id
      );
    } else {
      // Criar dados PIX usando Mercado Pago (fluxo original)
      const pixData = await createPixData(
        event, 
        preference, 
        mercadoPagoAccessToken, 
        mercadoPagoTestAccessToken, 
        isTestEnvironment
      );
      
      // Atualizar a preferência com dados do PIX
      await updatePaymentPreference(supabase, preference, pixData);
      
      // Resposta de sucesso para PIX
      return createSuccessResponse(pixData, isTestEnvironment);
    }
  } catch (error) {
    console.error("Erro durante processamento:", error);
    
    // Resposta de erro detalhada
    return createErrorResponse(error);
  }
});
