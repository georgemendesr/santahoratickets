
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

  const fixAvailableTickets = () => {
    if (eventId && window.fixAvailableTickets) {
      window.fixAvailableTickets(eventId);
    } else {
      console.error('Ferramenta de correção de available_tickets não encontrada.');
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={runBatchDebugger}>
        Diagnosticar Lotes
      </Button>
      <Button variant="outline" className="bg-blue-50" onClick={fixAvailableTickets}>
        Corrigir Disponibilidade
      </Button>
      <Button variant="destructive" onClick={fixAllBatches}>
        Corrigir Status
      </Button>
    </div>
  );
};
