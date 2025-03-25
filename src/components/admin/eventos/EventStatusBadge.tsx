
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Event } from "@/types";

interface EventStatusBadgeProps {
  event: Event;
  onToggleStatus: (event: Event) => void;
}

export const EventStatusBadge = ({ event, onToggleStatus }: EventStatusBadgeProps) => {
  const getEventStatus = (event: Event) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    
    if (event.status === 'draft') return { label: 'Rascunho', variant: 'secondary' as const };
    if (event.status === 'ended') return { label: 'Finalizado', variant: 'secondary' as const };
    
    if (eventDate < today) {
      return { label: 'Passado', variant: 'secondary' as const };
    } else if (eventDate.toDateString() === today.toDateString()) {
      return { label: 'Hoje', variant: 'destructive' as const };
    } else {
      return { label: 'Ativo', variant: 'default' as const };
    }
  };

  const status = getEventStatus(event);
  
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Switch 
              checked={event.status === 'published'} 
              onCheckedChange={() => onToggleStatus(event)}
            />
          </TooltipTrigger>
          <TooltipContent>
            {event.status === 'published' ? 'Arquivar evento' : 'Publicar evento'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Badge variant={status.variant}>{status.label}</Badge>
    </div>
  );
};
