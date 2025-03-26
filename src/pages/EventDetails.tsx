import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEventDetails } from "@/hooks/useEventDetails";
import { MainLayout } from "@/components/layout/MainLayout";
import { EventDetailsContent } from "@/components/event-details/EventDetailsContent";
import { useAuthStore } from "@/store/auth";
import { useReferrals } from "@/hooks/useReferrals";
import { toast } from "sonner";
import { Event } from "@/types";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, isLoading, error } = useEventDetails(eventId || '');
  const { userProfile } = useAuthStore();
  const { referralCode, createReferral } = useReferrals(eventId);
  const [generatedReferral, setGeneratedReferral] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleGenerateReferral = useCallback(async () => {
    if (!eventId) {
      toast.error("Erro: ID do evento não definido.");
      return;
    }
    
    try {
      const newReferral = await createReferral(eventId);
      setGeneratedReferral(newReferral.code);
      toast.success("Código de referência gerado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao gerar código de referência:", err);
      toast.error(`Erro ao gerar código de referência: ${err.message || 'Desconhecido'}`);
    }
  }, [createReferral, eventId]);
  
  const fetchEventViewCount = useCallback(async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .rpc('increment_event_view_count', { event_id: eventId });
        
      if (error) {
        console.error("Erro ao incrementar visualização:", error);
      } else {
        console.log("Visualização incrementada com sucesso");
      }
    } catch (err) {
      console.error("Erro ao chamar função para incrementar visualização:", err);
    }
  }, [eventId]);
  
  useEffect(() => {
    fetchEventViewCount();
  }, [fetchEventViewCount]);
  
  if (!isMounted) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando detalhes do evento...</div>;
  }
  
  if (error || !event) {
    return <div className="flex justify-center items-center h-screen">Erro ao carregar detalhes do evento.</div>;
  }
  
  return (
    <MainLayout>
      <EventDetailsContent 
        event={event as Event}
        referralCode={referralCode}
        generatedReferral={generatedReferral}
        onGenerateReferral={handleGenerateReferral}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
      />
    </MainLayout>
  );
};

export default EventDetails;
