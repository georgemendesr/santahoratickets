
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { useState } from "react";

interface PIXFormProps {
  amount: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function PIXForm({ amount, onSubmit, isSubmitting }: PIXFormProps) {
  const [pixLogoError, setPixLogoError] = useState(false);
  const [mpLogoError, setMpLogoError] = useState(false);

  return (
    <Card className="p-6 shadow-md bg-white">
      <div className="space-y-6">
        <div className="text-center">
          <QrCode className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
          <p className="text-lg font-medium">Total a pagar:</p>
          <p className="text-2xl font-bold text-emerald-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(amount)}
          </p>
        </div>

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p>Ao clicar em "Gerar PIX", você receberá um QR Code para pagamento.</p>
          <p>O pagamento será confirmado automaticamente após a transferência.</p>
          <p className="text-xs italic">O pagamento deve ser processado em até 15 minutos.</p>
        </div>

        <div className="flex justify-center py-4">
          {!pixLogoError ? (
            <img 
              src="/pix-logo.png" 
              alt="PIX" 
              className="h-12"
              onError={(e) => {
                setPixLogoError(true);
                (e.target as HTMLImageElement).src = "https://www.mercadopago.com/org-img/MP3/API/logos/pix.gif";
              }}
            />
          ) : (
            <img 
              src="https://www.mercadopago.com/org-img/MP3/API/logos/pix.gif" 
              alt="PIX" 
              className="h-12"
            />
          )}
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Gerando PIX...
            </>
          ) : "Gerar PIX"}
        </Button>

        <div className="flex justify-center mt-4">
          {!mpLogoError ? (
            <img 
              src="/mercadopago-logo.png" 
              alt="Powered by MercadoPago" 
              className="h-8"
              onError={(e) => {
                setMpLogoError(true);
                (e.target as HTMLImageElement).src = "https://www.mercadopago.com/org-img/MP3/API/logos/powered_by_mercadopago.gif";
              }}
            />
          ) : (
            <img 
              src="https://www.mercadopago.com/org-img/MP3/API/logos/powered_by_mercadopago.gif" 
              alt="Powered by MercadoPago" 
              className="h-8"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
