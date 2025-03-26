
import { Event, UserProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { LoyaltyLevel } from "./LoyaltyLevel";
import { LoyaltyFeatures } from "./LoyaltyFeatures";

interface LoyaltyCardProps {
  profile: UserProfile | null;
  event: Event;
}

export function LoyaltyCard({ profile, event }: LoyaltyCardProps) {
  // Se não tiver perfil, mostrar mensagem para completar o perfil
  if (!profile) {
    return (
      <Card className="overflow-hidden border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-amber-800">Programa de Fidelidade</h3>
          <p className="text-xs text-amber-700 mt-1">
            Complete seu perfil para participar do programa de fidelidade.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Programa de Fidelidade</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Seus pontos:</span>
              <span className="font-semibold text-amber-600">{profile.loyalty_points || 0}</span>
            </div>
          </div>
          
          <LoyaltyLevel points={profile.loyalty_points || 0} />
          
          <LoyaltyFeatures event={event} />
        </div>
      </CardContent>
    </Card>
  );
}
