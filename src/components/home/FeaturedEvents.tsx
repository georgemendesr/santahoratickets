
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types";
import { EventCard } from "./EventCard";

export function FeaturedEvents() {
  const { data: featuredEvents, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      try {
        // Buscar eventos futuros publicados
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "published")
          .gte("date", today)
          .order('date', { ascending: true })
          .limit(4);

        if (error) throw error;
        
        return data as Event[];
      } catch (error) {
        console.error("Falha ao carregar eventos em destaque:", error);
        return [];
      }
    },
  });

  return (
    <div className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Em cartaz no Santinha</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-lg">Carregando eventos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredEvents && featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                batchInfo={{
                  name: "Lote Atual",
                  class: "text-violet-600"
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center p-8 bg-muted rounded-lg">
              <p className="text-lg">Não há eventos programados no momento.</p>
              <p>Fique de olho! Novos eventos serão anunciados em breve.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
