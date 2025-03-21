
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UsePixDataProps {
  preferenceId: string | undefined | null;
}

export const usePixData = ({ preferenceId }: UsePixDataProps) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);

  // Função para regenerar o pagamento PIX com limitação de taxa
  const regeneratePixPayment = useCallback(async (prefId: string) => {
    // Verificar se já houve muitas tentativas recentes
    const now = Date.now();
    if (now - lastAttemptTime < 3000 && attempts > 0) {
      console.log("Esperando intervalo entre tentativas...");
      return;
    }
    
    // Verificar limite de tentativas
    if (attempts >= 3) {
      console.log("Máximo de tentativas atingido");
      setError("Não foi possível gerar o QR Code após várias tentativas. Por favor, tente novamente mais tarde.");
      setIsLoading(false);
      return;
    }
    
    setLastAttemptTime(now);
    setAttempts(prev => prev + 1);
    
    try {
      console.log(`Tentativa ${attempts + 1} de regenerar pagamento PIX:`, prefId);
      
      // Chamar o edge function para regenerar o pagamento PIX
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          preferenceId: prefId,
          regenerate: true
        }
      });

      if (error) {
        console.error("Erro ao regenerar pagamento PIX:", error);
        throw error;
      }

      console.log("Resposta da regeneração PIX:", data);
      
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
    } catch (error) {
      console.error("Erro ao tentar regenerar pagamento PIX:", error);
      setError("Erro ao gerar código PIX. Você pode tentar novamente ou usar outro método de pagamento.");
      setIsLoading(false);
    }
  }, [attempts, lastAttemptTime]);

  // Função para buscar dados do PIX
  const fetchPixData = useCallback(async () => {
    if (!preferenceId) {
      setIsLoading(false);
      return;
    }

    console.log("Buscando dados do PIX para preferenceId:", preferenceId);
    
    try {
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
    } catch (error) {
      console.error("Erro ao buscar dados do PIX:", error);
      setError("Erro ao carregar dados do pagamento");
      setIsLoading(false);
    }
  }, [preferenceId, regeneratePixPayment]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    fetchPixData();
  }, [fetchPixData]);

  // Função para forçar atualização
  const refreshPixData = () => {
    setIsLoading(true);
    setError(null);
    fetchPixData();
  };

  return {
    qrCode,
    qrCodeBase64,
    currentStatus,
    isLoading,
    error,
    setCurrentStatus,
    refreshPixData
  };
};
