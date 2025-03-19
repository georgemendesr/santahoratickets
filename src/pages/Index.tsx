
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { EventHeader } from "@/components/home/EventHeader";
import { EventCard } from "@/components/home/EventCard";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Index() {
  const navigate = useNavigate();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "published")
          .gte("date", today)  // Apenas eventos futuros
          .order("date", { ascending: true })
          .limit(1);  // Apenas o próximo evento

        if (error) throw error;
        
        // Formatar as datas dos eventos
        const formattedEvents = data.map(event => ({
          ...event,
          formattedDate: format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
        }));
        
        return formattedEvents as (Event & { formattedDate: string })[];
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        throw error;
      }
    },
  });

  const featuredEvent = events?.[0];

  const handlePurchase = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const getBatchInfo = (event: Event) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    
    // Se o evento já aconteceu, mostrar uma informação especial de lote
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
          <div className="max-w-7xl mx-auto space-y-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center">Próximo Evento</h2>
              
              {error && (
                <div className="text-center py-8">
                  <p className="text-lg text-red-600">Erro ao carregar eventos. Por favor, tente novamente mais tarde.</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-8">
                  <p className="text-lg">Carregando próximo evento...</p>
                </div>
              )}

              {!isLoading && !error && events?.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-lg">Não há eventos programados no momento.</p>
                </div>
              )}

              {events && events.length > 0 && (
                <div className="max-w-xl mx-auto">
                  <EventCard 
                    key={featuredEvent.id}
                    event={{
                      ...featuredEvent,
                      date: featuredEvent.formattedDate
                    }}
                    batchInfo={getBatchInfo(featuredEvent)}
                    onPurchase={() => handlePurchase(featuredEvent.id)}
                    isPending={false}
                  />
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
