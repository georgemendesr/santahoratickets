
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

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
  
  // URLs de fallback (imagens externas confiáveis)
  const fallbackQrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(qrCode || "");
  
  useEffect(() => {
    if (qrCodeBase64) {
      try {
        // Verificar se o base64 é válido
        if (qrCodeBase64.trim().length > 0) {
          setQrCodeUrl(`data:image/png;base64,${qrCodeBase64}`);
          setShowImageError(false);
          setImageRetries(0);
        } else {
          console.error("QR code base64 vazio");
          setQrCodeUrl(fallbackQrCodeUrl);
          setShowImageError(false);
        }
      } catch (error) {
        console.error("Erro ao processar base64:", error);
        setQrCodeUrl(fallbackQrCodeUrl);
        setShowImageError(false);
      }
    } else if (qrCode) {
      // Se temos o código PIX mas não o QR code base64, usar o serviço alternativo
      setQrCodeUrl(fallbackQrCodeUrl);
      setShowImageError(false);
    } else {
      // Evitar mostrar erro imediatamente durante o carregamento
      if (!isRefreshing && imageRetries > 2) {
        setShowImageError(true);
      }
    }
  }, [qrCodeBase64, qrCode, isRefreshing, imageRetries, fallbackQrCodeUrl]);

  const handleImageError = () => {
    console.error("Erro ao carregar QR code");
    
    // Tentar novamente usando o serviço alternativo
    if (imageRetries < 3) {
      setImageRetries(prev => prev + 1);
      
      // Se temos o código PIX, usar o serviço alternativo
      if (qrCode) {
        setQrCodeUrl(fallbackQrCodeUrl);
      } else {
        setShowImageError(true);
      }
    } else {
      setShowImageError(true);
    }
  };

  const handleCopyCode = () => {
    if (qrCode) {
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

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center w-full">
        <p className="font-medium text-center flex-1">
          {showImageError 
            ? "Copie o código PIX abaixo" 
            : "Escaneie o QR Code ou copie o código"}
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
      
      {qrCodeUrl && !showImageError ? (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <img 
            src={qrCodeUrl}
            alt="QR Code PIX"
            className="w-48 h-48"
            onError={handleImageError}
          />
        </div>
      ) : qrCode ? (
        // Exibir uma mensagem se não conseguir mostrar o QR code mas tiver o código PIX
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex flex-col items-center">
            <AlertTriangle className="text-amber-500 mb-2" size={24} />
            <p className="text-sm text-gray-500 text-center mb-2">
              QR Code não pôde ser exibido
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
      
      {error && (
        <div className="text-sm text-amber-600 text-center px-4 py-2 bg-amber-50 rounded-md border border-amber-200 w-full">
          {error}
        </div>
      )}
      
      <div className="w-full">
        <p className="text-sm text-center mb-2">
          {qrCodeUrl && !showImageError ? "Ou copie o código PIX:" : "Copie o código PIX:"}
        </p>
        <div className="relative">
          <input
            type="text"
            value={qrCode || ""}
            readOnly
            className="w-full p-2 text-sm bg-gray-50 border rounded pr-20"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8"
            onClick={handleCopyCode}
            disabled={!qrCode}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </Button>
        </div>
      </div>
    </div>
  );
};
