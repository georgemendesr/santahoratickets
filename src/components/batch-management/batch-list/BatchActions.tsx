
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Copy, Trash2, ExternalLink } from "lucide-react";

interface BatchActionsProps {
  batchId: string;
  onEdit: (batchId: string) => void;
  onDuplicate?: (batchId: string) => void;
  onDelete?: (batchId: string) => void;
  isDuplicating?: string | null;
  isDeleting?: string | null;
  readOnly?: boolean;
}

export const BatchActions = ({
  batchId,
  onEdit,
  onDuplicate,
  onDelete,
  isDuplicating,
  isDeleting,
  readOnly = false
}: BatchActionsProps) => {
  
  if (readOnly) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onEdit(batchId)}
        className="flex items-center gap-1"
      >
        <ExternalLink className="h-3 w-3" />
        <span>Gerenciar</span>
      </Button>
    );
  }
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onEdit(batchId)}
        title="Editar lote"
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      {onDuplicate && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onDuplicate(batchId)}
          disabled={isDuplicating === batchId}
          title="Duplicar lote"
        >
          {isDuplicating === batchId ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-blue-500"></span>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
      
      {onDelete && (
        <Button 
          variant="outline" 
          size="icon"
          className="text-red-600 hover:text-red-700"
          onClick={() => onDelete(batchId)}
          disabled={isDeleting === batchId}
          title="Excluir lote"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
