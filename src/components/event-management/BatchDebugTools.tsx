
import React from 'react';
import { Button } from '@/components/ui/button';

interface BatchDebugToolsProps {
  eventId: string;
}

export const BatchDebugTools: React.FC<BatchDebugToolsProps> = ({ eventId }) => {
  const runBatchDebugger = () => {
    if (eventId && window.diagnoseBatches) {
      window.diagnoseBatches(eventId);
    } else {
      console.error('Ferramenta de diagnóstico não encontrada.');
    }
  };

  const fixAllBatches = () => {
    if (eventId && window.fixAllBatchesForEvent) {
      window.fixAllBatchesForEvent(eventId);
    } else {
      console.error('Ferramenta de correção não encontrada.');
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={runBatchDebugger}>
        Diagnosticar Lotes
      </Button>
      <Button variant="destructive" onClick={fixAllBatches}>
        Corrigir Todos os Lotes
      </Button>
    </div>
  );
};
