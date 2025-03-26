
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event, Batch } from "@/types";

export function useCheckoutQueries(eventId: string | null) {
  const eventQuery = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      try {
        console.log(`[${new Date().toISOString()}] Buscando evento para checkout:`, eventId);
        
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .maybeSingle();

        if (error) {
          console.error(`[${new Date().toISOString()}] Erro ao buscar evento para checkout:`, error);
          throw error;
        }
        
        if (!data) {
          console.error(`[${new Date().toISOString()}] Evento para checkout não encontrado:`, eventId);
          throw new Error("Evento não encontrado");
        }
        
        console.log(`[${new Date().toISOString()}] Evento para checkout encontrado:`, data.title);
        return data as Event;
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Exceção ao buscar evento para checkout:`, error);
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 30000, // 30 segundos
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const batchQuery = useQuery({
    queryKey: ["active-batch", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      try {
        console.log(`[${new Date().toISOString()}] Buscando lote ativo para evento:`, eventId);
        
        const { data, error } = await supabase
          .from("batches")
          .select("*")
          .eq("event_id", eventId)
          .eq("status", "active")
          .order("order_number", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error(`[${new Date().toISOString()}] Erro ao buscar lote ativo:`, error);
          throw error;
        }

        if (!data) {
          console.warn(`[${new Date().toISOString()}] Nenhum lote ativo encontrado para evento:`, eventId);
          return null;
        }
        
        console.log(`[${new Date().toISOString()}] Lote ativo encontrado:`, data.title);
        return data as Batch;
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Exceção ao buscar lote ativo:`, error);
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 30000, // 30 segundos
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    event: eventQuery.data,
    batch: batchQuery.data,
    isLoading: eventQuery.isLoading || batchQuery.isLoading,
    error: eventQuery.error || batchQuery.error,
  };
}
