import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UsePixRegenerationProps {
  coreState: ReturnType<typeof import("./usePixDataCore").usePixDataCore>;
  forceRefresh?: boolean;
}

/**
 * Hook para gerenciar a regeneração de códigos PIX
 */
export const usePixRegeneration = ({ 
  coreState, 
  forceRefresh = false 
}: UsePixRegenerationProps) => {
  const {
    setQrCode,
    setQrCodeBase64,
    setCurrentStatus,
    setIsLoading,
    setError,
    attempts,
    setAttempts,
    lastAttemptTime,
    setLastAttemptTime,
    setRetryTimeoutId,
    environment
  } = coreState;

  // Função para regenerar o pagamento PIX com limitação de taxa
  const regeneratePixPayment = useCallback(async (preferenceId: string) => {
    // Verificar se já houve muitas tentativas recentes
    const now = Date.now();
    if (now - lastAttemptTime < 3000 && attempts > 0 && !forceRefresh) {
      console.log("Esperando intervalo entre tentativas...");
      return;
    }
    
    // Verificar limite de tentativas (ignora se for forceRefresh)
    if (attempts >= 3 && !forceRefresh) {
      console.log("Máximo de tentativas atingido");
      setError("Não foi possível gerar o QR Code após várias tentativas. Por favor, tente novamente mais tarde.");
      setIsLoading(false);
      return;
    }
    
    setLastAttemptTime(now);
    setAttempts(prev => prev + 1);
    setError(null);
    setIsLoading(true);
    
    try {
      console.log(`Tentativa ${attempts + 1} de regenerar pagamento PIX:`, preferenceId);
      console.log("Modo de ambiente:", environment === "test" ? "TESTE" : "PRODUÇÃO");
      
      // Chamar o edge function para regenerar o pagamento PIX
      const { data, error: invokeError } = await supabase.functions.invoke("create-payment", {
        body: {
          preferenceId,
          regenerate: true,
          useTestCredentials: environment === "test" // Passar flag para API
        }
      });

      if (invokeError) {
        console.error("Erro ao regenerar pagamento PIX:", invokeError);
        throw invokeError;
      }

      console.log("Resposta da regeneração PIX:", data);
      
      if (!data) {
        throw new Error("Resposta vazia do servidor");
      }
      
      if (data.error) {
        throw new Error(data.message || "Erro no servidor ao processar pagamento");
      }
      
      if (data && data.data) {
        if (data.data.qr_code) {
          setQrCode(data.data.qr_code);
        }
        if (data.data.qr_code_base64) {
          setQrCodeBase64(data.data.qr_code_base64);
        }
        if (data.status) {
          setCurrentStatus(data.status);
        }
        
        // Mesmo se tivermos apenas o código PIX (sem o QR), é melhor do que nada
        if (data.data.qr_code && !data.data.qr_code_base64) {
          setError("O código PIX foi gerado, mas não foi possível criar a imagem QR. Você pode copiar o código manualmente.");
        } else {
          setError(null);
        }
        
        setIsLoading(false);
      } else {
        throw new Error("Dados de PIX não retornados pelo servidor");
      }
    } catch (error: any) {
      console.error("Erro ao tentar regenerar pagamento PIX:", error);
      
      let errorMessage = "Erro ao gerar código PIX. ";
      
      // Tentar extrair mensagem de erro mais específica
      if (error.message) {
        // Remover referência à coluna inexistente no erro
        if (error.message.includes("organizer_name does not exist")) {
          errorMessage += "Erro ao processar dados do evento. Por favor, contate o suporte.";
        } else if (error.message.includes("Edge Function returned a non-2xx status code")) {
          errorMessage += "O servidor não conseguiu processar a solicitação.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "Tente novamente ou use outro método de pagamento.";
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      // Tentar novamente automaticamente após um tempo (exceto se for forceRefresh)
      if (attempts < 3 && !forceRefresh) {
        const backoffTime = Math.min(3000 * Math.pow(1.5, attempts), 10000); // Backoff exponencial com limite de 10s
        console.log(`Agendando nova tentativa em ${backoffTime/1000}s`);
        
        const timeoutId = window.setTimeout(() => {
          console.log("Tentando novamente automaticamente...");
          regeneratePixPayment(preferenceId);
        }, backoffTime);
        setRetryTimeoutId(timeoutId);
      }
    }
  }, [attempts, lastAttemptTime, forceRefresh, environment, setQrCode, setQrCodeBase64, setCurrentStatus, setError, setIsLoading, setAttempts, setLastAttemptTime, setRetryTimeoutId]);

  return {
    regeneratePixPayment
  };
};
