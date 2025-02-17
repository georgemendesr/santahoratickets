
import { Event, Batch } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EventHeader } from "./EventHeader";
import { EventInfo } from "./EventInfo";
import { EventActions } from "./EventActions";
import { BatchesTable } from "./BatchesTable";
import { LoyaltyCard } from "./LoyaltyCard";
import { ReferralCard } from "./ReferralCard";
import { EventImage } from "./EventImage";

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
  const getLowStockAlert = (availableTickets: number) => {
    if (availableTickets <= 5 && availableTickets > 0) {
      return (
        <p className="text-sm text-yellow-600 font-medium">
          Últimas unidades disponíveis!
        </p>
      );
    }
    if (availableTickets === 0) {
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
      <EventImage src={event?.image} alt={event?.title} />

      <div className="space-y-6">
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/0791f14f-3770-44d6-8ff3-1e714a1d1243.png"
            alt="Bora Pagodear"
            className="h-16 mx-auto mb-4"
          />
          <EventHeader event={event} />
        </div>

        {referrer && (
          <Alert>
            <AlertDescription className="text-sm">
              Você está comprando através da indicação de usuário final {referrer.name}
            </AlertDescription>
          </Alert>
        )}

        <BatchesTable batches={batches} />

        <Card>
          <CardContent className="p-6 space-y-4">
            <EventInfo event={event} getLowStockAlert={getLowStockAlert} />
            {getLowStockAlert(event.available_tickets)}
            <EventActions
              event={event}
              isAdmin={isAdmin}
              onPurchase={onPurchase}
              onShare={onShare}
              onEdit={onEdit}
            />
          </CardContent>
        </Card>

        {profile && <LoyaltyCard points={profile.loyalty_points} />}

        {referralCode && <ReferralCard code={referralCode} />}
      </div>
    </div>
  );
}
