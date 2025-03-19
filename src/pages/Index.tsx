
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EventHeader } from "@/components/home/EventHeader";
import { EventCard } from "@/components/home/EventCard";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Index() {
  const navigate = useNavigate();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        return data as Event[];
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        throw error;
      }
    },
  });

  const currentEvent = events?.[0];

  const handlePurchase = () => {
    if (currentEvent) {
      navigate(`/events/${currentEvent.id}`);
    } else {
      toast.error("Evento não encontrado");
    }
  };

  const getBatchInfo = (event: Event) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntilEvent > 30) {
      return { name: "1º Lote", class: "text-green-600" };
    } else if (daysUntilEvent > 15) {
      return { name: "2º Lote", class: "text-yellow-600" };
    }
    return { name: "3º Lote", class: "text-red-600" };
  };

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-lg text-red-600">Erro ao carregar eventos. Por favor, tente novamente mais tarde.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-lg">Carregando eventos...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!currentEvent) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                Nenhum evento disponível no momento.
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const batchInfo = getBatchInfo(currentEvent);

  return (
    <MainLayout>
      <div className="min-h-screen">
        <EventHeader />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto space-y-16">
            <EventCard 
              event={currentEvent} 
              batchInfo={batchInfo}
              onPurchase={handlePurchase}
              isPending={false}
            />
            <BenefitsSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
