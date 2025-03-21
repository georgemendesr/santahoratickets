
import React from 'react';
import { Batch } from '@/types/event.types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getBatchDebugInfo } from '@/utils/batchStatusUtils';

interface BatchCardProps {
  batch: Batch;
}

// Helper function to determine badge variant based on status
export const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  if (status === 'active') return 'default';
  if (status === 'sold_out') return 'destructive';
  if (status === 'upcoming') return 'outline';
  if (status === 'ended') return 'secondary';
  return 'secondary'; // default fallback
};

// Helper function to get display name for status
export const getStatusDisplayName = (status: string): string => {
  if (status === 'active') return 'Ativo';
  if (status === 'sold_out') return 'Esgotado';
  if (status === 'upcoming') return 'Em breve';
  if (status === 'ended') return 'Encerrado';
  if (status === 'hidden') return 'Oculto';
  return status;
};

export const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  const debugInfo = getBatchDebugInfo(batch);
  const statusMismatch = debugInfo.computedStatus !== batch.status;
  const availabilityMismatch = batch.available_tickets !== batch.total_tickets && batch.status === 'active';
  
  return (
    <Card key={batch.id} className={statusMismatch || availabilityMismatch ? "border-yellow-500" : ""}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {batch.title} 
              {statusMismatch && (
                <Badge variant="outline" className="ml-2 bg-yellow-100">
                  Status inconsistente
                </Badge>
              )}
              {availabilityMismatch && (
                <Badge variant="outline" className="ml-2 bg-blue-100">
                  Available ≠ Total
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {batch.description || 'Sem descrição'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={batch.is_visible ? "default" : "secondary"}>
              {batch.is_visible ? "Visível" : "Oculto"}
            </Badge>
            <Badge variant={getBadgeVariant(batch.status)}>
              {getStatusDisplayName(batch.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Ingressos</p>
              <p className="text-sm text-muted-foreground">
                {batch.available_tickets} / {batch.total_tickets} disponíveis
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Período</p>
              <p className="text-sm text-muted-foreground">
                {new Date(batch.start_date).toLocaleString()} - 
                {batch.end_date ? new Date(batch.end_date).toLocaleString() : 'Indefinido'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Preço</p>
              <p className="text-sm text-muted-foreground">
                R$ {Number(batch.price).toFixed(2)}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-md font-semibold mb-2">Diagnóstico</h3>
            <div className="bg-slate-50 p-4 rounded-md text-sm font-mono">
              <p>ID: {batch.id}</p>
              <p>Status na DB: {batch.status}</p>
              <p>Status calculado: {debugInfo.computedStatus}</p>
              <p>Visível: {batch.is_visible ? 'Sim' : 'Não'}</p>
              <p>Ingressos disponíveis: {batch.available_tickets}</p>
              <p>Total de ingressos: {batch.total_tickets}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {statusMismatch && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-yellow-100 hover:bg-yellow-200"
                    onClick={() => {
                      if (window.fixBatchStatus) {
                        window.fixBatchStatus(batch.id);
                      } else {
                        console.error('Ferramenta de correção não encontrada.');
                      }
                    }}
                  >
                    Corrigir Status
                  </Button>
                )}
                
                {availabilityMismatch && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-blue-100 hover:bg-blue-200"
                    onClick={() => {
                      if (window.fixAvailableTickets) {
                        window.fixAvailableTickets(batch.event_id);
                      } else {
                        console.error('Ferramenta de correção não encontrada.');
                      }
                    }}
                  >
                    Corrigir Disponibilidade
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
