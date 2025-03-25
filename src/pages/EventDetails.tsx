
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { EventHeader } from "@/components/events/EventHeader";
import { EventLayout } from "@/components/events/EventLayout";
import { useEventQueries } from "@/hooks/useEventQueries";
import { useReferrals } from "@/hooks/useReferrals";
import { useAuthStore } from "@/store/authStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Error } from "@/components/shared/Error";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || undefined;
  const { session, userProfile } = useAuthStore();
  
  // Pass the ID parameter to useReferrals 
  const { referralCode, createReferral, useGetReferrer } = useReferrals(id);
  
  // Use the useGetReferrer hook
  const { referrer, isLoading: loadingReferrer } = useGetReferrer(refCode);
  
  const { event, batches, isLoading, error } = useEventQueries(id);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  useEffect(() => {
    const hasIncompleteProfile = !!session && (!userProfile?.name || !userProfile?.cpf || !userProfile?.phone);
    setShowProfileDialog(hasIncompleteProfile);
  }, [session, userProfile]);
  
  // Handle back navigation
  const handleBack = () => {
    window.history.back();
  };
  
  const handleShare = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: `Confira este evento: ${event.title}`,
        url: window.location.href
      }).catch(err => {
        console.error("Erro ao compartilhar:", err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };
  
  const handlePurchase = (batchId: string, quantity: number) => {
    if (!session) {
      window.location.href = `/auth?redirect=/event/${id}`;
      return;
    }
    
    window.location.href = `/checkout/${id}/finish?batch=${batchId}&quantity=${quantity}`;
  };
  
  if (isLoading) {
    return (
      <EventLayout onBack={handleBack}>
        <EventHeader event={null} />
        <div className="container space-y-8 py-8">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </EventLayout>
    );
  }
  
  if (error || !event) {
    return (
      <EventLayout onBack={handleBack}>
        <EventHeader event={null} />
        <Error message="Não foi possível carregar o evento" />
      </EventLayout>
    );
  }
  
  return (
    <EventLayout onBack={handleBack}>
      <EventHeader event={event} />
      <EventDetailsContent
        event={event}
        batches={batches || []}
        isAdmin={useAuthStore.getState().isAdmin}
        profile={userProfile}
        referrer={referrer}
        referralCode={userProfile?.referral_code || null}
        onShare={handleShare}
        onPurchase={handlePurchase}
        isLoggedIn={!!session}
        session={session}
      />
      
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-md">
          <h2 className="text-xl font-semibold mb-4">Complete seu perfil</h2>
          <p className="text-muted-foreground mb-4">
            Para continuar, precisamos de algumas informações adicionais.
          </p>
          <ProfileForm 
            onComplete={() => setShowProfileDialog(false)}
            initialData={userProfile}
          />
        </DialogContent>
      </Dialog>
    </EventLayout>
  );
};

export default EventDetails;
