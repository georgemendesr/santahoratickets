
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types";
import { toast } from "sonner";

export type EventFilter = "todos" | "ativos" | "passados";

export const useEventsQuery = (initialFilter: EventFilter = "todos") => {
  const [filter, setFilter] = useState<EventFilter>(initialFilter);
  
  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-events", filter],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      
      if (filter === "ativos") {
        query = query.gte("date", new Date().toISOString().split('T')[0]);
      } else if (filter === "passados") {
        query = query.lt("date", new Date().toISOString().split('T')[0]);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast.error("Erro ao carregar eventos");
        throw error;
      }
      
      return data as Event[];
    },
  });

  // Handle filter change
  const handleFilterChange = (newFilter: EventFilter) => {
    setFilter(newFilter);
  };

  return {
    events,
    isLoading,
    error,
    filter,
    handleFilterChange,
    refetch
  };
};
