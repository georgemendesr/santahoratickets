
import { Button } from "@/components/ui/button";
import { EventInfo } from "./EventInfo";
import { BatchesTable } from "./BatchesTable";
import { EventActions } from "./EventActions";
import { LoyaltyCard } from "./LoyaltyCard";
import { ReferralCard } from "./ReferralCard";
import { Event, Batch, UserProfile } from "@/types";
import { CheckoutProButton } from "../payment/CheckoutProButton";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EventImage } from "./EventImage";

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
  const navigate = useNavigate();
  
  // Safeguard batches to ensure it's always an array
  const safeBatches = Array.isArray(batches) ? batches : [];
  
  // Find active batch
  const activeBatch = safeBatches.find(batch => batch?.status === 'active') || null;
  const hasLoyaltyEnabled = true; // TODO: Verificar configuração de lealdade do evento
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  
  console.log("[EventDetailsContent] Rendering with:", {
    eventId: event?.id,
    eventTitle: event?.title,
    batchesCount: safeBatches?.length,
    activeBatchId: activeBatch?.id || 'none'
  });
  
  useEffect(() => {
    // Debug log
    console.log("[EventDetailsContent] Component mounted with:", {
      eventId: event?.id,
      eventTitle: event?.title,
      batchesCount: safeBatches?.length,
      activeBatchId: activeBatch?.id || 'none'
    });
  }, [event, safeBatches, activeBatch]);
  
  const handleQuantityChange = (quantities: Record<string, number>) => {
    console.log("[EventDetailsContent] Quantities changed:", quantities);
    setSelectedQuantities(quantities);
  };
  
  const getLowStockAlert = (availableTickets: number) => {
    if (availableTickets <= 5 && availableTickets > 0) {
      return (
        <p className="text-sm text-amber-600 font-medium">
          Apenas {availableTickets} ingressos disponíveis!
        </p>
      );
    }
    return null;
  };
  
  const handlePurchase = () => {
    // Find the selected batch and quantity
    for (const [batchId, quantity] of Object.entries(selectedQuantities)) {
      if (quantity > 0) {
        console.log("[EventDetailsContent] Starting purchase:", { batchId, quantity });
        onPurchase(batchId, quantity);
        return;
      }
    }
  };
  
  if (!event || !event.id) {
    console.error("[EventDetailsContent] Event data is missing or invalid:", event);
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Erro: Dados do evento inválidos ou não encontrados.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Coluna esquerda - Imagem do evento */}
        <div className="w-full">
          <EventImage 
            src={event.image} 
            alt={event.title} 
          />
        </div>
        
        {/* Coluna direita - Informações e ações */}
        <div className="space-y-6">
          <EventInfo 
            event={event} 
            getLowStockAlert={getLowStockAlert}
          />
          
          <BatchesTable 
            batches={safeBatches} 
            onPurchase={onPurchase}
            isLoggedIn={isLoggedIn}
            onQuantityChange={handleQuantityChange}
          />
          
          <EventActions 
            event={event}
            isAdmin={isAdmin}
            onShare={onShare}
            onEdit={onEdit}
            onPurchase={handlePurchase}
            hasSelectedQuantity={Object.values(selectedQuantities).some(q => q > 0)}
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
                      onClick={() => navigate(`/auth?redirect=/eventos/${event.id}`)}
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
          
          {referrer && (
            <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Você foi convidado por <strong>{referrer.name}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Seção inferior - Programa de fidelidade e referência */}
      <div className="grid md:grid-cols-2 gap-6">
        {isLoggedIn && hasLoyaltyEnabled && (
          <LoyaltyCard 
            profile={profile}
            event={event}
          />
        )}
        
        {isLoggedIn && hasLoyaltyEnabled && referralCode && (
          <ReferralCard 
            referralCode={referralCode}
            eventUrl={`${window.location.origin}/eventos/${event.id}`}
          />
        )}
      </div>
      
      {/* Seção de descrição do evento */}
      {event.description && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Descrição</h3>
          <div className="prose max-w-none text-muted-foreground">
            <p>{event.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
