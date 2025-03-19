
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { LoyaltyLevel } from "./LoyaltyLevel";
import { LoyaltyFeatures } from "./LoyaltyFeatures";
import { LoyaltyActions } from "./LoyaltyActions";

interface LoyaltyCardProps {
  points: number;
}

export function LoyaltyCard({ points }: LoyaltyCardProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Gift className="h-5 w-5" />
          Programa de Fidelidade
        </CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Você tem {points} pontos acumulados</span>
          <LoyaltyLevel points={points} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Use seus pontos para resgatar recompensas exclusivas e aproveitar benefícios especiais.
        </p>
        
        <LoyaltyFeatures />
      </CardContent>
      <CardFooter>
        <LoyaltyActions />
      </CardFooter>
    </Card>
  );
}
