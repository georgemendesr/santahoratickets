
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
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

  useEffect(() => {
    if (qrCodeBase64) {
      try {
        setQrCodeUrl(`data:image/png;base64,${qrCodeBase64}`);
        setShowImageError(false);
      } catch (error) {
        console.error("Erro ao processar base64:", error);
        setShowImageError(true);
      }
    } else {
      setShowImageError(true);
    }
  }, [qrCodeBase64]);

  const handleImageError = () => {
    console.error("Erro ao carregar QR code");
    setShowImageError(true);
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
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500 text-center p-4">
            {qrCode 
              ? "QR Code não disponível, mas você pode usar o código PIX abaixo" 
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
