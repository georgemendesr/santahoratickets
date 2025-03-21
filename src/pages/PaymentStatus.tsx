
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { PixQRCode } from "@/components/payment/PixQRCode";
import { PaymentStatusInfo, getStatusInfo } from "@/components/payment/PaymentStatusInfo";
import { usePaymentPolling } from "@/hooks/payment/usePaymentPolling";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");
  const payment_id = searchParams.get("payment_id");
  const reference = searchParams.get("external_reference");
  const eventId = reference?.split("|")[0];
  const preferenceId = reference?.split("|")[1];

  const { 
    qrCode, 
    qrCodeBase64, 
    isLoading, 
    error,
    refreshPixData,
    qrCodeLoaded,
    fallbackQrUsed
  } = usePaymentPolling({
    preferenceId,
    payment_id,
    reference,
    status,
    navigate
  });

  // Determinar o status apropriado para exibição
  const displayStatus = status || (error ? "error" : "pending");
  const statusInfo = getStatusInfo({ 
    status: displayStatus, 
    eventId, 
    navigate,
    errorMessage: error
  });

  // Tentar refrescar automaticamente o QR code se houver erro
  useEffect(() => {
    if (error && displayStatus === "pending" && preferenceId) {
      const timer = setTimeout(() => {
        console.log("Tentando recarregar o QR code após erro");
        refreshPixData();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, displayStatus, preferenceId, refreshPixData]);

  console.log("Payment Status Page:", {
    preferenceId,
    payment_id,
    status,
    qrCode: qrCode ? "Has QR" : "No QR",
    qrCodeBase64: qrCodeBase64 ? "Has QR Base64" : "No QR Base64",
    isLoading,
    error,
    qrCodeLoaded,
    fallbackQrUsed
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
                      {/* Se temos o código, não mostrar a mensagem de erro quando usamos o fallback */}
                      {error && !qrCode && (
                        <div className="flex flex-col items-center py-4 space-y-3 mb-4">
                          <div className="text-amber-500 bg-amber-50 p-3 rounded-full">
                            <RefreshCw className="w-8 h-8" />
                          </div>
                          <p className="text-center font-medium">Houve um problema ao gerar o QR code</p>
                          <p className="text-center text-sm text-muted-foreground max-w-xs mx-auto">
                            Você pode tentar novamente ou usar o código PIX para pagamento
                          </p>
                          <Button 
                            variant="outline"
                            onClick={refreshPixData}
                            className="mt-2"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Tentar Novamente
                          </Button>
                        </div>
                      )}
                      
                      {/* Mostrar o componente PixQRCode sempre que tivermos o código PIX, mesmo se for fallback */}
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
                          />
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-700 font-medium text-center">
                              Se o QR Code não funcionar, use a opção "PIX Copia e Cola" no seu banco e cole o código acima.
                            </p>
                          </div>
                        </>
                      )}
                      
                      {/* Adicionar botão de emergência caso nada tenha funcionado */}
                      {!qrCode && error && (
                        <div className="flex flex-col items-center mt-6">
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              // Forçar uma nova geração completa
                              localStorage.removeItem("pixPaymentData");
                              navigate(`/payment-status?status=pending&payment_id=${payment_id}&external_reference=${reference}`);
                              window.location.reload();
                            }}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </CheckoutLayout>
  );
}

export default PaymentStatus;
