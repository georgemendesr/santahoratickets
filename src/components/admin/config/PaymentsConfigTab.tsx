
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import TestCredentialsCard from "@/components/admin/payment/TestCredentialsCard";

const PaymentsConfigTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Configurações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md flex items-start gap-3 mb-4">
              <div className="bg-green-100 rounded-full p-2 mt-1">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Mercado Pago</h4>
                <p className="text-sm text-green-700">Integração ativa</p>
              </div>
              <Button variant="outline" className="ml-auto" size="sm">
                Configurar
              </Button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md flex items-start gap-3">
              <div className="bg-gray-100 rounded-full p-2 mt-1">
                <CreditCard className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium">Outras integrações</h4>
                <p className="text-sm text-gray-500">PagSeguro, PayPal, Stripe</p>
              </div>
              <Button variant="outline" className="ml-auto" size="sm">
                Ver opções
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TestCredentialsCard />
    </div>
  );
};

export default PaymentsConfigTab;
