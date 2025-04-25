
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Batch } from "@/types/event.types";
import { BatchFormData } from "./types";

export const useBatchFetch = (
  batchId: string | null | undefined,
  setFormData: React.Dispatch<React.SetStateAction<BatchFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Carregar os dados do lote se estiver editando
  useEffect(() => {
    if (!batchId) return;

    const fetchBatchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .eq('id', batchId)
          .single();

        if (error) throw error;
        
        if (data) {
          const batch = data as Batch;
          
          // Converter data e hora
          const startDate = new Date(batch.start_date);
          const endDate = batch.end_date ? new Date(batch.end_date) : null;

          const formatDateToInputValue = (date: Date) => {
            return date.toISOString().split('T')[0];
          };

          const formatTimeToInputValue = (date: Date) => {
            return date.toISOString().split('T')[1].substring(0, 5);
          };

          setFormData({
            title: batch.title,
            price: batch.price.toString(),
            totalTickets: batch.total_tickets.toString(),
            startDate: formatDateToInputValue(startDate),
            startTime: formatTimeToInputValue(startDate),
            endDate: endDate ? formatDateToInputValue(endDate) : "",
            endTime: endDate ? formatTimeToInputValue(endDate) : "",
            visibility: batch.visibility || "public",
            isVisible: batch.is_visible,
            description: batch.description || "",
            minPurchase: batch.min_purchase.toString(),
            maxPurchase: batch.max_purchase ? batch.max_purchase.toString() : "",
            batchGroup: batch.batch_group || "",
            status: batch.status || "active"
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do lote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatchData();
  }, [batchId, setFormData, setIsLoading]);
};
