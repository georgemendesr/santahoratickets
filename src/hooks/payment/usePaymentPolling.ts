
import { useState, useEffect } from "react";
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
  // Obter dados do PIX
  const {
    qrCode,
    qrCodeBase64,
    currentStatus,
    isLoading,
    error,
    setCurrentStatus,
    refreshPixData
  } = usePixData({ preferenceId });

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
      pollingActive: isPolling
    });
  }, [qrCode, qrCodeBase64, isLoading, error, payment_id, isPolling]);

  return {
    qrCode,
    qrCodeBase64,
    isLoading,
    error,
    refreshPixData
  };
};
