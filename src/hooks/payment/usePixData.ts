
import { useEffect, useCallback } from "react";
import { usePixDataCore } from "./usePixDataCore";
import { usePixRegeneration } from "./usePixRegeneration";
import { usePixFetch } from "./usePixFetch";

interface UsePixDataProps {
  preferenceId: string | undefined | null;
  forceRefresh?: boolean;
  useTestCredentials?: boolean;
}

/**
 * Hook principal para gerenciar dados PIX
 * Este hook agora atua como um compositor de outros hooks menores e mais focados
 */
export const usePixData = ({ 
  preferenceId, 
  forceRefresh = false, 
  useTestCredentials = false 
}: UsePixDataProps) => {
  // Gerenciamento de estado central
  const coreState = usePixDataCore({ useTestCredentials });
  
  // Extrair funções e estado necessários
  const { 
    cleanupTimeout, 
    resetForRetry,
    qrCode,
    qrCodeBase64,
    currentStatus,
    isLoading,
    error,
    environment,
    setCurrentStatus,
    retryTimeoutId,
    toggleEnvironment
  } = coreState;
  
  // Hook para regeneração de PIX
  const { regeneratePixPayment } = usePixRegeneration({ 
    coreState, 
    forceRefresh 
  });
  
  // Hook para busca de dados PIX
  const { fetchPixData } = usePixFetch({ 
    coreState, 
    regeneratePixPayment, 
    forceRefresh 
  });
  
  // Efeito para carregar dados iniciais
  useEffect(() => {
    fetchPixData(preferenceId);
    
    // Cleanup ao desmontar
    return cleanupTimeout;
  }, [fetchPixData, preferenceId, cleanupTimeout]);
  
  // Função para forçar atualização
  const refreshPixData = useCallback(() => {
    resetForRetry();
    fetchPixData(preferenceId);
  }, [fetchPixData, preferenceId, resetForRetry]);
  
  // Retornar apenas o que é necessário para a interface pública
  return {
    qrCode,
    qrCodeBase64,
    currentStatus,
    isLoading,
    error,
    environment,
    setCurrentStatus,
    refreshPixData,
    toggleEnvironment
  };
};
