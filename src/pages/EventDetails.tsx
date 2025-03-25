
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useEventDetails } from "@/hooks/useEventDetails";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { EventLayout } from "@/components/event-details/EventLayout";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || undefined;
  const { session, userProfile } = useAuthStore();
  
  // Usar o hook useEventDetails para carregar dados do evento
  const { 
    event, 
    batches, 
    profile,
    referrer, 
    referralCode,
    showProfileDialog,
    setShowProfileDialog,
    cpf,
    setCpf,
    birthDate,
    setBirthDate,
    phone,
    setPhone,
    createProfileMutation,
    createReferralMutation,
    isLoading
  } = useEventDetails(eventId);

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
      navigate(`/auth?redirect=/eventos/${eventId}`);
      return;
    }
    
    navigate(`/checkout/${eventId}?batch=${batchId}&quantity=${quantity}`);
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="space-y-8 py-8">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <EventLayout onBack={handleBack}>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium">Não foi possível carregar o evento</h3>
            <p className="text-gray-500">Tente novamente mais tarde</p>
          </CardContent>
        </Card>
      </EventLayout>
    );
  }
  
  return (
    <EventLayout onBack={handleBack} event={event}>
      <EventDetailsContent
        event={event}
        batches={batches || []}
        isAdmin={useAuthStore.getState().isAdmin}
        profile={profile}
        referrer={referrer}
        referralCode={referralCode}
        onShare={handleShare}
        onPurchase={handlePurchase}
        onEdit={() => navigate(`/eventos/${eventId}/edit`)}
        isLoggedIn={!!session}
        session={session}
      />
      
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-md">
          <h2 className="text-xl font-semibold mb-4">Complete seu perfil</h2>
          <p className="text-muted-foreground mb-4">
            Para continuar, precisamos de algumas informações adicionais.
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">CPF</span>
              <input 
                type="text" 
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Data de Nascimento</span>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Telefone</span>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" 
              />
            </label>
            <Button 
              className="w-full" 
              onClick={() => createProfileMutation.mutate()}
              disabled={createProfileMutation.isPending}
            >
              {createProfileMutation.isPending ? 'Salvando...' : 'Salvar perfil'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </EventLayout>
  );
};

export default EventDetails;
