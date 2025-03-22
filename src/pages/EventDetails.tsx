
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { EventLayout } from "@/components/event-details/EventLayout";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { ProfileDialog } from "@/components/event-details/ProfileDialog";
import { useEventDetails } from "@/hooks/useEventDetails";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useReferrals } from "@/hooks/useReferrals";
import { toast } from "sonner";

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { isAdmin } = useRole();
  const { session } = useAuth();
  const referralCode = searchParams.get('ref');
  
  const [shareUrl, setShareUrl] = useState("");
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  // Profile state
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [isPendingProfileUpdate, setIsPendingProfileUpdate] = useState(false);
  
  // Removido a propriedade useGetReferrer que não existe no hook useReferrals
  const [referrer, setReferrer] = useState<{ name: string } | null>(null);
  const { profile } = useProfile(session?.user?.id);

  const { event, batches, isLoading } = useEventDetails(id as string);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  useEffect(() => {
    if (event) {
      // Criar URL para compartilhamento
      const userReferralCode = profile?.referral_code ?? null;
      const baseUrl = window.location.origin;
      const eventUrl = `${baseUrl}/event/${event.id}`;
      
      setShareUrl(userReferralCode ? `${eventUrl}?ref=${userReferralCode}` : eventUrl);
    }
  }, [event, profile]);
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Confira este evento: ${event?.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
        // Fallback para copiar link
        await copyToClipboard();
      }
    } else {
      // Fallback para navegadores que não suportam a API Share
      await copyToClipboard();
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      toast.error("Erro ao copiar link");
    }
  };
  
  const checkProfileCompletion = async () => {
    if (!session?.user) return false;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('cpf, birth_date, phone')
      .eq('id', session.user.id)
      .single();
      
    if (error) return false;
    
    return !!(data?.cpf && data?.phone);
  };
  
  const handlePurchase = async (selectedBatchId: string, quantity: number) => {
    if (!session?.user) {
      // Redirecionar para autenticação
      navigate(`/auth?redirect=/checkout/${id}?batch=${selectedBatchId}&quantity=${quantity}`);
      return;
    }
    
    // Verificar se o perfil está completo
    const isProfileComplete = await checkProfileCompletion();
    
    if (!isProfileComplete) {
      // Abrir modal para completar perfil
      setProfileDialogOpen(true);
      return;
    }
    
    // Perfil completo, prosseguir para checkout
    navigate(`/checkout/${id}?batch=${selectedBatchId}&quantity=${quantity}`);
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) return;
    
    try {
      setIsPendingProfileUpdate(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          cpf,
          birth_date: birthDate,
          phone
        });
        
      if (error) throw error;
      
      setProfileDialogOpen(false);
      toast.success("Perfil atualizado com sucesso!");
      
      // Continuar para checkout
      navigate(`/checkout/${id}`);
      
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsPendingProfileUpdate(false);
    }
  };
  
  const handleEdit = () => {
    navigate(`/admin/events/edit/${id}`);
  };

  if (isLoading) {
    return (
      <EventLayout onBack={handleGoBack}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p>Carregando detalhes do evento...</p>
        </div>
      </EventLayout>
    );
  }

  if (!event) {
    return (
      <EventLayout onBack={handleGoBack}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-red-500">Evento não encontrado ou ocorreu um erro ao carregá-lo.</p>
        </div>
      </EventLayout>
    );
  }

  return (
    <EventLayout onBack={handleGoBack}>
      <EventHeader event={event} />
      
      <EventDetailsContent
        event={event}
        batches={batches}
        isAdmin={isAdmin}
        profile={profile}
        referrer={referrer}
        referralCode={profile?.referral_code ?? null}
        onShare={handleShare}
        onPurchase={handlePurchase}
        onEdit={handleEdit}
        isLoggedIn={!!session?.user}
      />
      
      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        cpf={cpf}
        birthDate={birthDate}
        phone={phone}
        onCpfChange={setCpf}
        onBirthDateChange={setBirthDate}
        onPhoneChange={setPhone}
        onSubmit={handleProfileSubmit}
        isPending={isPendingProfileUpdate}
      />
    </EventLayout>
  );
};

export default EventDetails;
