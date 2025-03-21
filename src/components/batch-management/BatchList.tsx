
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Batch } from "@/types/event.types";
import { Card } from "@/components/ui/card";
import { BatchListHeader } from "./batch-list/BatchListHeader";
import { EmptyBatchList } from "./batch-list/EmptyBatchList";
import { BatchListTable } from "./batch-list/BatchListTable";
import { BatchListLoading } from "./batch-list/BatchListLoading";
import { useBatchListActions } from "./batch-list/useBatchListActions";

interface BatchListProps {
  eventId: string;
  onEditBatch: (batchId: string) => void;
  readOnly?: boolean;
}

export function BatchList({ eventId, onEditBatch, readOnly = false }: BatchListProps) {
  const { data: batches, isLoading, refetch } = useQuery({
    queryKey: ['batches', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .eq('event_id', eventId)
        .order('order_number', { ascending: true });
        
      if (error) throw error;
      return data as Batch[];
    }
  });

  // Obter ações e estados de loading do hook
  const {
    isDeleting,
    isToggling,
    isDuplicating,
    isResetting,
    isFixingAvailability,
    hasInconsistentTickets,
    handleDeleteBatch,
    toggleBatchVisibility,
    resetBatchStatus,
    fixAvailableTickets,
    duplicateBatch
  } = useBatchListActions(refetch);

  if (isLoading) {
    return <BatchListLoading />;
  }

  if (!batches || batches.length === 0) {
    return (
      <Card>
        <BatchListHeader 
          title="Lotes cadastrados" 
          isEmpty={true}
        />
        <EmptyBatchList />
      </Card>
    );
  }

  return (
    <BatchListTable
      batches={batches}
      onEditBatch={onEditBatch}
      readOnly={readOnly}
      onReset={!readOnly ? resetBatchStatus : undefined}
      onFixAvailability={!readOnly ? fixAvailableTickets : undefined}
      onToggleVisibility={!readOnly ? toggleBatchVisibility : undefined}
      onDuplicate={!readOnly ? duplicateBatch : undefined}
      onDelete={!readOnly ? handleDeleteBatch : undefined}
      isResetting={isResetting}
      isFixingAvailability={isFixingAvailability}
      isToggling={isToggling}
      isDuplicating={isDuplicating}
      isDeleting={isDeleting}
      hasInconsistentTickets={hasInconsistentTickets}
    />
  );
};
