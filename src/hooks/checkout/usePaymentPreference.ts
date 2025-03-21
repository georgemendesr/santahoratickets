
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { PaymentPreference } from "@/types/payment.types";

export async function createPaymentPreference(
  eventId: string,
  session: Session,
  batch: any,
  paymentType: string,
  paymentMethodId: string,
  cardToken?: string,
  installments?: number
): Promise<PaymentPreference> {
  const init_point = `${eventId}-${session.user.id}-${Date.now()}`;
  
  console.log("Criando preferência de pagamento:", {
    init_point,
    eventId,
    userId: session.user.id,
    amount: batch.price,
    paymentType,
    paymentMethodId,
    hasCardToken: !!cardToken,
    installments
  });
  
  // Verificar se já existe uma preferência pendente para este usuário e evento
  const { data: existingPreferences, error: queryError } = await supabase
    .from("payment_preferences")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", session.user.id)
    .eq("status", "pending")
    .eq("payment_type", paymentType)
    .order("created_at", { ascending: false })
    .limit(1);
    
  if (queryError) {
    console.error("Erro ao verificar preferências existentes:", queryError);
  }
  
  // Se existir uma preferência pendente recente (menos de 10 minutos), reutilizá-la
  if (existingPreferences && existingPreferences.length > 0) {
    const latestPreference = existingPreferences[0];
    const createdAt = new Date(latestPreference.created_at as string);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    
    if (diffMinutes < 10 && latestPreference.payment_type === paymentType) {
      console.log("Reutilizando preferência existente:", latestPreference);
      
      // Atualiza a última tentativa
      await supabase
        .from("payment_preferences")
        .update({
          attempts: (latestPreference.attempts || 0) + 1,
          last_attempt_at: new Date().toISOString()
        })
        .eq("id", latestPreference.id);
        
      return latestPreference as PaymentPreference;
    }
  }

  // Criar nova preferência
  const { data: preference, error } = await supabase
    .from("payment_preferences")
    .insert({
      init_point,
      event_id: eventId,
      user_id: session.user.id,
      ticket_quantity: 1,
      total_amount: batch.price,
      payment_type: paymentType,
      payment_method_id: paymentMethodId,
      card_token: cardToken,
      installments,
      status: "pending",
      attempts: 0,
      last_attempt_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar preferência:", error);
    throw error;
  }

  console.log("Preferência criada:", preference);
  return preference as PaymentPreference;
}
