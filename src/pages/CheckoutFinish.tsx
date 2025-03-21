
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCheckoutQueries } from "@/hooks/useCheckoutQueries";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";
import { useCheckoutState } from "@/hooks/useCheckoutState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const CheckoutFinish = () => {
  const { id: eventId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get("batch");
  const quantityParam = searchParams.get("quantity");
  const quantity = quantityParam ? parseInt(quantityParam, 10) : 1;
  
  const { session } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  
  // Buscar evento
  const { event, batch: defaultBatch, isLoading: isLoadingEventData } = useCheckoutQueries(eventId);

  // Buscar lote específico se batchId estiver presente
  const { data: specificBatch, isLoading: isLoadingBatch } = useQuery({
    queryKey: ["batch", batchId],
    queryFn: async () => {
      if (!batchId) return null;

      const { data, error } = await supabase
        .from("batches")
        .select("*")
        .eq("id", batchId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!batchId,
  });

  // Definir o lote selecionado (específico ou padrão)
  useEffect(() => {
    if (specificBatch) {
      setSelectedBatch(specificBatch);
    } else if (defaultBatch && !batchId) {
      setSelectedBatch(defaultBatch);
    }
  }, [specificBatch, defaultBatch, batchId]);

  // Verificar disponibilidade do lote
  useEffect(() => {
    if (selectedBatch && (selectedBatch.available_tickets < quantity || selectedBatch.status !== 'active')) {
      toast.error("Este lote não está mais disponível ou não possui ingressos suficientes");
    }
  }, [selectedBatch, quantity]);

  const {
    name,
    setName,
    cpf,
    setCpf,
    phone,
    setPhone,
    email,
    setEmail,
    isLoading,
    showPaymentForm,
    handleSubmitProfile,
    handlePayment,
  } = useCheckoutState(session, eventId, selectedBatch);

  const isLoading = isLoadingEventData || isLoadingBatch || !selectedBatch;

  if (isLoading) {
    return (
      <CheckoutLayout>
        <div className="flex items-center justify-center min-h-[300px]">
          <p>Carregando informações de checkout...</p>
        </div>
      </CheckoutLayout>
    );
  }

  if (!event || !selectedBatch) {
    return (
      <CheckoutLayout>
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-red-500">Evento ou lote não encontrado</p>
        </div>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout>
      <CheckoutContent
        event={event}
        batch={selectedBatch}
        quantity={quantity}
        name={name}
        cpf={cpf}
        phone={phone}
        email={email}
        isLoading={isLoading}
        showPaymentForm={showPaymentForm}
        onNameChange={setName}
        onCpfChange={setCpf}
        onPhoneChange={setPhone}
        onEmailChange={setEmail}
        onSubmitProfile={handleSubmitProfile}
        onSubmitPayment={handlePayment}
      />
    </CheckoutLayout>
  );
};

export default CheckoutFinish;
