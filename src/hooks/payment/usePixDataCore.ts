
import { useState, useCallback } from "react";

interface UsePixDataCoreProps {
  useTestCredentials?: boolean;
}

/**
 * Hook central para gerenciar o estado principal dos dados PIX
 */
export const usePixDataCore = ({ useTestCredentials = false }: UsePixDataCoreProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const [retryTimeoutId, setRetryTimeoutId] = useState<number | null>(null);
  const [environment, setEnvironment] = useState<"test" | "production">(useTestCredentials ? "test" : "production");

  // Função para alternar entre ambiente de teste e produção
  const toggleEnvironment = useCallback(() => {
    const newTestMode = environment === "production";
    console.log(`Alternando para modo ${newTestMode ? "TESTE" : "PRODUÇÃO"}`);
    setEnvironment(newTestMode ? "test" : "production");
  }, [environment]);

  // Função para reiniciar estado para nova tentativa
  const resetForRetry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setAttempts(0);
  }, []);

  // Função para atualizar informações do PIX
  const updatePixInfo = useCallback((pixData: any) => {
    if (pixData?.data?.qr_code) {
      setQrCode(pixData.data.qr_code);
    }
    
    if (pixData?.data?.qr_code_base64) {
      setQrCodeBase64(pixData.data.qr_code_base64);
    }
    
    if (pixData?.status) {
      setCurrentStatus(pixData.status);
    }
    
    if (pixData?.environment) {
      setEnvironment(pixData.environment);
    }
  }, []);

  // Limpar timeout ao desmontar
  const cleanupTimeout = useCallback(() => {
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId);
      setRetryTimeoutId(null);
    }
  }, [retryTimeoutId]);

  return {
    // Estado
    qrCode,
    qrCodeBase64,
    currentStatus,
    isLoading,
    error,
    attempts,
    lastAttemptTime,
    retryTimeoutId,
    environment,
    
    // Setters
    setQrCode,
    setQrCodeBase64,
    setCurrentStatus,
    setIsLoading,
    setError,
    setAttempts,
    setLastAttemptTime,
    setRetryTimeoutId,
    setEnvironment,
    
    // Funções utilitárias
    toggleEnvironment,
    resetForRetry,
    updatePixInfo,
    cleanupTimeout
  };
};
