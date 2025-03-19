
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
          .order("date", { ascending: false })  // Changed to descending to get most recent events first
          .limit(5);  // Limit to 5 most recent events

        if (error) throw error;
        return data as Event[];
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        throw error;
      }
    },
  });

  const featuredEvent = events?.[0];

  const handlePurchase = () => {
    if (featuredEvent) {
      navigate(`/events/${featuredEvent.id}`);
    } else {
      toast.error("Evento não encontrado");
    }
  };

  const getBatchInfo = (event: Event) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    
    // If event already happened, show a special batch info
    if (eventDate < today) {
      return { name: "Evento Passado", class: "text-gray-600" };
    }
    
    const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (daysUntilEvent > 30) {
      return { name: "1º Lote", class: "text-green-600" };
    } else if (daysUntilEvent > 15) {
      return { name: "2º Lote", class: "text-yellow-600" };
    }
    return { name: "3º Lote", class: "text-red-600" };
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <EventHeader />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">Eventos</h2>
              
              {error && (
                <div className="text-center py-8">
                  <p className="text-lg text-red-600">Erro ao carregar eventos. Por favor, tente novamente mais tarde.</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-8">
                  <p className="text-lg">Carregando eventos...</p>
                </div>
              )}

              {!isLoading && !error && events?.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-lg">Não há eventos programados no momento.</p>
                </div>
              )}

              {events && events.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard 
                      key={event.id}
                      event={event} 
                      batchInfo={getBatchInfo(event)}
                      onPurchase={() => navigate(`/events/${event.id}`)}
                      isPending={false}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <BenefitsSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
