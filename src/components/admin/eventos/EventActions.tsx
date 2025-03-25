
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Edit, 
  Ticket, 
  Users, 
  BarChart4,
  Copy,
  ChevronRight
} from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EventActionsProps {
  eventId: string;
  onViewEvent: (eventId: string) => void;
  onEditEvent: (eventId: string) => void;
  onManageBatches: (eventId: string) => void;
  onViewParticipants: (eventId: string) => void;
  onViewAnalytics: (eventId: string) => void;
  onDuplicateEvent: (eventId: string) => void;
}

export const EventActions = ({ 
  eventId, 
  onViewEvent, 
  onEditEvent, 
  onManageBatches, 
  onViewParticipants, 
  onViewAnalytics, 
  onDuplicateEvent 
}: EventActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onViewEvent(eventId)}
        title="Visualizar evento"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onEditEvent(eventId)}
        title="Editar evento"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onManageBatches(eventId)}
        title="Gerenciar lotes"
      >
        <Ticket className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onViewParticipants(eventId)}
        title="Ver participantes"
      >
        <Users className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onViewAnalytics(eventId)}
        title="Estatísticas"
      >
        <BarChart4 className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDuplicateEvent(eventId)}
        title="Duplicar evento"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="ml-1 lg:hidden group-hover:opacity-100 opacity-0 transition-opacity"
      >
        <a href={`/admin/eventos/${eventId}`}>
          <ChevronRight className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};
