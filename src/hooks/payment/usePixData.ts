
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UsePixDataProps {
  preferenceId: string | undefined | null;
}

export const usePixData = ({ preferenceId }: UsePixDataProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const fetchPixData = async () => {
      if (!preferenceId) {
        setIsLoading(false);
        return;
      }

      console.log("Buscando dados do PIX para preferenceId:", preferenceId);
      
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
          
          // Atualiza o código PIX se disponível
          if (preference.qr_code) {
            setQrCode(preference.qr_code);
          }
          
          // Atualiza o QR Code Base64 se disponível
          if (preference.qr_code_base64) {
            setQrCodeBase64(preference.qr_code_base64);
          }

          if (preference.status) {
            setCurrentStatus(preference.status);
          }
          
          // Se tiver o código PIX mas não tiver o QR Code, vamos considerar
          // que pelo menos parte do processamento foi bem sucedido
          if (preference.qr_code) {
            setIsLoading(false);
          }
          
          // Se não tiver QR code e status ainda for pending, tentar novamente a geração
          if ((!preference.qr_code || !preference.qr_code_base64) && preference.status === "pending") {
            console.log("QR Code incompleto, tentando regenerar...");
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
          if (data.data.qr_code) {
            setQrCode(data.data.qr_code);
          }
          if (data.data.qr_code_base64) {
            setQrCodeBase64(data.data.qr_code_base64);
          }
          
          // Se pelo menos o código PIX estiver disponível, consideramos um sucesso parcial
          if (data.data.qr_code) {
            setIsLoading(false);
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

    fetchPixData();

    // Configurar polling manual como backup para casos onde não temos dados completos
    const pollingInterval = setInterval(() => {
      if (attempts < 5 && (!qrCodeBase64 || !qrCode)) {
        console.log("Executando polling manual para dados do PIX...");
        fetchPixData();
      } else if (attempts >= 5) {
        // Se após 5 tentativas ainda não tiver o QR code completo, mas tiver o código PIX
        // continuamos exibindo o formulário PIX mesmo sem QR code
        if (!qrCodeBase64 && qrCode) {
          console.log("Não foi possível gerar o QR Code após várias tentativas, mas o código PIX está disponível.");
          setIsLoading(false);
        } 
        // Se nem o código PIX estiver disponível, mostramos erro
        else if (!qrCode) {
          setError("Não foi possível gerar o código PIX após várias tentativas. Por favor, tente novamente.");
          setIsLoading(false);
        }
        
        clearInterval(pollingInterval);
      }
    }, 5000); // A cada 5 segundos

    return () => {
      clearInterval(pollingInterval);
    };
  }, [preferenceId, attempts, qrCode, qrCodeBase64]);

  return {
    qrCode,
    qrCodeBase64,
    currentStatus,
    isLoading,
    error,
    setCurrentStatus
  };
};
