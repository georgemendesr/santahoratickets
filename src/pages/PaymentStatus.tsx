
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PixQRCode } from "@/components/payment/PixQRCode";
import { PaymentStatusInfo, getStatusInfo } from "@/components/payment/PaymentStatusInfo";
import { usePaymentPolling } from "@/hooks/usePaymentPolling";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");
  const payment_id = searchParams.get("payment_id");
  const [reference] = useState(searchParams.get("external_reference"));
  const eventId = reference?.split("|")[0];
  const preferenceId = reference?.split("|")[1];

  const { qrCode, qrCodeBase64 } = usePaymentPolling({
    preferenceId,
    payment_id,
    reference,
    status,
    navigate
  });

  // Redirecionar para home se não houver status
  if (!status || !payment_id) {
    navigate("/");
    return null;
  }

  const statusInfo = getStatusInfo({ status, eventId, navigate });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/0791f14f-3770-44d6-8ff3-1e714a1d1243.png"
            alt="Bora Pagodear"
            className="h-16 mx-auto"
          />
        </div>
        
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
                status={status}
                eventId={eventId}
                navigate={navigate}
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {status === "pending" && qrCodeBase64 && qrCode && (
                <PixQRCode
                  qrCode={qrCode}
                  qrCodeBase64={qrCodeBase64}
                />
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
    </div>
  );
};

export default PaymentStatus;
