
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types";
import { useNavigation } from "@/hooks/useNavigation";
import { EventCard } from "./EventCard";

export function FeaturedEvents() {
  const { goToEventDetails } = useNavigation();

  const { data: events, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      try {
        // Buscar eventos ativos (com data futura)
        const today = new Date().toISOString().split('T')[0];
        
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("status", "published")
          .gte("date", today)
          .order('date', { ascending: true })
          .limit(6);

        if (eventsError) throw eventsError;
        
        // Buscar informações de lotes para cada evento
        const eventsWithBatches = await Promise.all(
          eventsData.map(async (event) => {
            const { data: batchesData, error: batchesError } = await supabase
              .from("batches")
              .select("*")
              .eq("event_id", event.id)
              .eq("is_visible", true)
              .order('price', { ascending: true });
              
            if (batchesError) {
              console.error("Erro ao buscar lotes:", batchesError);
              return { ...event, activeBatch: null };
            }
            
            // Filtrar lotes ativos
            const activeBatches = batchesData.filter(batch => {
              const now = new Date();
              const startDate = new Date(batch.start_date);
              const endDate = batch.end_date ? new Date(batch.end_date) : null;
              
              return (
                batch.available_tickets > 0 &&
                startDate <= now &&
                (!endDate || endDate >= now) &&
                batch.status === 'active'
              );
            });
            
            return {
              ...event,
              activeBatch: activeBatches.length > 0 ? activeBatches[0] : null
            };
          })
        );
        
        return eventsWithBatches;
      } catch (error) {
        console.error("Falha ao carregar eventos em destaque:", error);
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Carregando eventos...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (!events || events.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Nenhum evento disponível</h2>
            <p className="text-muted-foreground mt-2">
              Fique de olho! Novos eventos serão adicionados em breve.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Próximos Eventos</h2>
          <p className="text-muted-foreground mt-2">
            Confira os eventos que estão rolando e garanta sua pulseira
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            // Determinar informações de lote para exibição
            let batchInfo = {
              name: "Esgotado",
              class: "bg-red-500 text-white"
            };
            
            if (event.activeBatch) {
              batchInfo = {
                name: `R$ ${event.activeBatch.price.toFixed(2).replace('.', ',')}`,
                class: "bg-emerald-500 text-white"
              };
            }
            
            return (
              <EventCard
                key={event.id}
                event={event}
                batchInfo={batchInfo}
                onPurchase={() => goToEventDetails(event.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
