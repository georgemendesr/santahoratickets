
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileDialog } from "@/components/event-details/ProfileDialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useEventDetails } from "@/hooks/useEventDetails";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref") || undefined;
  const { session, userProfile, isAdmin } = useAuthStore();
  
  // Use o hook useEventDetails
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
    refreshData,
    isLoading,
    hasError
  } = useEventDetails(id);
  
  // Contagem de tentativas
  const [retryCount, setRetryCount] = useState(0);
  
  // Tentativa automática de recarga em caso de erro
  useEffect(() => {
    if (hasError && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Tentativa automática ${retryCount + 1} de recarregar o evento...`);
        refreshData();
        setRetryCount(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasError, retryCount, refreshData]);
  
  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
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
      toast.success("Link copiado para a área de transferência!");
    }
  };
  
  const handlePurchase = (batchId: string, quantity: number) => {
    if (!session) {
      navigate(`/auth?redirect=/event/${id}`);
      return;
    }
    
    navigate(`/checkout/${id}/finish?batch=${batchId}&quantity=${quantity}`);
  };
  
  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    createProfileMutation.mutate();
  };
  
  const handleRefresh = () => {
    refreshData();
    setRetryCount(0);
    toast.info("Recarregando informações do evento...");
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
      <div className="container max-w-5xl mx-auto py-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-medium">Não foi possível carregar o evento</h3>
            <p className="text-gray-500 mb-4">Ocorreu um erro ao buscar as informações do evento</p>
            
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="mx-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
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
        batches={batches || []}
        isAdmin={isAdmin}
        profile={userProfile}
        referrer={referrer}
        referralCode={referralCode}
        onShare={handleShare}
        onPurchase={handlePurchase}
        isLoggedIn={!!session}
        session={session}
      />
      
      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        cpf={cpf}
        birthDate={birthDate}
        phone={phone}
        onCpfChange={setCpf}
        onBirthDateChange={setBirthDate}
        onPhoneChange={setPhone}
        onSubmit={handleSubmitProfile}
        isPending={createProfileMutation.isPending}
      />
    </div>
  );
};

export default EventDetails;
