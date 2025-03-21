
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface PixQRCodeProps {
  qrCode: string;
  qrCodeBase64: string;
}

export const PixQRCode = ({ qrCode, qrCodeBase64 }: PixQRCodeProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (qrCodeBase64) {
      setQrCodeUrl(`data:image/png;base64,${qrCodeBase64}`);
    }
  }, [qrCodeBase64]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="font-medium text-center">Escaneie o QR Code para pagar com PIX</p>
      
      {qrCodeUrl ? (
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <img 
            src={qrCodeUrl}
            alt="QR Code PIX"
            className="w-48 h-48"
            onError={() => {
              console.error("Erro ao carregar QR code");
              setQrCodeUrl(null);
            }}
          />
        </div>
      ) : (
        <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">QR Code não disponível</p>
        </div>
      )}
      
      <div className="w-full">
        <p className="text-sm text-center mb-2">Ou copie o código PIX:</p>
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
            onClick={() => {
              if (qrCode) {
                navigator.clipboard.writeText(qrCode);
                toast.success("Código PIX copiado!");
              }
            }}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </Button>
        </div>
      </div>
    </div>
  );
};
