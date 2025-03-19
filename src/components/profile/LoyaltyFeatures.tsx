
import { Gift, Ticket, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoyaltyFeatures = () => {
  return (
    <Card className="col-span-1 md:col-span-3 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Programa de Fidelidade
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-center mb-3 text-purple-600">
            <Ticket className="h-8 w-8" />
          </div>
          <h3 className="text-center font-medium mb-2">Compre Ingressos</h3>
          <p className="text-sm text-center text-gray-600">
            Ganhe pontos a cada compra de ingresso realizada
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-center mb-3 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-center font-medium mb-2">Indique Amigos</h3>
          <p className="text-sm text-center text-gray-600">
            Ganhe pontos extras ao indicar amigos que comprem ingressos
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-center mb-3 text-purple-600">
            <Gift className="h-8 w-8" />
          </div>
          <h3 className="text-center font-medium mb-2">Resgate Prêmios</h3>
          <p className="text-sm text-center text-gray-600">
            Troque seus pontos por ingressos, descontos e brindes exclusivos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
