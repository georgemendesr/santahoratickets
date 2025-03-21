
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UsePaymentPollingProps {
  preferenceId: string | undefined | null;
  payment_id: string | null;
  reference: string | null;
  status: string | null;
  navigate: (path: string) => void;
}

export const usePaymentPolling = ({
  preferenceId,
  payment_id,
  reference,
  status: initialStatus,
  navigate
}: UsePaymentPollingProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isPolling, setIsPolling] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleStatusChange = useCallback((newStatus: string) => {
    console.log("Mudança de status detectada:", newStatus, "Status atual:", currentStatus);
    
    if (newStatus === currentStatus) {
      console.log("Status já está atualizado, ignorando");
      return;
    }

    setCurrentStatus(newStatus);
    
    if (newStatus === "approved") {
      toast.success("Pagamento aprovado!");
      setIsPolling(false);
      window.location.href = `/payment-status?status=approved&payment_id=${payment_id}&external_reference=${reference}`;
    } else if (newStatus === "rejected") {
      toast.error("Pagamento rejeitado");
      setIsPolling(false);
      window.location.href = `/payment-status?status=rejected&payment_id=${payment_id}&external_reference=${reference}`;
    }
  }, [payment_id, reference, currentStatus]);

  useEffect(() => {
    let channel: any;
    let pollingInterval: NodeJS.Timeout;

    const fetchPixData = async () => {
      if (!preferenceId) {
        setIsLoading(false);
        return;
      }

      console.log("Buscando dados do PIX para preferenceId:", preferenceId);
      setIsLoading(true);
      
      try {
        const { data: preference, error } = await supabase
          .from("payment_preferences")
          .select("*")
          .eq("id", preferenceId)
          .single();

        if (error) {
          console.error("Erro ao buscar preferência:", error);
          setError("Erro ao buscar dados do pagamento");
          setIsLoading(false);
          return;
        }

        console.log("Dados da preferência encontrados:", preference);

        if (preference?.payment_type === "pix") {
          console.log("QR Code encontrado:", {
            qr_code: preference.qr_code,
            qr_code_base64: preference.qr_code_base64,
            status: preference.status
          });
          
          setQrCode(preference.qr_code || null);
          setQrCodeBase64(preference.qr_code_base64 || null);

          if (preference.status !== "pending" && preference.status !== currentStatus) {
            handleStatusChange(preference.status);
          }
          
          // Se não tiver QR code e status ainda for pending, tentar novamente a geração
          if ((!preference.qr_code || !preference.qr_code_base64) && preference.status === "pending") {
            console.log("QR Code não encontrado, tentando regenerar...");
            await regeneratePixPayment(preferenceId);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do PIX:", error);
        setError("Erro ao carregar dados do pagamento");
        setIsLoading(false);
      }
    };

    const regeneratePixPayment = async (prefId: string) => {
      setAttempts(prev => prev + 1);
      
      try {
        // Chamar o edge function para regenerar o pagamento PIX
        const { data, error } = await supabase.functions.invoke("create-payment", {
          body: {
            preferenceId: prefId,
            regenerate: true
          }
        });

        if (error) {
          console.error("Erro ao regenerar pagamento PIX:", error);
          setError("Não foi possível gerar o código PIX. Por favor, tente novamente.");
          setIsLoading(false);
          return;
        }

        console.log("Pagamento PIX regenerado:", data);
        
        if (data && data.data) {
          if (data.data.qr_code && data.data.qr_code_base64) {
            setQrCode(data.data.qr_code);
            setQrCodeBase64(data.data.qr_code_base64);
            setError(null);
          }
        }
        
        // Buscar dados novamente após regeneração
        await fetchPixData();
      } catch (error) {
        console.error("Erro ao tentar regenerar pagamento PIX:", error);
        setError("Erro ao gerar código PIX");
        setIsLoading(false);
      }
    };

    const setupRealtimeSubscription = () => {
      console.log("Configurando inscrição em tempo real para:", preferenceId);
      
      channel = supabase
        .channel('payment_status_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'payment_preferences',
            filter: `id=eq.${preferenceId}`
          },
          (payload) => {
            console.log("Atualização em tempo real recebida:", payload);
            const newStatus = payload.new.status;
            
            if (newStatus !== "pending") {
              handleStatusChange(newStatus);
            }
            
            // Atualizar QR Code se estiver disponível
            if (payload.new.qr_code && payload.new.qr_code_base64) {
              setQrCode(payload.new.qr_code);
              setQrCodeBase64(payload.new.qr_code_base64);
              setIsLoading(false);
              setError(null);
            }
          }
        )
        .subscribe((status) => {
          console.log("Status da inscrição:", status);
        });
    };

    // Executa apenas se estiver em polling
    if (isPolling) {
      fetchPixData();
      setupRealtimeSubscription();

      // Configurar polling manual como backup
      pollingInterval = setInterval(() => {
        if (isPolling && attempts < 5) {
          console.log("Executando polling manual...");
          fetchPixData();
        } else if (attempts >= 5 && !qrCode) {
          // Se após 5 tentativas ainda não tiver o QR code, mostra erro
          setError("Não foi possível gerar o código PIX após várias tentativas. Por favor, tente novamente.");
          setIsPolling(false);
          setIsLoading(false);
          clearInterval(pollingInterval);
        }
      }, 5000); // A cada 5 segundos
    }

    return () => {
      if (channel) {
        console.log("Limpando inscrição de tempo real");
        supabase.removeChannel(channel);
      }
      clearInterval(pollingInterval);
    };
  }, [preferenceId, handleStatusChange, currentStatus, isPolling, attempts]);

  return {
    qrCode,
    qrCodeBase64,
    isLoading,
    error
  };
};
