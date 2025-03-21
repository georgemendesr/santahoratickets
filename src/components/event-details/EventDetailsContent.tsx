
import { Event, Batch } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EventInfo } from "./EventInfo";
import { EventActions } from "./EventActions";
import { BatchesTable } from "./BatchesTable";
import { LoyaltyCard } from "./LoyaltyCard";
import { ReferralCard } from "./ReferralCard";
import { EventImage } from "./EventImage";
import { computeBatchStatus } from "@/utils/batchStatusUtils";

interface EventDetailsContentProps {
  event: Event;
  batches: Batch[];
  isAdmin: boolean;
  profile: any;
  referrer: { name: string } | null;
  referralCode: string | null;
  onShare: () => void;
  onPurchase: () => void;
  onEdit: () => void;
}

export function EventDetailsContent({
  event,
  batches,
  isAdmin,
  profile,
  referrer,
  referralCode,
  onShare,
  onPurchase,
  onEdit
}: EventDetailsContentProps) {
  // Função para verificar se todos os lotes estão esgotados
  const areAllBatchesSoldOut = () => {
    // Se não houver lotes, consideramos como esgotado
    if (!batches || batches.length === 0) return true;
    
    // Filtramos apenas lotes visíveis
    const visibleBatches = batches.filter(batch => batch.is_visible);
    if (visibleBatches.length === 0) return true;
    
    // Verificamos se todos os lotes estão com status 'sold_out'
    return visibleBatches.every(batch => 
      computeBatchStatus(batch) === 'sold_out'
    );
  };

  const getLowStockAlert = (availableTickets: number) => {
    if (availableTickets <= 5 && availableTickets > 0) {
      return (
        <p className="text-sm text-yellow-600 font-medium">
          Últimas unidades disponíveis!
        </p>
      );
    }
    if (areAllBatchesSoldOut()) {
      return (
        <p className="text-sm text-red-600 font-medium">
          Ingressos esgotados
        </p>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <EventImage src={event?.image} alt={event?.title} />
      </div>

      <div className="space-y-6">
        {referrer && (
          <Alert>
            <AlertDescription className="text-sm">
              Você está comprando através da indicação de usuário final {referrer.name}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="p-6 space-y-4">
            <EventInfo 
              event={event} 
              getLowStockAlert={getLowStockAlert} 
              soldOut={areAllBatchesSoldOut()}
            />
          </CardContent>
        </Card>

        <BatchesTable batches={batches} />

        <Card>
          <CardContent className="p-6">
            <EventActions
              event={event}
              isAdmin={isAdmin}
              onPurchase={onPurchase}
              onShare={onShare}
              onEdit={onEdit}
              soldOut={areAllBatchesSoldOut()}
            />
          </CardContent>
        </Card>

        {profile && <LoyaltyCard points={profile.loyalty_points} />}

        {referralCode && <ReferralCard code={referralCode} />}
      </div>
    </div>
  );
}
