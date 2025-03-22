
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePixData } from "./usePixData";
import { usePaymentStatus } from "./usePaymentStatus";

interface UsePaymentPollingProps {
  preferenceId?: string | null;
  payment_id?: string | null;
  reference?: string | null;
  status?: string | null;
  navigate?: ReturnType<typeof useNavigate>;
  useTestCredentials?: boolean;
}

export const usePaymentPolling = ({
  preferenceId,
  payment_id,
  reference,
  status: initialStatus,
  navigate,
  useTestCredentials = false
}: UsePaymentPollingProps) => {
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);
  const [fallbackQrUsed, setFallbackQrUsed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [qrErrorCount, setQrErrorCount] = useState(0);

  // Usar hook de PixData para obter dados do PIX
  const {
    qrCode,
    qrCodeBase64,
    currentStatus,
    isLoading,
    error,
    setCurrentStatus,
    refreshPixData,
    environment,
    toggleEnvironment
  } = usePixData({
    preferenceId,
    forceRefresh: false,
    useTestCredentials
  });

  // Usar hook de status para verificar alterações de status
  const { isPolling } = usePaymentStatus({
    preferenceId,
    payment_id,
    reference,
    initialStatus,
    currentStatus,
    setCurrentStatus
  });

  // Efeito para detectar carregamento do QR code
  useEffect(() => {
    if (qrCode || qrCodeBase64) {
      setQrCodeLoaded(true);
    }
  }, [qrCode, qrCodeBase64]);

  // Função para tentar novamente com reinicialização de contadores
  const handleManualRefresh = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setQrErrorCount(0);
    refreshPixData();
  }, [refreshPixData]);

  // Retornar dados e funções para o componente
  return {
    qrCode,
    qrCodeBase64,
    isLoading,
    error,
    refreshPixData: handleManualRefresh,
    qrCodeLoaded,
    fallbackQrUsed,
    retryCount,
    environment,
    toggleEnvironment
  };
};
