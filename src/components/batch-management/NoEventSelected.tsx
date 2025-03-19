
import { Button } from "@/components/ui/button";

interface NoEventSelectedProps {
  onNavigateToEvents: () => void;
}

export const NoEventSelected = ({ onNavigateToEvents }: NoEventSelectedProps) => {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Selecione um Evento</h1>
      </div>
      <p className="text-center py-8">
        Você precisa selecionar um evento para adicionar lotes.
        <Button 
          className="block mx-auto mt-4"
          onClick={onNavigateToEvents}
        >
          Voltar para a lista de eventos
        </Button>
      </p>
    </div>
  );
};
