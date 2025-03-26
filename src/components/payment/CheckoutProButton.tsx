
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { processCheckoutPro } from "@/hooks/checkout/usePaymentPreference";
import { toast } from "sonner";

interface CheckoutProButtonProps {
  eventId: string;
  batch: any;
  session: Session | null;
  isGuest?: boolean;
  guestInfo?: {
    name: string;
    email: string;
    cpf: string;
    phone?: string;
  };
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CheckoutProButton({
  eventId,
  batch,
  session,
  isGuest = false,
  guestInfo,
  className = "",
  variant = "default",
  size = "default"
}: CheckoutProButtonProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    // Se não estiver em modo convidado e não estiver logado, redirecionar para login
    if (!isGuest && !session) {
      navigate(`/auth?redirect=/event/${eventId}`);
      return;
    }

    // Se estiver em modo convidado mas não tiver informações do convidado
    if (isGuest && !guestInfo) {
      toast.error("Informações do comprador são necessárias para prosseguir");
      return;
    }

    try {
      console.log("Iniciando checkout com Mercado Pago para o evento:", eventId);
      setIsLoading(true);
      const toastId = toast.loading("Processando pagamento...");

      // Processar checkout usando o Mercado Pago Checkout Pro
      const { checkoutUrl } = await processCheckoutPro(
        eventId,
        session,
        batch,
        isGuest ? guestInfo : undefined
      );

      toast.dismiss(toastId);
      
      console.log("Checkout URL recebida:", checkoutUrl);
      
      // Redirecionar para a página de checkout do Mercado Pago
      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error("Erro ao iniciar checkout:", error);
      toast.error(error.message || "Erro ao processar pagamento");
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
      variant={variant}
      size={size}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ExternalLink className="mr-2 h-4 w-4" />
      )}
      {isGuest ? "Pagar como Convidado" : "Pagar com Mercado Pago"}
    </Button>
  );
}
