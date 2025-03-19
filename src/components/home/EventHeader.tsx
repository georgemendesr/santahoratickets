
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function EventHeader() {
  const navigate = useNavigate();

  const { data: event } = useQuery({
    queryKey: ["featured-event"],
    queryFn: async () => {
      try {
        // Get the most recent event, even if it already happened
        const { data, error } = await supabase
          .from("events")
          .select()
          .order('date', { ascending: false })  // Order by descending date to get the most recent
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

  const handleEventDetails = () => {
    if (event) {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center">
      {/* Background with darker overlay */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background z-10" />
          <img 
            src="/lovable-uploads/1435babf-b231-494c-a8fb-9dd1239cd347.png"
            alt="Bar ambiente"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Centered content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-10">
            <img 
              src="/lovable-uploads/84e088a9-3b7b-41d9-9ef3-dd2894f717cf.png" 
              alt="Logo HORA" 
              className="h-64 mx-auto filter drop-shadow-2xl"
            />
          </div>
          
          {event && (
            <div className="mt-16">
              <Button 
                size="lg" 
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-lg px-8 py-6"
                onClick={handleEventDetails}
              >
                Ver Próximo Evento <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full" />
        </div>
      </div>

      {/* Atmospheric elements */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
