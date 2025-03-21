
import { useState, useEffect, useCallback } from "react";
import { usePixData } from "./usePixData";
import { usePaymentStatus } from "./usePaymentStatus";
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
  // Estado para controlar se o QR code foi carregado
  const [qrCodeLoaded, setQrCodeLoaded] = useState<boolean>(false);
  const [fallbackQrUsed, setFallbackQrUsed] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [manualRetry, setManualRetry] = useState<boolean>(false);
  
  // Verificação de cache com validação
  useEffect(() => {
    try {
      console.log("Verificando cache local de pagamento");
      const cachedPixData = localStorage.getItem('pixPaymentData');
      
      if (cachedPixData) {
        const parsedData = JSON.parse(cachedPixData);
        
        if (preferenceId && parsedData.preferenceId === preferenceId) {
          const dataAge = Date.now() - parsedData.timestamp;
          
          if (dataAge > 1000 * 60 * 30) {  // 30 minutos
            console.log("Dados de cache expirados", { idade: dataAge / 1000 / 60 + " minutos" });
            localStorage.removeItem('pixPaymentData');
          } else {
            console.log("Usando dados PIX do cache", { idade: dataAge / 1000 / 60 + " minutos" });
            if (parsedData.usingFallback) {
              setFallbackQrUsed(true);
            }
          }
        }
      }
    } catch (error) {
      console.error("Falha ao processar cache:", error);
      localStorage.removeItem('pixPaymentData');
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
  } = usePixData({ 
    preferenceId,
    forceRefresh: manualRetry 
  });

  // Reset manual retry flag after refresh
  useEffect(() => {
    if (manualRetry && !isLoading) {
      setManualRetry(false);
    }
  }, [isLoading, manualRetry]);

  // Salvar dados válidos no cache
  useEffect(() => {
    if (qrCode && preferenceId) {
      try {
        console.log("Salvando código PIX no cache");
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
        console.error("Falha ao salvar cache:", error);
      }
    }
  }, [qrCode, qrCodeBase64, preferenceId, fallbackQrUsed]);

  // Retry automaticamente se não conseguir carregar o QR code
  useEffect(() => {
    if (error && !qrCode && retryCount < 3 && !isLoading) {
      const timer = setTimeout(() => {
        console.log(`Tentativa ${retryCount + 1} de 3 para carregar o QR code...`);
        setRetryCount(prev => prev + 1);
        refreshPixData();
        toast.info("Tentando gerar o QR code novamente...");
      }, 2000 * (retryCount + 1)); // Backoff exponencial
      
      return () => clearTimeout(timer);
    }
  }, [error, qrCode, retryCount, isLoading, refreshPixData]);

  // Callback otimizado para atualizar o QR code
  const handleRefreshPixData = useCallback(() => {
    console.log("Solicitando atualização completa dos dados PIX");
    setQrCodeLoaded(false);
    setFallbackQrUsed(false);
    setRetryCount(0);
    setManualRetry(true);
    refreshPixData();
    
    // Feedback para o usuário
    toast.info("Tentando gerar QR code novamente...");
  }, [refreshPixData]);

  // Notificar quando o QR code for carregado com sucesso
  useEffect(() => {
    if (qrCode && !qrCodeLoaded) {
      console.log("QR code carregado com sucesso");
      setQrCodeLoaded(true);
      toast.success("Código de pagamento gerado com sucesso");
      
      if (!qrCodeBase64) {
        toast.warning("QR code disponível apenas como texto. Use a opção Copia e Cola.");
      }
    }
  }, [qrCode, qrCodeBase64, qrCodeLoaded]);

  // Limpeza de dados em caso de problemas
  useEffect(() => {
    return () => {
      if (error) {
        console.log("Limpando cache devido a erros");
        try {
          localStorage.removeItem('pixPaymentData');
        } catch (e) {
          console.error("Falha ao limpar cache:", e);
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
      console.log("Dados insuficientes, redirecionando para home");
      toast.error("Dados de pagamento incompletos");
      navigate("/");
    }
  }, [initialStatus, preferenceId, payment_id, navigate]);

  // Log do estado atual
  useEffect(() => {
    console.log("Estado atual do sistema de pagamento:", {
      qrCode: qrCode ? "Presente" : "Ausente",
      qrCodeBase64: qrCodeBase64 ? "Presente" : "Ausente",
      isLoading,
      error: error || "Nenhum",
      paymentId: payment_id,
      pollingActive: isPolling,
      qrCodeLoaded,
      fallbackQrUsed,
      retryCount,
      manualRetry
    });
  }, [qrCode, qrCodeBase64, isLoading, error, payment_id, isPolling, qrCodeLoaded, fallbackQrUsed, retryCount, manualRetry]);

  // Determinar o erro a mostrar para o usuário
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
    fallbackQrUsed,
    retryCount
  };
};
