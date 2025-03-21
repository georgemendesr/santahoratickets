
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

  // Corrigindo as funções wrapper para adaptar as assinaturas
  const handleResetBatch = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      resetBatchStatus(batch);
    }
  };

  const handleFixTickets = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      fixAvailableTickets(batch);
    }
  };

  const handleToggleVisibility = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      toggleBatchVisibility(batch);
    }
  };

  const handleDuplicate = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      duplicateBatch(batch);
    }
  };

  const handleDelete = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      handleDeleteBatch(batch);
    }
  };

  return (
    <BatchListTable
      batches={batches}
      onEditBatch={onEditBatch}
      readOnly={readOnly}
      onReset={!readOnly ? handleResetBatch : undefined}
      onFixAvailability={!readOnly ? handleFixTickets : undefined}
      onToggleVisibility={!readOnly ? handleToggleVisibility : undefined}
      onDuplicate={!readOnly ? handleDuplicate : undefined}
      onDelete={!readOnly ? handleDelete : undefined}
      isResetting={isResetting}
      isFixingAvailability={isFixingAvailability}
      isToggling={isToggling}
      isDuplicating={isDuplicating}
      isDeleting={isDeleting}
      hasInconsistentTickets={hasInconsistentTickets}
    />
  );
}
