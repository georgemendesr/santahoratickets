
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function EventHeader() {
  const navigate = useNavigate();

  const { data: event } = useQuery({
    queryKey: ["featured-event"],
    queryFn: async () => {
      try {
        // Buscar o próximo evento (com data futura)
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from("events")
          .select()
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

  const handleEventDetails = () => {
    if (event) {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <div className="relative h-[50vh] flex items-center justify-center">
      {/* Background com overlay mais escuro */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-transparent z-10" />
          <img 
            src="/lovable-uploads/41a95ecf-db21-429e-949c-f125b594e382.png"
            alt="Santa Hora - Ambiente"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Conteúdo centralizado */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-6">
            <img 
              src="/lovable-uploads/84e088a9-3b7b-41d9-9ef3-dd2894f717cf.png" 
              alt="Logo Santa Hora" 
              className="h-48 mx-auto filter drop-shadow-2xl"
            />
          </div>
          
          {event && (
            <div className="space-y-6">
              <div className="text-white space-y-2">
                <h2 className="text-xl md:text-2xl font-semibold">{event.title}</h2>
                <p className="text-lg opacity-90 capitalize">{event.formattedDate} • {event.time}</p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-lg px-8 py-6"
                onClick={handleEventDetails}
              >
                Ver Detalhes <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Elementos atmosféricos */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
