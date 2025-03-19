
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function FeaturedEvents() {
  const navigate = useNavigate();
  
  const { data: featuredEvent, isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      try {
        // Buscar o próximo evento futuro publicado
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "published")
          .gte("date", today)
          .order('date', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          return {
            ...data,
            formattedDate: format(new Date(data.date), "EEEE, dd 'de' MMMM", { locale: ptBR })
          } as Event & { formattedDate: string };
        }
        
        return null;
      } catch (error) {
        console.error("Falha ao carregar evento em destaque:", error);
        return null;
      }
    },
  });

  const handleEventDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-3xl font-bold mb-12 text-center">Em cartaz no Santinha</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando evento...</p>
        </div>
      ) : featuredEvent ? (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative aspect-[16/9]">
            <img 
              src={featuredEvent.image || "/placeholder.svg"}
              alt={featuredEvent.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          <div className="p-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">{featuredEvent.title}</h3>
              <p className="text-lg text-muted-foreground">{featuredEvent.description}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="capitalize font-medium">{featuredEvent.formattedDate}</span>
                <span className="text-muted-foreground">•</span>
                <span>{featuredEvent.time}</span>
                <span className="text-muted-foreground">•</span>
                <span>{featuredEvent.location}</span>
              </div>
              
              {featuredEvent.available_tickets <= 5 && featuredEvent.available_tickets > 0 ? (
                <p className="text-destructive font-medium">
                  Últimos ingressos! ({featuredEvent.available_tickets} restantes)
                </p>
              ) : featuredEvent.available_tickets === 0 ? (
                <p className="text-destructive font-medium">Esgotado</p>
              ) : (
                <p className="text-primary font-medium">
                  {featuredEvent.available_tickets} ingressos disponíveis
                </p>
              )}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button 
                size="lg" 
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] px-8 py-6 text-lg"
                onClick={() => handleEventDetails(featuredEvent.id)}
              >
                Ver Detalhes <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-muted rounded-lg max-w-3xl mx-auto">
          <p className="text-lg">Não há eventos programados no momento.</p>
          <p className="text-muted-foreground mt-2">Fique de olho! Novos eventos serão anunciados em breve.</p>
        </div>
      )}
    </div>
  );
}
