
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event, Batch } from "@/types";

export function useCheckoutQueries(eventId: string | null) {
  const eventQuery = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      return data as Event;
    },
    enabled: !!eventId,
    staleTime: 10000, // 10 segundos
    refetchInterval: 30000, // 30 segundos
  });

  const batchQuery = useQuery({
    queryKey: ["active-batch", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from("batches")
        .select("*")
        .eq("event_id", eventId)
        .eq("status", "active")
        .order("order_number", { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data as Batch;
    },
    enabled: !!eventId,
    staleTime: 10000, // 10 segundos
    refetchInterval: 30000, // 30 segundos
  });

  return {
    event: eventQuery.data,
    batch: batchQuery.data,
    isLoading: eventQuery.isLoading || batchQuery.isLoading,
    error: eventQuery.error || batchQuery.error,
  };
}
