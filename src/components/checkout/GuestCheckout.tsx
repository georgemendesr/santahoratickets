
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "./CustomerForm";
import { OrderSummary } from "./OrderSummary";
import { Event, Batch } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCardForm } from "./credit-card/CreditCardForm";
import { PIXForm } from "./payment/PIXForm";
import { ParticipantsForm } from "./ParticipantsForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { validateCPF, validatePhone } from "@/utils/validation";

interface GuestCheckoutProps {
  event: Event;
  batch: Batch;
  quantity: number;
}

export function GuestCheckout({ event, batch, quantity }: GuestCheckoutProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [participants, setParticipants] = useState<Array<{name: string, cpf: string}>>([]);

  const handleParticipantChange = (index: number, field: 'name' | 'cpf', value: string) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };
    setParticipants(updatedParticipants);
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !cpf || !phone || !email) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!validateCPF(cpf)) {
      toast.error("CPF inválido");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Telefone inválido");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("E-mail inválido");
      return;
    }

    // Validar participantes para compras acima de 1 ingresso
    if (quantity > 1) {
      if (participants.length < quantity - 1) {
        toast.error("Preencha os dados de todos os participantes");
        return;
      }

      for (const participant of participants) {
        if (!participant.name || !validateCPF(participant.cpf)) {
          toast.error("Dados de participantes inválidos");
          return;
        }
      }
    }

    setShowPaymentForm(true);
  };

  const handlePayment = async (paymentData: {
    token?: string;
    installments?: number;
    paymentMethodId: string;
    paymentType: "credit_card" | "pix";
  }) => {
    setIsLoading(true);
    let toastId = toast.loading("Processando pagamento...");

    try {
      console.log("Iniciando checkout como convidado para o evento:", event.id);

      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          isGuestCheckout: true,
          eventId: event.id,
          batchId: batch.id,
          ticketQuantity: quantity,
          totalAmount: batch.price * quantity,
          paymentType: paymentData.paymentType,
          paymentMethodId: paymentData.paymentMethodId,
          guestInfo: {
            name,
            email,
            cpf,
            phone
          },
          participants: quantity > 1 ? participants : [],
          ...(paymentData.paymentType === "credit_card" ? {
            cardToken: paymentData.token,
            installments: paymentData.installments,
          } : {})
        }
      });

      if (error) {
        console.error("Erro na resposta da Edge Function:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Resposta vazia do servidor");
      }

      console.log("Resposta do processamento:", data);
      const { status, payment_id } = data;
      const preferenceId = payment_id; // No caso do PIX, o payment_id pode ser usado como identificador

      toast.dismiss(toastId);
      
      if (status === "rejected") {
        toast.error("Pagamento não aprovado. Por favor, tente novamente.");
        return;
      }

      navigate(`/payment-status?status=${status}&payment_id=${payment_id}&external_reference=${event.id}|${preferenceId}&isGuest=true`);
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      toast.dismiss(toastId);
      toast.error(error.message || "Erro ao processar seu pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card shadow-2xl">
      <CardHeader className="border-b border-border/50 pb-6 bg-gradient-to-r from-purple-500/10 to-amber-500/10">
        <CardTitle className="text-2xl md:text-3xl font-medium tracking-tight">
          Finalizar Compra - {event.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="space-y-8 py-4">
          <OrderSummary 
            event={event}
            batch={batch}
            quantity={quantity}
          />

          {!showPaymentForm ? (
            <div className="space-y-8">
              <CustomerForm
                name={name}
                cpf={cpf}
                phone={phone}
                email={email}
                isLoading={isLoading}
                onNameChange={setName}
                onCpfChange={setCpf}
                onPhoneChange={setPhone}
                onEmailChange={setEmail}
                onSubmit={handleSubmitProfile}
              />
              
              {quantity > 1 && (
                <ParticipantsForm
                  quantity={quantity - 1}
                  participants={participants}
                  onChange={handleParticipantChange}
                />
              )}
            </div>
          ) : (
            <div className="pt-6 border-t border-border/50">
              <Tabs defaultValue="pix" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="credit_card" className="text-base">
                    Cartão de Crédito
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="text-base">
                    PIX
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="credit_card" className="mt-4 space-y-6">
                  <CreditCardForm
                    amount={batch.price * quantity}
                    onSubmit={(data) => handlePayment({ ...data, paymentType: "credit_card" })}
                    isSubmitting={isLoading}
                  />
                </TabsContent>
                <TabsContent value="pix" className="mt-4 space-y-6">
                  <PIXForm
                    amount={batch.price * quantity}
                    onSubmit={() => handlePayment({ paymentMethodId: "pix", paymentType: "pix" })}
                    isSubmitting={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
