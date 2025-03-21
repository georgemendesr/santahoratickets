
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { BatchListTableRow } from "./BatchListTableRow";
import { Batch } from "@/types/event.types";

interface BatchListTableProps {
  batches: Batch[];
  onEditBatch: (batchId: string) => void;
  readOnly?: boolean;
  
  // Funções de ação opcionais
  onReset?: (batchId: string) => void;
  onFixAvailability?: (batchId: string) => void;
  onToggleVisibility?: (batch: Batch) => void;
  onDuplicate?: (batchId: string) => void;
  onDelete?: (batchId: string) => void;
  
  // Estados de loading
  isResetting?: string | null;
  isFixingAvailability?: string | null;
  isToggling?: string | null;
  isDuplicating?: string | null;
  isDeleting?: string | null;
  
  // Função para verificar inconsistências
  hasInconsistentTickets: (batch: Batch) => boolean;
}

export const BatchListTable = ({
  batches,
  onEditBatch,
  readOnly = false,
  onReset,
  onFixAvailability,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  isResetting,
  isFixingAvailability,
  isToggling,
  isDuplicating,
  isDeleting,
  hasInconsistentTickets
}: BatchListTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ordem</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Disponíveis</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Fim</TableHead>
          <TableHead>Status</TableHead>
          {!readOnly && onToggleVisibility && (
            <TableHead>Ativo</TableHead>
          )}
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batch) => {
          const needsFix = hasInconsistentTickets(batch);
          
          return (
            <BatchListTableRow
              key={batch.id}
              batch={batch}
              onEditBatch={onEditBatch}
              readOnly={readOnly}
              needsFix={needsFix}
              onReset={onReset}
              onFixAvailability={onFixAvailability}
              onToggleVisibility={onToggleVisibility}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              isResetting={isResetting}
              isFixingAvailability={isFixingAvailability}
              isToggling={isToggling}
              isDuplicating={isDuplicating}
              isDeleting={isDeleting}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};
