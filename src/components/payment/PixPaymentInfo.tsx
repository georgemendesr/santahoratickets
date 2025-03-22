
import { AlertTriangle } from "lucide-react";

interface PixPaymentInfoProps {
  beneficiaryName: string;
  hasPixCode: boolean;
  pixCode?: string | null;
  isTestEnvironment?: boolean;
}

export const PixPaymentInfo = ({ 
  beneficiaryName, 
  hasPixCode, 
  pixCode, 
  isTestEnvironment = false 
}: PixPaymentInfoProps) => {
  if (!hasPixCode) return null;
  
  return (
    <div className="w-full text-sm space-y-2">
      <div className="text-center">
        <span className="text-muted-foreground">Beneficiário:</span>{" "}
        <span className="font-medium">{beneficiaryName}</span>
      </div>
      
      {isTestEnvironment && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-2 flex items-center gap-2">
          <AlertTriangle className="text-amber-600 h-4 w-4 flex-shrink-0" />
          <span className="text-amber-700 text-xs">
            Pagamento em modo de <strong>teste</strong>. Nenhum valor real será cobrado.
          </span>
        </div>
      )}
      
      <div className="text-xs text-center text-muted-foreground">
        {isTestEnvironment 
          ? "Este é um ambiente de testes. Use apenas para testar a integração." 
          : "O código PIX tem validade de 30 minutos."}
      </div>
    </div>
  );
};
