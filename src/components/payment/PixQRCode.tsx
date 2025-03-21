
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { generateValidPixCode, extractNameFromCode } from "@/utils/pixCodeGenerator";

interface PixQRCodeProps {
  qrCode: string | null;
  qrCodeBase64: string | null;
  onRefresh?: () => void;
  error?: string | null;
}

export const PixQRCode = ({ qrCode, qrCodeBase64, onRefresh, error }: PixQRCodeProps) => {
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

  const handleCopyCode = () => {
    if (validPixCode) {
      // Copiar o código PIX válido sem espaços para garantir compatibilidade
      navigator.clipboard.writeText(validPixCode.replace(/\s+/g, ''));
      toast.success("Código PIX copiado!");
    } else if (qrCode) {
      // Fallback para o código original
      navigator.clipboard.writeText(qrCode);
      toast.success("Código PIX copiado!");
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

  // Determinar se devemos mostrar erro ou QR code
  const shouldShowQrCode = qrCodeUrl && !showImageError;
  const shouldShowErrorMessage = !shouldShowQrCode && (validPixCode || qrCode);
  
  // Extrair informações do código PIX para exibição
  const beneficiaryName = qrCode ? extractNameFromCode(qrCode) : "Não disponível";
  
  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center w-full">
        <p className="font-medium text-center flex-1">
          {shouldShowQrCode 
            ? "Escaneie o QR Code ou copie o código" 
            : "Copie o código PIX abaixo"}
        </p>
        
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        )}
      </div>
      
      {shouldShowQrCode ? (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <img 
            src={qrCodeUrl}
            alt="QR Code PIX"
            className="w-48 h-48"
            onError={handleImageError}
          />
        </div>
      ) : shouldShowErrorMessage ? (
        // Exibir uma mensagem se não conseguir mostrar o QR code mas tiver o código PIX
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex flex-col items-center">
            <AlertTriangle className="text-amber-500 mb-2" size={24} />
            <p className="text-sm text-gray-500 text-center mb-2">
              Não foi possível exibir o QR Code
            </p>
            <p className="text-xs text-gray-400 text-center">
              Use o código PIX abaixo
            </p>
          </div>
        </div>
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 text-center p-4">
            {isRefreshing 
              ? "Gerando QR Code..." 
              : "QR Code não disponível"}
          </p>
        </div>
      )}
      
      {/* Mostrar erro apenas se não tivermos QR code E tivermos um erro */}
      {error && !shouldShowQrCode && (
        <div className="text-sm text-amber-600 text-center px-4 py-2 bg-amber-50 rounded-md border border-amber-200 w-full">
          {error}
        </div>
      )}
      
      <div className="w-full">
        <p className="text-sm text-center mb-2 font-medium">
          {shouldShowQrCode ? "Ou copie o código PIX:" : "Copie o código PIX:"}
        </p>
        <div className="relative">
          <textarea
            value={formattedCode || qrCode || ""}
            readOnly
            className="w-full p-2 text-sm bg-gray-50 border rounded pr-20 min-h-[80px] resize-none font-mono"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8"
            onClick={handleCopyCode}
            disabled={!validPixCode && !qrCode}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </Button>
        </div>
      </div>
      
      {/* Informações de pagamento */}
      {(validPixCode || qrCode) && (
        <div className="text-sm bg-gray-50 border border-gray-200 rounded-md p-3 w-full">
          <p className="font-medium mb-1">{beneficiaryName}</p>
          <p className="text-xs text-gray-500">O código expira em 30 minutos</p>
        </div>
      )}
      
      {/* Aviso em destaque para código PIX */}
      {(validPixCode || qrCode) && (
        <div className="text-sm text-center text-emerald-700 bg-emerald-50 p-3 rounded-md border border-emerald-200 w-full font-medium">
          Use o código PIX acima para realizar o pagamento via copia e cola no seu aplicativo bancário.
        </div>
      )}
      
      {/* Instruções adicionais */}
      <div className="text-sm text-center text-blue-700 bg-blue-50 p-3 rounded-md border border-blue-200 w-full">
        <p className="font-medium">Como usar:</p>
        <p className="text-xs mt-1">No seu aplicativo bancário, escolha a opção "PIX Copia e Cola" e cole o código acima. Não tente digitar manualmente o código.</p>
      </div>
    </div>
  );
};
