
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBatchOrderNumber = (eventId: string | null) => {
  const [orderNumber, setOrderNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchNextOrderNumber = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('order_number')
          .eq('event_id', eventId)
          .order('order_number', { ascending: false })
          .limit(1);

        if (!error && data.length > 0) {
          setOrderNumber(data[0].order_number + 1);
        }
      } catch (error) {
        console.error("Erro ao buscar próximo número de ordem:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextOrderNumber();
  }, [eventId]);

  const incrementOrderNumber = () => {
    setOrderNumber(prev => prev + 1);
  };

  return {
    orderNumber,
    isLoading,
    incrementOrderNumber
  };
};
