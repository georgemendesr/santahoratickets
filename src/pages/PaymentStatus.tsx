
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { PixQRCode } from "@/components/payment/PixQRCode";
import { PaymentStatusInfo, getStatusInfo } from "@/components/payment/PaymentStatusInfo";
import { usePaymentPolling } from "@/hooks/payment/usePaymentPolling";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { toast } from "sonner";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");
  const payment_id = searchParams.get("payment_id");
  const reference = searchParams.get("external_reference");
  const eventId = reference?.split("|")[0];
  const preferenceId = reference?.split("|")[1];
  const [useTestMode, setUseTestMode] = useState(false);

  const { 
    qrCode, 
    qrCodeBase64, 
    isLoading, 
    error,
    refreshPixData,
    qrCodeLoaded,
    fallbackQrUsed,
    retryCount,
    environment,
    toggleEnvironment
  } = usePaymentPolling({
    preferenceId,
    payment_id,
    reference,
    status,
    navigate,
    useTestCredentials: useTestMode
  });

  // Efeito para atualizar state local quando o ambiente mudar
  useEffect(() => {
    if (environment) {
      setUseTestMode(environment === "test");
    }
  }, [environment]);

  // Função para alternar manualmente o modo de teste
  const handleToggleTestMode = () => {
    const newMode = !useTestMode;
    setUseTestMode(newMode);
    
    if (toggleEnvironment) {
      toggleEnvironment();
      toast.info(`Alterado para ambiente ${newMode ? "de teste" : "de produção"}`);
    }
  };

  const displayStatus = status || (error ? "error" : "pending");
  const statusInfo = getStatusInfo({ 
    status: displayStatus, 
    eventId, 
    navigate,
    errorMessage: error
  });

  // Tentativa automática de recarregar quando houver erro
  useEffect(() => {
    if (error && displayStatus === "pending" && preferenceId && retryCount === 0) {
      const timer = setTimeout(() => {
        console.log("Tentando recarregar o QR code após erro");
        refreshPixData();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, displayStatus, preferenceId, refreshPixData, retryCount]);

  // Reiniciar o processo de pagamento completamente
  const handleRestartPayment = () => {
    try {
      localStorage.removeItem("pixPaymentData");
      toast.info("Reiniciando processo de pagamento...");
      
      if (eventId) {
        navigate(`/event/${eventId}`);
      } else {
        navigate('/');
      }
    } catch (e) {
      console.error("Erro ao reiniciar pagamento:", e);
      toast.error("Não foi possível reiniciar o pagamento");
    }
  };

  console.log("Payment Status Page:", {
    preferenceId,
    payment_id,
    status,
    qrCode: qrCode ? "Has QR" : "No QR",
    qrCodeBase64: qrCodeBase64 ? "Has QR Base64" : "No QR Base64",
    isLoading,
    error,
    qrCodeLoaded,
    fallbackQrUsed,
    retryCount,
    environment,
    useTestMode
  });

  return (
    <CheckoutLayout>
      <div className="text-center mb-8">
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Home
        </Button>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <PaymentStatusInfo
                status={displayStatus}
                eventId={eventId}
                navigate={navigate}
                errorMessage={error}
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {displayStatus === "pending" && (
                <>
                  {isLoading ? (
                    <div className="flex flex-col items-center py-8 space-y-4">
                      <Loader2 className="w-16 h-16 text-primary animate-spin" />
                      <p className="text-center text-muted-foreground">Gerando código PIX...</p>
                    </div>
                  ) : (
                    <div>
                      {error && !qrCode && (
                        <div className="flex flex-col items-center py-4 space-y-3 mb-4">
                          <div className="text-amber-500 bg-amber-50 p-3 rounded-full">
                            <RefreshCw className="w-8 h-8" />
                          </div>
                          <p className="text-center font-medium">Houve um problema ao gerar o QR code</p>
                          <p className="text-center text-sm text-muted-foreground max-w-xs mx-auto">
                            {error.includes("organizer_name") 
                              ? "Erro ao processar dados do evento. Nossa equipe foi notificada."
                              : "Você pode tentar novamente ou usar o código PIX para pagamento"}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              onClick={refreshPixData}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Tentar Novamente
                            </Button>
                            
                            <Button 
                              variant={useTestMode ? "outline" : "default"}
                              onClick={handleToggleTestMode}
                              className={useTestMode ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : ""}
                            >
                              {useTestMode ? "Usar Produção" : "Usar Teste"}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {qrCode && (
                        <>
                          <div className="bg-emerald-50 p-3 rounded-md border border-emerald-200 mb-4">
                            <p className="text-sm text-emerald-700 font-medium text-center">
                              Realize o pagamento em seu aplicativo bancário utilizando PIX Copia e Cola com o código abaixo.
                            </p>
                          </div>
                          <PixQRCode
                            qrCode={qrCode}
                            qrCodeBase64={qrCodeBase64}
                            onRefresh={refreshPixData}
                            error={fallbackQrUsed ? null : error}
                            environment={environment}
                            onToggleEnvironment={handleToggleTestMode}
                          />
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700 font-medium text-center">
                              Se o QR Code não funcionar, use a opção "PIX Copia e Cola" no seu banco e cole o código acima.
                            </p>
                          </div>
                        </>
                      )}
                      
                      {!qrCode && error && retryCount >= 2 && (
                        <div className="flex flex-col items-center mt-6">
                          <Button 
                            variant="destructive"
                            onClick={handleRestartPayment}
                            className="w-full"
                          >
                            Reiniciar Processo de Pagamento
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {payment_id && (
                <p className="text-center text-sm text-muted-foreground">
                  ID do Pagamento: {payment_id}
                </p>
              )}

              <Button 
                className="w-full" 
                onClick={statusInfo.buttonAction}
              >
                {statusInfo.buttonText}
              </Button>

              {displayStatus === "pending" && eventId && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => navigate(`/event/${eventId}`)}
                >
                  Voltar para o Evento
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CheckoutLayout>
  );
}

export default PaymentStatus;
