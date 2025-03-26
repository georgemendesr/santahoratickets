
import { useEffect, useState } from "react";

interface PaymentMethod {
  id: string;
  name: string;
  payment_type_id: string;
  status: string;
  secure_thumbnail: string;
  thumbnail: string;
  deferred_capture: string;
}

interface InstallmentOption {
  installments: number;
  installment_amount: number;
  installment_rate: number;
  total_amount: number;
}

export function useMercadoPago(amount: number, cardNumber: string, useTestMode = false) {
  const [isLoading, setIsLoading] = useState(true);
  const [availableInstallments, setAvailableInstallments] = useState<InstallmentOption[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => {
      // Escolher a chave pública correta baseada no modo
      const publicKey = useTestMode 
        ? import.meta.env.VITE_MERCADOPAGO_TEST_PUBLIC_KEY 
        : import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
        
      console.log(`Inicializando MercadoPago com chave ${useTestMode ? 'de TESTE' : 'PADRÃO'}`);
      const mp = new window.MercadoPago(publicKey, {
        locale: 'pt-BR'
      });
      setIsLoading(false);

      // Buscar opções de parcelamento
      if (amount > 0) {
        mp.getInstallments({
          amount: String(amount),
          locale: "pt-BR",
        }).then((installments: any) => {
          console.log("Opções de parcelamento:", installments);
          if (installments && installments[0]) {
            setAvailableInstallments(installments[0].payer_costs);
          }
        }).catch((error: any) => {
          console.error("Erro ao buscar opções de parcelamento:", error);
        });
      }

      // Identificar bandeira do cartão
      if (cardNumber && cardNumber.length >= 6) {
        mp.getPaymentMethods({ bin: cardNumber.substring(0, 6) }).then((paymentMethods: any) => {
          console.log("Métodos de pagamento:", paymentMethods);
          if (paymentMethods && paymentMethods.results && paymentMethods.results[0]) {
            setPaymentMethodId(paymentMethods.results[0].id);
          }
        }).catch((error: any) => {
          console.error("Erro ao identificar bandeira do cartão:", error);
        });
      }
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [amount, cardNumber, useTestMode]);

  return {
    isLoading,
    availableInstallments,
    paymentMethodId,
  };
}
