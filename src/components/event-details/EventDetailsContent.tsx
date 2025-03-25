
import { Button } from "@/components/ui/button";
import { EventInfo } from "./EventInfo";
import { BatchesTable } from "./BatchesTable";
import { EventActions } from "./EventActions";
import { LoyaltyCard } from "./LoyaltyCard";
import { ReferralCard } from "./ReferralCard";
import { Event, Batch, UserProfile } from "@/types";
import { CheckoutProButton } from "../payment/CheckoutProButton";
import { Session } from "@supabase/supabase-js";

interface EventDetailsContentProps {
  event: Event;
  batches: Batch[];
  isAdmin: boolean;
  profile: UserProfile | null;
  referrer: { name: string } | null;
  referralCode: string | null;
  onShare: () => void;
  onPurchase: (batchId: string, quantity: number) => void;
  onEdit?: () => void;
  isLoggedIn: boolean;
  session?: Session | null;
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
  onEdit,
  isLoggedIn,
  session
}: EventDetailsContentProps) {
  const activeBatch = batches?.find(batch => batch.status === 'active') || null;
  const hasLoyaltyEnabled = true; // TODO: Verificar configuração de lealdade do evento
  
  return (
    <div className="space-y-8 p-4 md:p-6">
      <EventInfo event={event} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <BatchesTable 
              batches={batches || []} 
              onPurchase={onPurchase}
              isLoggedIn={isLoggedIn}
            />
            
            {activeBatch && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border/40">
                <h3 className="text-lg font-medium">Comprar com Mercado Pago</h3>
                <p className="text-muted-foreground text-sm">
                  Você será redirecionado para o site do Mercado Pago para completar seu pagamento com segurança.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {isLoggedIn ? (
                    <CheckoutProButton
                      eventId={event.id}
                      batch={activeBatch}
                      session={session}
                    />
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => onPurchase(activeBatch.id, 1)}
                      >
                        Comprar com Cadastro
                      </Button>
                      <Button
                        onClick={() => navigate(`/checkout/${event.id}?batch=${activeBatch.id}&quantity=1&guest=true`)}
                      >
                        Comprar sem Cadastro
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {event.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Descrição</h3>
                <div className="prose max-w-none text-muted-foreground">
                  <p>{event.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      
        <div className="space-y-6">
          <EventActions 
            event={event}
            isAdmin={isAdmin}
            onShare={onShare}
            onEdit={onEdit}
          />
          
          {referrer && (
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Você foi convidado por <strong>{referrer.name}</strong>
              </p>
            </div>
          )}
          
          {isLoggedIn && hasLoyaltyEnabled && (
            <LoyaltyCard 
              profile={profile}
              event={event}
            />
          )}
          
          {isLoggedIn && hasLoyaltyEnabled && referralCode && (
            <ReferralCard 
              referralCode={referralCode}
              eventUrl={`${window.location.origin}/event/${event.id}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
