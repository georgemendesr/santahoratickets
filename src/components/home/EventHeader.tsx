
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { getImageUrl } from "@/integrations/supabase/utils";
import { getEventUrl } from "@/utils/navigation";

export function EventHeader() {
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ["featured-event"],
    queryFn: async () => {
      try {
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
          const { data: batchData, error: batchError } = await supabase
            .from("batches")
            .select("*")
            .eq("event_id", data.id)
            .eq("is_visible", true)
            .order('price', { ascending: true });
            
          if (batchError) throw batchError;
          
          const activeBatches = batchData.filter(batch => {
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
            ...data as Event,
            activeBatch: activeBatches.length > 0 ? activeBatches[0] : null
          };
        }
        
        return null;
      } catch (error) {
        console.error("Falha ao carregar evento em destaque:", error);
        return null;
      }
    },
  });

  const imageUrl = event?.image 
    ? (event.image.startsWith("http") 
        ? event.image 
        : (event.image.startsWith("/") 
          ? event.image 
          : getImageUrl(event.image).publicUrl))
    : "/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png";

  const handleViewDetails = () => {
    if (event) {
      navigate(getEventUrl(event.id));
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-screen flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="relative h-[70vh] flex items-center justify-center">
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

        <div className="relative z-20 container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">Nenhum evento disponível no momento</h2>
            <p className="text-xl mb-8">Fique ligado! Em breve teremos novidades incríveis para você.</p>
          </div>
        </div>
      </div>
    );
  }

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
  
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-16">
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/30 z-10" />
          <img 
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-4">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 shadow-2xl">
          <div className="p-6 md:p-10 text-white">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <img 
                  src={imageUrl}
                  alt={event.title}
                  className="w-full h-auto rounded-xl shadow-lg"
                />
                <div className="mt-4 flex justify-end">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${batchInfo.class} bg-white/90`}>
                    {batchInfo.name}
                  </span>
                </div>
              </div>
              
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl font-bold">{event.title}</h1>
                <p className="text-lg opacity-90">{event.description}</p>
                
                <div className="space-y-4 text-white">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-[#8B5CF6]" />
                    <span className="text-lg">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-[#8B5CF6]" />
                    <span className="text-lg">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-[#8B5CF6]" />
                    <span className="text-lg">{event.location}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full py-6 text-lg bg-[#8B5CF6] hover:bg-[#7C3AED]" 
                  onClick={handleViewDetails}
                >
                  <Ticket className="mr-2 h-5 w-5" />
                  {isPastEvent ? "Ver Detalhes" : "Comprar Pulseira"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
