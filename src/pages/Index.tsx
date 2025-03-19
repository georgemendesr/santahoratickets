
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/home/EventCard";
import { EventHeader } from "@/components/home/EventHeader";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { useAuth } from "@/hooks/useAuth";
import { Event } from "@/types/event.types";
import { useState } from "react";
import { EventLoadingState } from "@/components/event-management/EventLoadingState";

export default function Index() {
  const { session } = useAuth();
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  
  const { data: nextEvent, isLoading, error } = useQuery({
    queryKey: ["next-event"],
    queryFn: async () => {
      // Buscar apenas o próximo evento (com data futura)
      const today = new Date().toISOString().split('T')[0];
      
      console.log("Buscando próximo evento a partir de:", today);
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Erro ao buscar próximo evento:", error);
        throw error;
      }
      
      console.log("Evento encontrado:", data);
      
      // Transform the data to ensure it conforms to the Event type
      return data ? {
        ...data,
        status: (data.status as "published" | "draft" | "ended") || "published"
      } as Event : null;
    },
  });

  // Handle purchase button click
  const handlePurchase = (eventId: string) => {
    setPendingEventId(eventId);
    // Redirecionar para a página de detalhes do evento
    window.location.href = `/events/${eventId}`;
  };

  if (isLoading) {
    return <EventLoadingState message="Carregando próximo evento..." />;
  }
  
  if (error) {
    console.error("Erro ao carregar eventos:", error);
    return (
      <MainLayout>
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-xl">Erro ao carregar eventos</h2>
          <p className="text-muted-foreground mt-2">Tente novamente mais tarde</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <EventHeader />
      
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Próximo Evento</h2>
        
        <div className="flex justify-center">
          {nextEvent ? (
            <div className="max-w-md">
              <EventCard 
                key={nextEvent.id} 
                event={nextEvent} 
                batchInfo={{
                  name: "Lote Atual",
                  class: "text-violet-600"
                }}
                onPurchase={() => handlePurchase(nextEvent.id)}
                isPending={pendingEventId === nextEvent.id}
              />
            </div>
          ) : (
            <div className="text-center p-8 bg-muted rounded-lg">
              <p className="text-lg">Não há eventos programados no momento.</p>
              <p>Fique de olho! Novos eventos serão anunciados em breve.</p>
            </div>
          )}
        </div>
      </div>
      
      <BenefitsSection />
    </MainLayout>
  );
}
