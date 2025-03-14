
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface PixQRCodeProps {
  qrCode: string;
  qrCodeBase64: string;
}

export const PixQRCode = ({ qrCode, qrCodeBase64 }: PixQRCodeProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg">
      <p className="font-medium text-center">Escaneie o QR Code para pagar com PIX</p>
      <img 
        src={`data:image/png;base64,${qrCodeBase64}`}
        alt="QR Code PIX"
        className="w-48 h-48"
      />
      <div className="w-full">
        <p className="text-sm text-center mb-2">Ou copie o código PIX:</p>
        <div className="relative">
          <input
            type="text"
            value={qrCode}
            readOnly
            className="w-full p-2 text-sm bg-gray-50 border rounded pr-20"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8"
            onClick={() => {
              navigator.clipboard.writeText(qrCode);
              toast.success("Código PIX copiado!");
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
