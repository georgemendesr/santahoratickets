
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export function EventHeader() {
  const navigate = useNavigate();

  const { data: event } = useQuery({
    queryKey: ["next-event"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select()
          .order('date', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        return data as Event;
      } catch (error) {
        console.error("Failed to fetch event:", error);
        return null;
      }
    },
  });

  const handlePurchase = () => {
    if (event) {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <div className="relative h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background com overlay */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
          <img 
            src="/lovable-uploads/119af9cc-42be-4a86-9205-53a5ac40e5dd.png"
            alt="Ambiente do bar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Logo centralizada */}
      <div className="relative z-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative group animate-bounce">
            <img 
              src="/lovable-uploads/84e088a9-3b7b-41d9-9ef3-dd2894f717cf.png" 
              alt="Logo HORA" 
              className="h-64 mx-auto hover:scale-105 transition-transform duration-300 filter drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full" />
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
