
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Event } from "@/types";

interface EventTicketCountProps {
  event: Event;
  onManageBatches: (eventId: string) => void;
}

export const EventTicketCount = ({ event, onManageBatches }: EventTicketCountProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="font-medium"
            onClick={() => onManageBatches(event.id)}
          >
            <Ticket className="h-3 w-3 mr-1" />
            <span>{event.approved_tickets || 0}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <div>Aprovados: {event.approved_tickets || 0}</div>
            <div>Pendentes: {event.pending_tickets || 0}</div>
            <div>Reembolsados: {event.refunded_tickets || 0}</div>
            <div className="pt-1 text-primary">Clique para gerenciar lotes</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
