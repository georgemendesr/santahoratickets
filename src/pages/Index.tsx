
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
        console.log("Fetching events...");
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        console.log("Events fetched:", data);
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

  // Renderizar a página principal com a EventHeader, independente do estado dos eventos
  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <EventHeader />

        {error && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-lg text-red-600">Erro ao carregar eventos. Por favor, tente novamente mais tarde.</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-lg">Carregando eventos...</p>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto space-y-16">
            {currentEvent && (
              <EventCard 
                event={currentEvent} 
                batchInfo={getBatchInfo(currentEvent)}
                onPurchase={handlePurchase}
                isPending={false}
              />
            )}
            <BenefitsSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
