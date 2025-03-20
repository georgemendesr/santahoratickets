
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBatchOrderNumber = (eventId: string | null) => {
  const [orderNumber, setOrderNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchNextOrderNumber = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Buscando próximo número de ordem para o evento:", eventId);
        
        const { data, error } = await supabase
          .from('batches')
          .select('order_number')
          .eq('event_id', eventId)
          .order('order_number', { ascending: false })
          .limit(1);

        if (error) {
          throw new Error(`Erro ao buscar número de ordem: ${error.message}`);
        }

        if (data && data.length > 0) {
          const nextOrderNumber = data[0].order_number + 1;
          console.log(`Último número de ordem encontrado: ${data[0].order_number}, próximo será: ${nextOrderNumber}`);
          setOrderNumber(nextOrderNumber);
        } else {
          console.log("Nenhum lote encontrado para este evento. Começando com ordem 1.");
          setOrderNumber(1);
        }
      } catch (err) {
        console.error("Erro ao buscar próximo número de ordem:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextOrderNumber();
  }, [eventId]);

  const incrementOrderNumber = () => {
    setOrderNumber(prev => {
      const next = prev + 1;
      console.log(`Incrementando número de ordem: ${prev} -> ${next}`);
      return next;
    });
  };

  return {
    orderNumber,
    isLoading,
    error,
    incrementOrderNumber
  };
};
