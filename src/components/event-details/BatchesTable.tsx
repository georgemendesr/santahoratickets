
import { Batch } from "@/types";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";

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
  const [quantities, setQuantities] = useState<Record<string, number>>(
    batches.reduce((acc, batch) => ({ ...acc, [batch.id]: 0 }), {})
  );
  
  const handleIncrease = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;
    
    const newQuantity = Math.min(
      (quantities[batchId] || 0) + 1,
      batch.available_tickets,
      batch.max_purchase || 10 // Limitar a 10 ingressos por padrão
    );
    
    const newQuantities = { ...quantities, [batchId]: newQuantity };
    setQuantities(newQuantities);
    if (onQuantityChange) onQuantityChange(newQuantities);
  };
  
  const handleDecrease = (batchId: string) => {
    const newQuantity = Math.max((quantities[batchId] || 0) - 1, 0);
    const newQuantities = { ...quantities, [batchId]: newQuantity };
    setQuantities(newQuantities);
    if (onQuantityChange) onQuantityChange(newQuantities);
  };
  
  const renderStatus = (batch: Batch) => {
    if (batch.status === 'active') {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          Disponível
        </span>
      );
    }
    if (batch.status === 'coming_soon') {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          Em breve
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
        Esgotado
      </span>
    );
  };
  
  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Lote</th>
            <th className="px-4 py-3 text-left font-medium">Preço</th>
            <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Encerra em</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-center font-medium">Quantidade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {batches.map((batch) => {
            const isActive = batch.status === 'active';
            const isSoldOut = batch.available_tickets <= 0 || batch.status === 'sold_out';
            
            return (
              <tr key={batch.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">{batch.title}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(batch.price)}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {batch.end_date ? new Date(batch.end_date).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : '-'}
                </td>
                <td className="px-4 py-3">
                  {renderStatus(batch)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!isActive || isSoldOut || quantities[batch.id] <= 0}
                      onClick={() => handleDecrease(batch.id)}
                    >
                      <MinusIcon className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center">{quantities[batch.id] || 0}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!isActive || isSoldOut || quantities[batch.id] >= batch.available_tickets}
                      onClick={() => handleIncrease(batch.id)}
                    >
                      <PlusIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="flex justify-end p-4 bg-muted/10 border-t border-border/50">
        <Button
          onClick={() => {
            const selectedBatchId = Object.entries(quantities).find(([_, q]) => q > 0)?.[0];
            if (selectedBatchId) {
              onPurchase(selectedBatchId, quantities[selectedBatchId]);
            }
          }}
          disabled={!Object.values(quantities).some(q => q > 0)}
          className="px-6"
        >
          Comprar
        </Button>
      </div>
    </div>
  );
}
