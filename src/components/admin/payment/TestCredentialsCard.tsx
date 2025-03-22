
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, RefreshCw, Flask } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TestCredentialsCard = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | { success: boolean; message: string }>(null);

  const testCredentials = {
    publicKey: "TEST-235bbcdb-d3a5-4b8a-affc-2cc6473be7eb",
    accessToken: "APP_USR-1217057600984731-021621-77ecfa5c3d1443fc1ff44c763e928eba-106423283"
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

  const testPixGeneration = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {
          testOnly: true,
          useTestCredentials: true
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.success) {
        setTestResult({
          success: true,
          message: "Teste de geração PIX realizado com sucesso!"
        });
        toast.success("Teste de integração concluído com sucesso");
      } else {
        setTestResult({
          success: false,
          message: data?.message || "Falha no teste, sem mensagem de erro específica"
        });
        toast.error("Falha no teste de integração");
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || "Erro desconhecido durante o teste"
      });
      toast.error("Erro ao testar integração PIX");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-amber-800 flex items-center gap-2">
          <Flask className="h-5 w-5" />
          Credenciais de Teste do Mercado Pago
        </CardTitle>
        <CardDescription className="text-amber-700">
          Use estas credenciais para testar pagamentos sem processamento real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-amber-800">Public Key (Frontend)</p>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
              onClick={() => handleCopyToClipboard(testCredentials.publicKey, "Public Key")}
            >
              <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
              Copiar
            </Button>
          </div>
          <div className="bg-white p-2 rounded border border-amber-200 text-amber-950 text-sm font-mono overflow-x-auto">
            {testCredentials.publicKey}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-amber-800">Access Token (Backend)</p>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
              onClick={() => handleCopyToClipboard(testCredentials.accessToken, "Access Token")}
            >
              <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
              Copiar
            </Button>
          </div>
          <div className="bg-white p-2 rounded border border-amber-200 text-amber-950 text-sm font-mono overflow-x-auto">
            {testCredentials.accessToken}
          </div>
        </div>
        
        <div className="pt-2 border-t border-amber-200">
          <Button 
            variant="outline" 
            className="w-full bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800"
            onClick={testPixGeneration}
            disabled={isTesting}
          >
            {isTesting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Flask className="h-4 w-4 mr-2" />
                Testar Geração de PIX
              </>
            )}
          </Button>
          
          {testResult && (
            <div className={`mt-3 p-3 rounded border ${testResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              {testResult.message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCredentialsCard;
