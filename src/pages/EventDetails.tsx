
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useReferrals } from "@/hooks/useReferrals";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || undefined;
  const { session, userProfile } = useAuthStore();
  
  // Pass the ID parameter to useReferrals 
  const { referralCode, createReferral, useGetReferrer } = useReferrals(id);
  
  // Use the useGetReferrer hook
  const { referrer, isLoading: loadingReferrer } = useGetReferrer(refCode);
  
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  useEffect(() => {
    // Fetch event details
    const fetchEventDetails = async () => {
      try {
        // Replace with your actual fetching logic
        setIsLoading(true);
        // Mock data for now
        setEvent({
          id,
          title: "Evento de Exemplo",
          description: "Descrição do evento",
          image_url: "/placeholder.svg",
          date: new Date().toISOString(),
          location: "Localização do evento",
        });
        setBatches([
          {
            id: "1",
            name: "Lote 1",
            price: 50,
            available_tickets: 100,
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ]);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);
  
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
      navigate(`/auth?redirect=/eventos/${id}`);
      return;
    }
    
    navigate(`/checkout/${id}/finish?batch=${batchId}&quantity=${quantity}`);
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
  
  if (error || !event) {
    return (
      <div className="container max-w-5xl mx-auto py-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium">Não foi possível carregar o evento</h3>
            <p className="text-gray-500">Tente novamente mais tarde</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-4">
      <Button variant="ghost" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <EventDetailsContent
        event={event}
        batches={batches}
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
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Nome completo</span>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </label>
            <label className="block">
              <span className="text-gray-700">Telefone</span>
              <input type="tel" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </label>
            <Button className="w-full" onClick={() => setShowProfileDialog(false)}>
              Salvar perfil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetails;
