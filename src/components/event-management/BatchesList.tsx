
import React from 'react';
import { Batch } from '@/types/event.types';
import { Card, CardContent } from '@/components/ui/card';
import { BatchCard } from './BatchCard';

interface BatchesListProps {
  batches: Batch[] | null;
}

export const BatchesList: React.FC<BatchesListProps> = ({ batches }) => {
  if (!batches || batches.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Nenhum lote encontrado para este evento
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {batches.map((batch) => (
        <BatchCard key={batch.id} batch={batch} />
      ))}
    </div>
  );
};
