import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UsePixFetchProps {
  coreState: ReturnType<typeof import("./usePixDataCore").usePixDataCore>;
  regeneratePixPayment: (preferenceId: string) => Promise<void>;
  forceRefresh?: boolean;
}

/**
 * Hook para buscar dados PIX iniciais
 */
export const usePixFetch = ({ 
  coreState, 
  regeneratePixPayment, 
  forceRefresh = false 
}: UsePixFetchProps) => {
  const {
    setQrCode,
    setQrCodeBase64,
    setCurrentStatus,
    setIsLoading,
    setError,
    setRetryTimeoutId,
    environment
  } = coreState;

  // Função para buscar dados do PIX
  const fetchPixData = useCallback(async (preferenceId: string | null | undefined) => {
    if (!preferenceId) {
      setIsLoading(false);
      return;
    }

    console.log("Buscando dados do PIX para preferenceId:", preferenceId);
    console.log("Modo de ambiente:", environment === "test" ? "TESTE" : "PRODUÇÃO");
    
    try {
      // Forçar regeneração se solicitado
      if (forceRefresh) {
        console.log("Força de atualização detectada, regenerando PIX...");
        await regeneratePixPayment(preferenceId);
        return;
      }
      
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
          qr_code: preference.qr_code ? "✅" : "❌",
          qr_code_base64: preference.qr_code_base64 ? "✅" : "❌",
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
        
        // Se não tiver QR code completo e status ainda for pending, tentar regenerar
        if ((!preference.qr_code || !preference.qr_code_base64) && preference.status === "pending") {
          console.log("QR Code incompleto, tentando regenerar...");
          await regeneratePixPayment(preferenceId);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Erro ao buscar dados do PIX:", error);
      
      let errorMessage = "Erro ao carregar dados do pagamento: ";
      
      if (error.message) {
        if (error.message.includes("Edge Function returned a non-2xx status code")) {
          errorMessage += "Falha na comunicação com o servidor.";
        } else {
          errorMessage += error.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      // Tentar novamente automaticamente após um tempo (exceto se for forceRefresh)
      if (!forceRefresh) {
        const timeoutId = window.setTimeout(() => {
          console.log("Tentando buscar dados novamente...");
          fetchPixData(preferenceId);
        }, 5000);
        setRetryTimeoutId(timeoutId);
      }
    }
  }, [forceRefresh, regeneratePixPayment, environment, setQrCode, setQrCodeBase64, setCurrentStatus, setError, setIsLoading, setRetryTimeoutId]);

  return {
    fetchPixData
  };
};
