
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

  // Callback otimizado para atualizar o QR code
  const handleRefreshPixData = useCallback(() => {
    setQrCodeLoaded(false);
    refreshPixData();
  }, [refreshPixData]);

  // Notificar quando o QR code for carregado com sucesso
  useEffect(() => {
    if (qrCodeBase64 && !qrCodeLoaded) {
      setQrCodeLoaded(true);
      console.log("QR code base64 carregado com sucesso");
    }
  }, [qrCodeBase64, qrCodeLoaded]);

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
      qrCodeLoaded
    });
  }, [qrCode, qrCodeBase64, isLoading, error, payment_id, isPolling, qrCodeLoaded]);

  return {
    qrCode,
    qrCodeBase64,
    isLoading,
    error,
    refreshPixData: handleRefreshPixData,
    qrCodeLoaded
  };
};
