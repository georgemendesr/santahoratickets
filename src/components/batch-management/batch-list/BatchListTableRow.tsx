
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { BatchProgressIndicator } from "../BatchProgressIndicator";
import { BatchStatusBadge } from "../BatchStatusBadge";
import { BatchStatusActions } from "./BatchStatusActions";
import { BatchActions } from "./BatchActions";
import { Batch } from "@/types/event.types";

interface BatchListTableRowProps {
  batch: Batch;
  onEditBatch: (batchId: string) => void;
  readOnly?: boolean;
  needsFix?: boolean;
  
  // Funções opcionais para estados de ações
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
}

export const BatchListTableRow = ({
  batch,
  onEditBatch,
  readOnly = false,
  needsFix = false,
  onReset,
  onFixAvailability,
  onToggleVisibility,
  onDuplicate,
  onDelete,
  isResetting,
  isFixingAvailability,
  isToggling,
  isDuplicating,
  isDeleting
}: BatchListTableRowProps) => {
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: pt });
    } catch (e) {
      return "Data inválida";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: pt });
    } catch (e) {
      return "";
    }
  };

  return (
    <TableRow key={batch.id} className={needsFix ? "bg-yellow-50" : ""}>
      <TableCell>{batch.order_number}</TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{batch.title}</p>
          {batch.description && (
            <p className="text-sm text-muted-foreground">{batch.description}</p>
          )}
          {needsFix && !readOnly && (
            <div className="flex items-center text-yellow-600 text-xs mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Inconsistência detectada
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>R$ {batch.price.toFixed(2)}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <span className="text-sm">{batch.available_tickets} / {batch.total_tickets}</span>
          <BatchProgressIndicator
            available={batch.available_tickets}
            total={batch.total_tickets}
            showTooltip={true}
          />
        </div>
      </TableCell>
      <TableCell>
        {formatDate(batch.start_date)}
        <div className="text-xs text-muted-foreground">
          {formatTime(batch.start_date)}
        </div>
      </TableCell>
      <TableCell>
        {batch.end_date ? (
          <>
            {formatDate(batch.end_date)}
            <div className="text-xs text-muted-foreground">
              {formatTime(batch.end_date)}
            </div>
          </>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <BatchStatusBadge 
            status={batch.status}
            isVisible={batch.is_visible}
            startDate={batch.start_date}
            endDate={batch.end_date}
            availableTickets={batch.available_tickets}
            totalTickets={batch.total_tickets}
            showDetails={true}
          />
          
          {!readOnly && (batch.status === 'sold_out' || batch.status === 'ended' || needsFix) && onReset && (
            <BatchStatusActions
              batchId={batch.id}
              onReset={onReset}
              onFixAvailability={onFixAvailability}
              isResetLoading={isResetting}
              isFixingAvailability={isFixingAvailability}
              needsFix={needsFix}
            />
          )}
        </div>
      </TableCell>
      
      {!readOnly && onToggleVisibility && (
        <TableCell>
          <Switch 
            checked={batch.is_visible} 
            disabled={isToggling === batch.id}
            onCheckedChange={() => onToggleVisibility(batch)}
          />
        </TableCell>
      )}
      
      <TableCell>
        <BatchActions 
          batchId={batch.id} 
          onEdit={onEditBatch}
          onDuplicate={!readOnly ? onDuplicate : undefined}
          onDelete={!readOnly ? onDelete : undefined}
          isDuplicating={isDuplicating}
          isDeleting={isDeleting}
          readOnly={readOnly}
        />
      </TableCell>
    </TableRow>
  );
};
