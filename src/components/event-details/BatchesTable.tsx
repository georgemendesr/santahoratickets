
import { useState, useEffect } from "react";
import { Batch } from "@/types";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Minus, Plus, ShoppingBag } from "lucide-react";

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
  
  // Inicializar quantidades para cada lote
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    batches.forEach(batch => {
      initialQuantities[batch.id] = 0;
    });
    setQuantities(initialQuantities);
  }, [batches]);
  
  // Notificar o componente pai sobre mudanças nas quantidades
  useEffect(() => {
    if (onQuantityChange) {
      onQuantityChange(quantities);
    }
  }, [quantities, onQuantityChange]);
  
  const incrementQuantity = (batchId: string, max: number = Infinity) => {
    setQuantities(prev => {
      const current = prev[batchId] || 0;
      if (current < max) {
        return { ...prev, [batchId]: current + 1 };
      }
      return prev;
    });
  };
  
  const decrementQuantity = (batchId: string, min: number = 0) => {
    setQuantities(prev => {
      const current = prev[batchId] || 0;
      if (current > min) {
        return { ...prev, [batchId]: current - 1 };
      }
      return prev;
    });
  };
  
  const handlePurchase = (batchId: string) => {
    const quantity = quantities[batchId] || 0;
    if (quantity > 0) {
      onPurchase(batchId, quantity);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      console.error("Erro ao formatar data:", e, dateString);
      return dateString;
    }
  };
  
  if (!batches || batches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ingressos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Não há lotes disponíveis para este evento no momento.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingressos Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lote</TableHead>
              <TableHead>Disponível</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map(batch => {
              const isSoldOut = batch.status === 'sold_out' || (batch.available_tickets !== undefined && batch.available_tickets <= 0);
              const isActive = batch.status === 'active';
              const isUpcoming = batch.status === 'upcoming';
              const canBuy = isActive && !isSoldOut;
              const quantity = quantities[batch.id] || 0;
              const maxPurchase = Math.min(
                batch.max_purchase || 10, 
                batch.available_tickets || 0
              );
              
              return (
                <TableRow key={batch.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{batch.title}</p>
                      {batch.description && (
                        <p className="text-xs text-muted-foreground">{batch.description}</p>
                      )}
                      {isUpcoming && batch.start_date && (
                        <p className="text-xs text-muted-foreground">
                          Inicia em {formatDate(batch.start_date)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isSoldOut ? (
                      <span className="text-destructive">Esgotado</span>
                    ) : (
                      batch.available_tickets !== undefined ? batch.available_tickets : '—'
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(batch.price || 0)}</TableCell>
                  <TableCell>
                    {canBuy && (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => decrementQuantity(batch.id)}
                          disabled={quantity <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => incrementQuantity(batch.id, maxPurchase)}
                          disabled={quantity >= maxPurchase}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {canBuy && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePurchase(batch.id)}
                        disabled={quantity <= 0}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Comprar
                      </Button>
                    )}
                    {isUpcoming && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                      >
                        Em breve
                      </Button>
                    )}
                    {isSoldOut && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                      >
                        Esgotado
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
