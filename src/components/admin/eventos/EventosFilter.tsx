
import { Button } from "@/components/ui/button";
import { EventFilter } from "@/hooks/useEventsQuery";

interface EventosFilterProps {
  currentFilter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
}

export const EventosFilter = ({ currentFilter, onFilterChange }: EventosFilterProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button 
        variant={currentFilter === "todos" ? "default" : "outline"}
        onClick={() => onFilterChange("todos")}
        size="sm"
      >
        Todos
      </Button>
      <Button 
        variant={currentFilter === "ativos" ? "default" : "outline"}
        onClick={() => onFilterChange("ativos")}
        size="sm"
      >
        Ativos
      </Button>
      <Button 
        variant={currentFilter === "passados" ? "default" : "outline"}
        onClick={() => onFilterChange("passados")}
        size="sm"
      >
        Encerrados
      </Button>
    </div>
  );
};
