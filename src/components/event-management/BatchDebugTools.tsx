
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BatchDebugToolsProps {
  eventId: string;
}

export const BatchDebugTools: React.FC<BatchDebugToolsProps> = ({ eventId }) => {
  const runBatchDebugger = () => {
    if (!eventId) {
      toast.error("ID do evento não encontrado");
      return;
    }
    
    if (window.diagnoseBatches) {
      toast.info("Executando diagnóstico de lotes...");
      window.diagnoseBatches(eventId);
      toast.success("Diagnóstico concluído! Verifique o console do navegador.");
    } else {
      console.error('Ferramenta de diagnóstico não encontrada.');
      toast.error('Ferramenta de diagnóstico não encontrada. Verifique a importação do script.');
    }
  };

  const fixAllBatches = () => {
    if (!eventId) {
      toast.error("ID do evento não encontrado");
      return;
    }
    
    if (window.fixAllBatchesForEvent) {
      if (confirm("Tem certeza que deseja corrigir o status de todos os lotes? Esta ação atualizará o status com base na disponibilidade de ingressos.")) {
        toast.info("Corrigindo status de lotes...");
        window.fixAllBatchesForEvent(eventId);
        toast.success("Status dos lotes foram corrigidos! Recarregue a página para ver as atualizações.");
      }
    } else {
      console.error('Ferramenta de correção não encontrada.');
      toast.error('Ferramenta de correção não encontrada.');
    }
  };

  const fixAvailableTickets = () => {
    if (!eventId) {
      toast.error("ID do evento não encontrado");
      return;
    }
    
    if (window.fixAvailableTickets) {
      if (confirm("Tem certeza que deseja corrigir a disponibilidade de ingressos? Esta ação definirá available_tickets = total_tickets para todos os lotes.")) {
        toast.info("Corrigindo disponibilidade de ingressos...");
        window.fixAvailableTickets(eventId);
        toast.success("Disponibilidade de ingressos corrigida! Recarregue a página para ver as atualizações.");
      }
    } else {
      console.error('Ferramenta de correção de available_tickets não encontrada.');
      toast.error('Ferramenta de correção não encontrada.');
    }
  };

  const logBatchDetails = () => {
    if (!eventId) {
      toast.error("ID do evento não encontrado");
      return;
    }
    
    if (window.logBatchDetails) {
      toast.info("Analisando detalhes dos lotes...");
      window.logBatchDetails(eventId);
      toast.success("Análise concluída! Verifique o console do navegador.");
    } else {
      console.error('Ferramenta de log detalhado não encontrada.');
      toast.error('Ferramenta de log detalhado não encontrada.');
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-lg font-medium">Ferramentas de Diagnóstico:</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={runBatchDebugger}>
          Diagnosticar Lotes
        </Button>
        <Button variant="outline" className="bg-blue-50" onClick={fixAvailableTickets}>
          Corrigir Disponibilidade
        </Button>
        <Button variant="destructive" onClick={fixAllBatches}>
          Corrigir Status
        </Button>
        <Button variant="outline" className="bg-purple-50" onClick={logBatchDetails}>
          Log Detalhado
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Para ver os resultados, abra o Console do navegador (pressione F12 e clique na aba "Console").
      </p>
    </div>
  );
};
