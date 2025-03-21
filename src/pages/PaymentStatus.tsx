
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PixQRCode } from "@/components/payment/PixQRCode";
import { PaymentStatusInfo, getStatusInfo } from "@/components/payment/PaymentStatusInfo";
import { usePaymentPolling } from "@/hooks/usePaymentPolling";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");
  const payment_id = searchParams.get("payment_id");
  const [reference] = useState(searchParams.get("external_reference"));
  const eventId = reference?.split("|")[0];
  const preferenceId = reference?.split("|")[1];

  const { qrCode, qrCodeBase64, isLoading, error } = usePaymentPolling({
    preferenceId,
    payment_id,
    reference,
    status,
    navigate
  });

  // Redirecionar para home se não houver status ou preferenceId
  useEffect(() => {
    if ((!status && !preferenceId) || (!status && !payment_id)) {
      navigate("/");
    }
  }, [status, preferenceId, payment_id, navigate]);

  // Para debugging
  useEffect(() => {
    console.log("PaymentStatus rendering with:", {
      qrCode: qrCode ? "QR code present" : "No QR code",
      qrCodeBase64: qrCodeBase64 ? "QR base64 present" : "No QR base64",
      isLoading,
      error
    });
  }, [qrCode, qrCodeBase64, isLoading, error]);

  // Determinar o status apropriado para exibição
  const displayStatus = status || (error ? "error" : "pending");
  const statusInfo = getStatusInfo({ 
    status: displayStatus, 
    eventId, 
    navigate,
    errorMessage: error
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
              {displayStatus === "pending" && !isLoading && qrCodeBase64 && qrCode && (
                <PixQRCode
                  qrCode={qrCode}
                  qrCodeBase64={qrCodeBase64}
                />
              )}
              
              {/* Fallback para quando temos código PIX mas não temos QR Code */}
              {displayStatus === "pending" && !isLoading && qrCode && !qrCodeBase64 && (
                <PixQRCode
                  qrCode={qrCode}
                  qrCodeBase64=""
                />
              )}

              {isLoading && (
                <div className="flex flex-col items-center py-8 space-y-4">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-center text-muted-foreground">Gerando código PIX...</p>
                </div>
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
};

export default PaymentStatus;
