
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PixQRDisplay } from "./PixQRDisplay";
import { PixCodeDisplay } from "./PixCodeDisplay";
import { PixPaymentInfo } from "./PixPaymentInfo";
import { usePixQRCodeLogic } from "@/hooks/payment/usePixQRCodeLogic";

interface PixQRCodeProps {
  qrCode: string | null;
  qrCodeBase64: string | null;
  onRefresh?: () => void;
  error?: string | null;
}

export const PixQRCode = ({ qrCode, qrCodeBase64, onRefresh, error }: PixQRCodeProps) => {
  const {
    qrCodeUrl,
    formattedCode,
    validPixCode,
    isRefreshing,
    showImageError,
    beneficiaryName,
    handleImageError,
    handleRefresh
  } = usePixQRCodeLogic({ qrCode, qrCodeBase64, onRefresh });

  const shouldShowQrCode = qrCodeUrl && !showImageError;
  const hasValidCode = !!(validPixCode || qrCode);

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
      
      <PixQRDisplay 
        qrCodeUrl={qrCodeUrl}
        validPixCode={validPixCode}
        isRefreshing={isRefreshing}
        onImageError={handleImageError}
      />
      
      {/* Mostrar erro apenas se não tivermos QR code E tivermos um erro */}
      {error && !shouldShowQrCode && (
        <div className="text-sm text-amber-600 text-center px-4 py-2 bg-amber-50 rounded-md border border-amber-200 w-full">
          {error}
        </div>
      )}
      
      <PixCodeDisplay 
        formattedCode={formattedCode}
        validPixCode={validPixCode}
      />
      
      <PixPaymentInfo 
        beneficiaryName={beneficiaryName}
        hasPixCode={hasValidCode}
        pixCode={validPixCode}
      />
    </div>
  );
};
