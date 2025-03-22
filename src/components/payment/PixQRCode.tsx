
import { Button } from "@/components/ui/button";
import { RefreshCw, Beaker } from "lucide-react";
import { PixQRDisplay } from "./PixQRDisplay";
import { PixCodeDisplay } from "./PixCodeDisplay";
import { PixPaymentInfo } from "./PixPaymentInfo";
import { usePixQRCodeLogic } from "@/hooks/payment/usePixQRCodeLogic";
import { Badge } from "@/components/ui/badge";

interface PixQRCodeProps {
  qrCode: string | null;
  qrCodeBase64: string | null;
  onRefresh?: () => void;
  error?: string | null;
  environment?: "test" | "production";
  onToggleEnvironment?: () => void;
}

export const PixQRCode = ({ 
  qrCode, 
  qrCodeBase64, 
  onRefresh, 
  error,
  environment = "production",
  onToggleEnvironment
}: PixQRCodeProps) => {
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
  const isTestEnvironment = environment === "test";

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <p className="font-medium">
            {shouldShowQrCode 
              ? "Escaneie o QR Code ou copie o código" 
              : "Copie o código PIX abaixo"}
          </p>
          
          {isTestEnvironment && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              Teste
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {onToggleEnvironment && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleEnvironment}
              className={isTestEnvironment ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : ""}
              title={isTestEnvironment ? "Alternar para produção" : "Alternar para ambiente de teste"}
            >
              <Beaker className="h-4 w-4 mr-1" />
              {isTestEnvironment ? "Teste" : "Prod"}
            </Button>
          )}
          
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          )}
        </div>
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
        isTestEnvironment={isTestEnvironment}
      />
    </div>
  );
};
