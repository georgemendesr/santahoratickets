
import { useState } from "react";
import { Batch } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { CounterInput } from "@/components/ui/counter-input";

interface BatchesTableProps {
  batches: Batch[];
  onPurchase: (batchId: string, quantity: number) => void;
  isLoggedIn: boolean;
  onQuantityChange?: (quantities: Record<string, number>) => void;
}

export function BatchesTable({
  batches,
  onPurchase,
  isLoggedIn,
  onQuantityChange
}: BatchesTableProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (batchId: string, value: number) => {
    const newQuantities = { ...quantities, [batchId]: value };
    setQuantities(newQuantities);
    if (onQuantityChange) {
      onQuantityChange(newQuantities);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lote</TableHead>
            <TableHead className="hidden md:table-cell">Disponível</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => {
            const isSoldOut = batch.available_tickets === 0;
            const isUnavailable = batch.status !== 'active';
            const quantity = quantities[batch.id] || 0;

            return (
              <TableRow key={batch.id}>
                <TableCell>
                  <div>
                    <span className="font-medium">{batch.title}</span>
                    {batch.description && (
                      <p className="text-xs text-muted-foreground">{batch.description}</p>
                    )}
                    <div className="md:hidden mt-1">
                      <Badge variant="outline" className="text-xs">
                        {batch.available_tickets} disponíveis
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {isSoldOut ? (
                    <Badge variant="destructive">Esgotado</Badge>
                  ) : isUnavailable ? (
                    <Badge variant="secondary">Indisponível</Badge>
                  ) : (
                    <Badge variant="outline">{batch.available_tickets} ingressos</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{formatCurrency(batch.price)}</span>
                </TableCell>
                <TableCell className="text-right">
                  {isSoldOut || isUnavailable ? (
                    <span className="text-muted-foreground text-sm">Indisponível</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <CounterInput
                        value={quantity}
                        onChange={(value) => handleQuantityChange(batch.id, value)}
                        min={0}
                        max={Math.min(batch.available_tickets, batch.max_purchase || 10)}
                      />
                      {quantity > 0 && (
                        <Button
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => onPurchase(batch.id, quantity)}
                        >
                          Comprar
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
