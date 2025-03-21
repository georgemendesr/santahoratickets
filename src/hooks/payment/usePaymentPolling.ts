
import { useState, useEffect, useCallback } from "react";
import { usePixData } from "./usePixData";
import { usePaymentStatus } from "./usePaymentStatus";

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
  // Estado para controlar se o QR code foi carregado
  const [qrCodeLoaded, setQrCodeLoaded] = useState<boolean>(false);
  const [fallbackQrUsed, setFallbackQrUsed] = useState<boolean>(false);
  
  // Verificar o cache do browser por dados PIX já carregados
  useEffect(() => {
    try {
      const cachedPixData = localStorage.getItem('pixPaymentData');
      if (cachedPixData && preferenceId) {
        const parsedData = JSON.parse(cachedPixData);
        if (parsedData.preferenceId === preferenceId && 
            parsedData.qrCode && 
            Date.now() - parsedData.timestamp < 1000 * 60 * 10) { // Válido por 10 minutos
          console.log("Usando dados PIX em cache");
          // Verificar se estamos usando dados de fallback
          if (parsedData.usingFallback) {
            setFallbackQrUsed(true);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao ler cache PIX:", error);
    }
  }, [preferenceId]);
  
  // Obter dados do PIX com revalidação automática
  const {
    qrCode,
    qrCodeBase64,
    currentStatus,
    isLoading,
    error,
    setCurrentStatus,
    refreshPixData
  } = usePixData({ preferenceId });

  // Salvar dados no cache do browser quando disponíveis
  useEffect(() => {
    if (qrCode && preferenceId) {
      try {
        localStorage.setItem('pixPaymentData', JSON.stringify({
          preferenceId,
          qrCode,
          qrCodeBase64,
          usingFallback: !qrCodeBase64 && qrCode,
          timestamp: Date.now()
        }));
        
        // Se temos o código PIX mas não o QR Code base64, estamos usando fallback
        if (!qrCodeBase64 && qrCode && !fallbackQrUsed) {
          setFallbackQrUsed(true);
        }
      } catch (error) {
        console.error("Erro ao salvar cache PIX:", error);
      }
    }
  }, [qrCode, qrCodeBase64, preferenceId, fallbackQrUsed]);

  // Callback otimizado para atualizar o QR code
  const handleRefreshPixData = useCallback(() => {
    setQrCodeLoaded(false);
    setFallbackQrUsed(false);
    refreshPixData();
  }, [refreshPixData]);

  // Notificar quando o QR code for carregado com sucesso
  useEffect(() => {
    if (qrCode && !qrCodeLoaded) {
      setQrCodeLoaded(true);
      console.log("QR code carregado com sucesso");
    }
  }, [qrCode, qrCodeLoaded]);

  // Limpar cache ao desmontar para casos de problema
  useEffect(() => {
    return () => {
      // Manter o cache para reutilização, limpar apenas em caso específico
      if (error) {
        try {
          localStorage.removeItem('pixPaymentData');
        } catch (e) {
          console.error("Erro ao limpar cache PIX:", e);
        }
      }
    };
  }, [error]);

  // Configurar monitoramento de status de pagamento
  const { isPolling } = usePaymentStatus({
    preferenceId,
    payment_id,
    reference,
    initialStatus,
    currentStatus,
    setCurrentStatus
  });

  // Redirecionar para home se não houver status ou preferenceId
  useEffect(() => {
    if ((!initialStatus && !preferenceId) || (!initialStatus && !payment_id)) {
      navigate("/");
    }
  }, [initialStatus, preferenceId, payment_id, navigate]);

  // Para debugging
  useEffect(() => {
    console.log("usePaymentPolling rendering with:", {
      qrCode: qrCode ? "QR code present" : "No QR code",
      qrCodeBase64: qrCodeBase64 ? "QR base64 present" : "No QR base64",
      isLoading,
      error: error || "No error",
      paymentId: payment_id,
      pollingActive: isPolling,
      qrCodeLoaded,
      fallbackQrUsed
    });
  }, [qrCode, qrCodeBase64, isLoading, error, payment_id, isPolling, qrCodeLoaded, fallbackQrUsed]);

  // Determinar o erro a mostrar para o usuário
  // Se estamos usando fallback com serviço externo, mostrar uma mensagem mais suave
  const userFacingError = fallbackQrUsed 
    ? null  // Não mostrar erro se temos pelo menos o QR code via fallback
    : error;

  return {
    qrCode,
    qrCodeBase64,
    isLoading,
    error: userFacingError,
    refreshPixData: handleRefreshPixData,
    qrCodeLoaded,
    fallbackQrUsed
  };
};
