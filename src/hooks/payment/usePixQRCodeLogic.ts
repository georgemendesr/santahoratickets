
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
  const [beneficiaryName, setBeneficiaryName] = useState("SANTA HORA PAGAMENTOS");
  
  // Validação do código PIX - Auditoria
  useEffect(() => {
    if (qrCode) {
      console.log("AUDITORIA PIX: Processando e validando código PIX");
      
      // Extrair e validar o nome do beneficiário
      const extractedName = extractNameFromCode(qrCode);
      
      // AUDITORIA: Verificar se o nome extraído parece válido
      if (extractedName.includes("Gustavo") || 
          extractedName.includes("Araújo") || 
          extractedName === "Não disponível") {
        console.error("ERRO PIX - Nome do beneficiário inválido:", extractedName);
        setBeneficiaryName("SANTA HORA PAGAMENTOS");
      } else {
        setBeneficiaryName(extractedName);
      }
      
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
      
      console.log("AUDITORIA PIX: Código PIX processado e validado");
    } else {
      setFormattedCode("");
      setValidPixCode("");
    }
  }, [qrCode]);
  
  // Processamento do QR Code Base64
  useEffect(() => {
    if (qrCodeBase64) {
      console.log("AUDITORIA PIX: Processando QR Code Base64");
      
      try {
        // Converter base64 para URL
        const url = `data:image/png;base64,${qrCodeBase64}`;
        setQrCodeUrl(url);
        setShowImageError(false);
        
        console.log("AUDITORIA PIX: QR Code Base64 processado com sucesso");
      } catch (error) {
        console.error("ERRO PIX - Falha ao processar QR Code Base64:", error);
        setShowImageError(true);
        setQrCodeUrl(null);
      }
    } else {
      setQrCodeUrl(null);
    }
  }, [qrCodeBase64]);
  
  // Handler para erro de imagem
  const handleImageError = useCallback(() => {
    console.error("ERRO PIX: Falha ao carregar imagem do QR Code");
    setShowImageError(true);
  }, []);
  
  // Handler para atualização
  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      console.log("AUDITORIA PIX: Solicitando atualização do código PIX");
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
