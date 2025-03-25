
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, Beaker } from "lucide-react";
import { toast } from "sonner";

const MPCredentialsCard = () => {
  const prodCredentials = {
    publicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || "APP_USR-cc4efa39-c472-4d93-b947-43077a328be3"
  };
  
  const testCredentials = {
    publicKey: import.meta.env.VITE_MERCADOPAGO_TEST_PUBLIC_KEY || "TEST-0cd7d466-22cc-4a42-a9bb-f824bcba0d8e",
    token: import.meta.env.VITE_MERCADOPAGO_TEST_TOKEN || "TEST-1217057600984731-021621-11acd6ad8a3e1496fa519421793bfe42-106423283"
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${label} copiado para a área de transferência`);
      })
      .catch(() => {
        toast.error("Falha ao copiar para a área de transferência");
      });
  };

  return (
    <Card className="border-emerald-200 bg-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-emerald-800 flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          Credenciais do Mercado Pago
        </CardTitle>
        <CardDescription className="text-emerald-700">
          Credenciais configuradas para integração com o Mercado Pago
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-emerald-700">Credenciais de Produção</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-emerald-800">Public Key (Frontend)</p>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 bg-emerald-100 border-emerald-200 text-emerald-800 hover:bg-emerald-200"
                onClick={() => handleCopyToClipboard(prodCredentials.publicKey, "Public Key de Produção")}
              >
                <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                Copiar
              </Button>
            </div>
            <div className="bg-white p-2 rounded border border-emerald-200 text-emerald-950 text-sm font-mono overflow-x-auto">
              {prodCredentials.publicKey}
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-2 border-t border-emerald-200">
          <h3 className="text-sm font-semibold text-emerald-700">Credenciais de Teste</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-emerald-800">Public Key (Frontend)</p>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 bg-emerald-100 border-emerald-200 text-emerald-800 hover:bg-emerald-200"
                onClick={() => handleCopyToClipboard(testCredentials.publicKey, "Public Key de Teste")}
              >
                <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                Copiar
              </Button>
            </div>
            <div className="bg-white p-2 rounded border border-emerald-200 text-emerald-950 text-sm font-mono overflow-x-auto">
              {testCredentials.publicKey}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-emerald-800">Test Token (Backend)</p>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 bg-emerald-100 border-emerald-200 text-emerald-800 hover:bg-emerald-200"
                onClick={() => handleCopyToClipboard(testCredentials.token, "Token de Teste")}
              >
                <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                Copiar
              </Button>
            </div>
            <div className="bg-white p-2 rounded border border-emerald-200 text-emerald-950 text-sm font-mono overflow-x-auto">
              {testCredentials.token}
            </div>
          </div>
        </div>
        
        <div className="pt-4 text-sm text-emerald-700">
          <p>Estas credenciais são usadas automaticamente pelo sistema para processar pagamentos com o Mercado Pago Checkout Pro.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MPCredentialsCard;
