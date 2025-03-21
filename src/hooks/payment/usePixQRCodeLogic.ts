
import { useState, useEffect, useCallback } from "react";
import { extractNameFromCode } from "@/utils/pixCodeGenerator";

interface UsePixQRCodeLogicProps {
  qrCode: string | null;
  qrCodeBase64: string | null;
  onRefresh?: () => void;
}

export const usePixQRCodeLogic = ({ qrCode, qrCodeBase64, onRefresh }: UsePixQRCodeLogicProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [formattedCode, setFormattedCode] = useState<string>("");
  const [validPixCode, setValidPixCode] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showImageError, setShowImageError] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState("");
  
  // Processamento do código PIX
  useEffect(() => {
    if (qrCode) {
      console.log("Processando código PIX:", qrCode);
      
      // Extrair o nome do beneficiário do código
      const extractedName = extractNameFromCode(qrCode);
      console.log("Nome do beneficiário extraído:", extractedName);
      setBeneficiaryName(extractedName);
      
      // Formatação para melhor legibilidade
      const chunks = [];
      let tempCode = qrCode;
      while (tempCode.length > 0) {
        chunks.push(tempCode.substring(0, 30));
        tempCode = tempCode.substring(30);
      }
      setFormattedCode(chunks.join("\n"));
      
      // Armazenar o código PIX validado
      setValidPixCode(qrCode);
    } else {
      setFormattedCode("");
      setValidPixCode("");
    }
  }, [qrCode]);
  
  // Processamento do QR Code Base64
  useEffect(() => {
    if (qrCodeBase64) {
      try {
        // Converter base64 para URL
        const url = `data:image/png;base64,${qrCodeBase64}`;
        setQrCodeUrl(url);
        setShowImageError(false);
      } catch (error) {
        console.error("Falha ao processar QR Code Base64:", error);
        setShowImageError(true);
        setQrCodeUrl(null);
      }
    } else {
      setQrCodeUrl(null);
    }
  }, [qrCodeBase64]);
  
  // Handler para erro de imagem
  const handleImageError = useCallback(() => {
    console.error("Falha ao carregar imagem do QR Code");
    setShowImageError(true);
  }, []);
  
  // Handler para atualização
  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      setIsRefreshing(true);
      
      // Limpar estado atual para garantir dados frescos
      setQrCodeUrl(null);
      setShowImageError(false);
      
      onRefresh();
      
      // Reset do estado de refreshing após um tempo (caso o callback não resetar)
      setTimeout(() => {
        setIsRefreshing(false);
      }, 5000);
    }
  }, [onRefresh]);
  
  return {
    qrCodeUrl,
    formattedCode,
    validPixCode,
    isRefreshing,
    showImageError,
    beneficiaryName,
    handleImageError,
    handleRefresh
  };
};
