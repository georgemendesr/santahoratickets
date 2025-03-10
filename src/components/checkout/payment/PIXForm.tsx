
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";

interface PIXFormProps {
  amount: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function PIXForm({ amount, onSubmit, isSubmitting }: PIXFormProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <QrCode className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Total a pagar:</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(amount)}
          </p>
        </div>

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p>Ao clicar em "Gerar PIX", você receberá um QR Code para pagamento.</p>
          <p>O pagamento será confirmado automaticamente após a transferência.</p>
        </div>

        <div className="flex justify-center py-4">
          <img 
            src="https://www.mercadopago.com/org-img/MP3/API/logos/pix.gif" 
            alt="PIX" 
            className="h-12"
          />
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Gerando PIX..." : "Gerar PIX"}
        </Button>

        <div className="flex justify-center mt-4">
          <img 
            src="https://www.mercadopago.com/org-img/MP3/API/logos/powered_by_mercadopago.gif" 
            alt="Powered by MercadoPago" 
            className="h-8"
          />
        </div>
      </div>
    </Card>
  );
}
