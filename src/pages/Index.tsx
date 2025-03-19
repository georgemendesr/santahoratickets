
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/home/EventCard";
import { EventHeader } from "@/components/home/EventHeader";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { useAuth } from "@/hooks/useAuth";
import { AdminPromotionCard } from "@/components/admin/AdminPromotionCard";
import { Event } from "@/types/event.types";

export default function Index() {
  const { session } = useAuth();
  
  const { data: events } = useQuery({
    queryKey: ["home-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("date", { ascending: true });
      
      // Transform the data to ensure it conforms to the Event type
      return data?.map(event => ({
        ...event,
        status: (event.status as "published" | "draft" | "ended") || "published"
      })) as Event[];
    },
  });

  return (
    <MainLayout>
      <EventHeader />
      
      {/* Admin Promotion Card for logged in users */}
      {session && (
        <div className="container max-w-3xl mx-auto mt-8 mb-12">
          <AdminPromotionCard />
        </div>
      )}
      
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Próximos Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
      
      <BenefitsSection />
    </MainLayout>
  );
}
