
import { useState, useEffect } from "react";
import { generateValidPixCode, extractNameFromCode } from "@/utils/pixCodeGenerator";

interface UsePixQRCodeLogicProps {
  qrCode: string | null;
  qrCodeBase64: string | null;
  onRefresh?: () => void;
}

export const usePixQRCodeLogic = ({ qrCode, qrCodeBase64, onRefresh }: UsePixQRCodeLogicProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showImageError, setShowImageError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imageRetries, setImageRetries] = useState(0);
  const [formattedCode, setFormattedCode] = useState<string>("");
  const [validPixCode, setValidPixCode] = useState<string>("");
  
  // URLs de fallback (imagens externas confiáveis)
  const fallbackQrCodeUrl = validPixCode 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(validPixCode)}` 
    : null;
  
  // Gerar código PIX válido a partir do código original
  useEffect(() => {
    if (qrCode) {
      try {
        // Gerar um código PIX válido
        const newValidCode = generateValidPixCode({
          rawCode: qrCode
        });
        
        setValidPixCode(newValidCode);
        
        // Formatar para exibição (com espaços a cada 4 caracteres)
        const formattedPixCode = newValidCode.replace(/(.{4})/g, '$1 ').trim();
        setFormattedCode(formattedPixCode);
      } catch (error) {
        console.error("Erro ao gerar código PIX válido:", error);
        // Fallback para o código original com formatação básica
        setValidPixCode(qrCode);
        setFormattedCode(qrCode.replace(/(.{4})/g, '$1 ').trim());
      }
    }
  }, [qrCode]);

  useEffect(() => {
    if (qrCodeBase64) {
      try {
        // Verificar se o base64 é válido
        if (qrCodeBase64.trim().length > 0) {
          setQrCodeUrl(`data:image/png;base64,${qrCodeBase64}`);
          setShowImageError(false);
          setImageRetries(0);
        } else if (fallbackQrCodeUrl) {
          console.log("Usando URL de fallback para QR code");
          setQrCodeUrl(fallbackQrCodeUrl);
          setShowImageError(false);
        } else {
          console.error("QR code base64 vazio e não há código PIX para fallback");
          setShowImageError(true);
        }
      } catch (error) {
        console.error("Erro ao processar base64:", error);
        if (fallbackQrCodeUrl) {
          setQrCodeUrl(fallbackQrCodeUrl);
          setShowImageError(false);
        } else {
          setShowImageError(true);
        }
      }
    } else if (fallbackQrCodeUrl) {
      // Se temos o código PIX mas não o QR code base64, usar o serviço alternativo
      setQrCodeUrl(fallbackQrCodeUrl);
      setShowImageError(false);
    } else {
      // Evitar mostrar erro imediatamente durante o carregamento
      if (!isRefreshing && imageRetries > 2) {
        setShowImageError(true);
      }
    }
  }, [qrCodeBase64, validPixCode, isRefreshing, imageRetries, fallbackQrCodeUrl]);

  const handleImageError = () => {
    console.error("Erro ao carregar QR code");
    
    // Tentar novamente usando o serviço alternativo
    if (imageRetries < 3 && fallbackQrCodeUrl) {
      setImageRetries(prev => prev + 1);
      setQrCodeUrl(fallbackQrCodeUrl);
    } else {
      setShowImageError(true);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      setShowImageError(false);
      setImageRetries(0);
      
      // Simular um tempo mínimo de refresh para feedback visual
      setTimeout(() => {
        onRefresh();
        setTimeout(() => setIsRefreshing(false), 500);
      }, 500);
    }
  };

  // Extrair informações do código PIX para exibição
  const beneficiaryName = qrCode ? extractNameFromCode(qrCode) : "Não disponível";
  
  // Determinar se devemos mostrar erro ou QR code
  const shouldShowQrCode = qrCodeUrl && !showImageError;
  
  return {
    qrCodeUrl,
    formattedCode,
    validPixCode,
    isRefreshing,
    showImageError,
    shouldShowQrCode,
    beneficiaryName,
    handleImageError,
    handleRefresh
  };
};
