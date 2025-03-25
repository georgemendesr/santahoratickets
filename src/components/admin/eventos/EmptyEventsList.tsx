
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle } from "lucide-react";
import { EventFilter } from "@/hooks/useEventsQuery";

interface EmptyEventsListProps {
  filter: EventFilter;
  onCreateEvent: () => void;
}

export const EmptyEventsList = ({ filter, onCreateEvent }: EmptyEventsListProps) => {
  return (
    <div className="text-center py-12 border rounded-lg bg-muted/20">
      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
      <p className="text-muted-foreground mb-4">
        {filter === "todos" ? "Você ainda não possui eventos cadastrados." : 
         `Não há eventos ${filter === "ativos" ? "ativos" : "passados"}.`}
      </p>
      <Button 
        onClick={onCreateEvent}
        variant="outline"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Criar Evento
      </Button>
    </div>
  );
};
