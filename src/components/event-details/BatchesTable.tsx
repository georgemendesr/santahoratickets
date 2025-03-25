import { Batch } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { computeBatchStatus } from "@/utils/batchStatusUtils";

interface BatchesTableProps {
  batches: Batch[];
  onQuantityChange?: (quantities: Record<string, number>) => void;
  onPurchase?: (batchId: string, quantity: number) => void;
  isLoggedIn?: boolean;
}

export function BatchesTable({ batches, onQuantityChange, onPurchase, isLoggedIn = false }: BatchesTableProps) {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (onQuantityChange) {
      onQuantityChange(selectedQuantities);
    }
  }, [selectedQuantities, onQuantityChange]);

  const handleIncrement = (batchId: string) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [batchId]: Math.min((prev[batchId] || 0) + 1, 10)
    }));
  };

  const handleDecrement = (batchId: string) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [batchId]: Math.max((prev[batchId] || 0) - 1, 0)
    }));
  };

  const getBatchStatus = (batch: Batch) => {
    const calculatedStatus = computeBatchStatus(batch);
    
    switch (calculatedStatus) {
      case 'active':
        return <Badge className="bg-green-500">Disponível</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Em breve</Badge>;
      case 'ended':
        return <Badge variant="secondary">Encerrado</Badge>;
      case 'sold_out':
        return <Badge variant="destructive">Esgotado</Badge>;
      case 'hidden':
        return <Badge variant="outline">Oculto</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const isBatchAvailable = (batch: Batch) => {
    return computeBatchStatus(batch) === 'active';
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    
    if (now > end) return "Encerrado";

    const days = differenceInDays(end, now);
    const hours = differenceInHours(end, now) % 24;
    const minutes = differenceInMinutes(end, now) % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const visibleBatches = batches.filter(batch => batch.is_visible);

  const groupedBatches = visibleBatches.reduce((groups, batch) => {
    const group = batch.batch_group || 'default';
    return {
      ...groups,
      [group]: [...(groups[group] || []), batch]
    };
  }, {} as Record<string, Batch[]>);

  if (visibleBatches.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum lote disponível</h3>
        <p className="text-muted-foreground">
          Não há lotes de ingressos disponíveis para este evento no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedBatches).map(([group, batchesInGroup]) => (
        <div key={group} className="rounded-md border">
          {group !== 'default' && (
            <div className="p-4 border-b bg-muted/50">
              <h3 className="font-semibold">{group}</h3>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Encerra em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quantidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchesInGroup.map((batch) => {
                const isAvailable = isBatchAvailable(batch);
                
                return (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{batch.title}</p>
                        {batch.description && (
                          <p className="text-sm text-muted-foreground">{batch.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(batch.price)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {batch.end_date ? getTimeRemaining(batch.end_date) : "-"}
                      </span>
                    </TableCell>
                    <TableCell>{getBatchStatus(batch)}</TableCell>
                    <TableCell>
                      {isAvailable ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDecrement(batch.id)}
                              disabled={(selectedQuantities[batch.id] || 0) <= 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium text-lg w-8 text-center">
                              {selectedQuantities[batch.id] || 0}
                            </span>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleIncrement(batch.id)}
                              disabled={(selectedQuantities[batch.id] || 0) >= Math.min(10, batch.available_tickets)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {selectedQuantities[batch.id] > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Você pagará: {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(batch.price * (selectedQuantities[batch.id] || 0))}
                            </p>
                          )}
                        </div>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm text-muted-foreground">
                                Não disponível
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {batch.available_tickets <= 0 
                                  ? "Este lote está esgotado" 
                                  : "Este lote não está disponível para venda no momento"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
