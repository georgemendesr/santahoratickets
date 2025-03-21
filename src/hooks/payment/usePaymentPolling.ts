
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
  
  // AUDITORIA: Verificar dados de cache no início
  useEffect(() => {
    try {
      console.log("AUDITORIA PIX: Verificando cache local de pagamento");
      const cachedPixData = localStorage.getItem('pixPaymentData');
      
      if (cachedPixData) {
        const parsedData = JSON.parse(cachedPixData);
        
        // VALIDAÇÃO: Verificar se os dados em cache contêm informações suspeitas
        if (parsedData.qrCode && 
            (parsedData.qrCode.includes("Gustavo") || 
             parsedData.qrCode.includes("Araújo") || 
             parsedData.qrCode.includes("BORA PAGODEAR"))) {
          
          console.error("ERRO PIX: Dados suspeitos encontrados no cache. Limpando cache.");
          localStorage.removeItem('pixPaymentData');
        } else if (preferenceId && parsedData.preferenceId === preferenceId) {
          const dataAge = Date.now() - parsedData.timestamp;
          
          if (dataAge > 1000 * 60 * 30) {  // 30 minutos
            console.log("AUDITORIA PIX: Dados de cache expirados", { idade: dataAge / 1000 / 60 + " minutos" });
            localStorage.removeItem('pixPaymentData');
          } else {
            console.log("AUDITORIA PIX: Usando dados PIX do cache", { idade: dataAge / 1000 / 60 + " minutos" });
            if (parsedData.usingFallback) {
              setFallbackQrUsed(true);
            }
          }
        }
      }
    } catch (error) {
      console.error("ERRO PIX: Falha ao processar cache:", error);
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
  } = usePixData({ preferenceId });

  // AUDITORIA: Validar e salvar dados no cache
  useEffect(() => {
    if (qrCode && preferenceId) {
      try {
        console.log("AUDITORIA PIX: Validando código PIX antes de salvar no cache");
        
        // VALIDAÇÃO: Verificar se o código PIX contém dados suspeitos
        if (qrCode.includes("Gustavo") || 
            qrCode.includes("Araújo") || 
            qrCode.includes("BORA PAGODEAR")) {
          
          console.error("ERRO PIX: Código PIX com dados suspeitos. Não será salvo no cache.");
        } else {
          console.log("AUDITORIA PIX: Salvando código PIX válido no cache");
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
        }
      } catch (error) {
        console.error("ERRO PIX: Falha ao salvar cache:", error);
      }
    }
  }, [qrCode, qrCodeBase64, preferenceId, fallbackQrUsed]);

  // Callback otimizado para atualizar o QR code
  const handleRefreshPixData = useCallback(() => {
    console.log("AUDITORIA PIX: Solicitando atualização completa dos dados PIX");
    setQrCodeLoaded(false);
    setFallbackQrUsed(false);
    refreshPixData();
  }, [refreshPixData]);

  // Notificar quando o QR code for carregado com sucesso
  useEffect(() => {
    if (qrCode && !qrCodeLoaded) {
      console.log("AUDITORIA PIX: QR code carregado com sucesso");
      setQrCodeLoaded(true);
    }
  }, [qrCode, qrCodeLoaded]);

  // AUDITORIA: Limpeza de dados em caso de problemas
  useEffect(() => {
    return () => {
      if (error) {
        console.log("AUDITORIA PIX: Limpando cache devido a erros");
        try {
          localStorage.removeItem('pixPaymentData');
        } catch (e) {
          console.error("ERRO PIX: Falha ao limpar cache:", e);
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
      console.log("AUDITORIA PIX: Dados insuficientes, redirecionando para home");
      navigate("/");
    }
  }, [initialStatus, preferenceId, payment_id, navigate]);

  // AUDITORIA: Log detalhado do estado atual
  useEffect(() => {
    console.log("AUDITORIA PIX: Estado atual do sistema de pagamento:", {
      qrCode: qrCode ? "Presente" : "Ausente",
      qrCodeBase64: qrCodeBase64 ? "Presente" : "Ausente",
      isLoading,
      error: error || "Nenhum",
      paymentId: payment_id,
      pollingActive: isPolling,
      qrCodeLoaded,
      fallbackQrUsed
    });
  }, [qrCode, qrCodeBase64, isLoading, error, payment_id, isPolling, qrCodeLoaded, fallbackQrUsed]);

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
    fallbackQrUsed
  };
};
