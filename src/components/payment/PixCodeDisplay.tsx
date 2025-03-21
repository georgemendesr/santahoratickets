
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface PixCodeDisplayProps {
  formattedCode: string;
  validPixCode: string;
}

export const PixCodeDisplay = ({ formattedCode, validPixCode }: PixCodeDisplayProps) => {
  const handleCopyCode = () => {
    if (validPixCode) {
      // Copiar o código PIX válido sem espaços para garantir compatibilidade
      navigator.clipboard.writeText(validPixCode.replace(/\s+/g, ''));
      toast.success("Código PIX copiado!");
    }
  };

  return (
    <div className="w-full">
      <p className="text-sm text-center mb-2 font-medium">
        Copie o código PIX:
      </p>
      <div className="relative">
        <textarea
          value={formattedCode || ""}
          readOnly
          className="w-full p-2 text-sm bg-gray-50 border rounded pr-20 min-h-[80px] resize-none font-mono"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-8"
          onClick={handleCopyCode}
          disabled={!validPixCode}
        >
          <Copy className="h-4 w-4 mr-1" />
          Copiar
        </Button>
      </div>
    </div>
  );
};
