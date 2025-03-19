
import { useParams, useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ProfileDialog } from "@/components/event-details/ProfileDialog";
import { EventLayout } from "@/components/event-details/EventLayout";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { useEventDetails } from "@/hooks/useEventDetails";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  
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

  const handleShare = async () => {
    if (!session) {
      toast.error("Faça login para compartilhar o evento");
      navigate('/auth');
      return;
    }

    if (!profile) {
      setShowProfileDialog(true);
      return;
    }

    createReferralMutation.mutate();
  };

  const handlePurchase = () => {
    if (!event?.id) {
      toast.error("Evento não encontrado");
      return;
    }

    if (!session) {
      toast.error("Faça login para comprar ingressos");
      navigate('/auth');
      return;
    }
    
    navigate(`/checkout/finish?event=${event.id}&quantity=1`);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProfileMutation.mutate();
  };

  const handleEdit = () => {
    if (!event?.id) return;
    navigate(`/events/${event.id}/edit`);
  };

  if (isLoading) {
    return (
      <EventLayout onBack={() => navigate(-1)}>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando informações do evento...</p>
        </div>
      </EventLayout>
    );
  }

  if (!event) {
    return (
      <EventLayout onBack={() => navigate(-1)}>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-lg text-red-500">Evento não encontrado</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Voltar para a página inicial
          </Button>
        </div>
      </EventLayout>
    );
  }

  return (
    <EventLayout onBack={() => navigate(-1)}>
      <EventDetailsContent
        event={event}
        batches={batches || []}
        isAdmin={isAdmin}
        profile={profile}
        referrer={referrer}
        referralCode={referralCode}
        onShare={handleShare}
        onPurchase={handlePurchase}
        onEdit={handleEdit}
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
        onSubmit={handleProfileSubmit}
        isPending={createProfileMutation.isPending}
      />
    </EventLayout>
  );
}

export default EventDetails;
