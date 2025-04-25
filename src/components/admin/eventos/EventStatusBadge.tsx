
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Event } from "@/types";
import { format, isToday, isBefore, parseISO } from "date-fns";

interface EventStatusBadgeProps {
  event: Event;
  onToggleStatus: (event: Event) => void;
}

export const EventStatusBadge = ({ event, onToggleStatus }: EventStatusBadgeProps) => {
  const getEventStatus = (event: Event) => {
    // Analisar a string de data para criar um objeto Date
    // Combinando a data e hora para ter uma comparação precisa
    const eventDateTime = new Date(
      `${event.date}T${event.time || '00:00'}:00`
    );
    
    const today = new Date();
    
    if (event.status === 'draft') return { label: 'Rascunho', variant: 'secondary' as const };
    if (event.status === 'ended') return { label: 'Finalizado', variant: 'secondary' as const };
    
    // Comparar apenas as datas, ignorando as horas para determinar se é antes ou depois de hoje
    if (isBefore(eventDateTime, today) && !isToday(eventDateTime)) {
      return { label: 'Passado', variant: 'secondary' as const };
    } else if (isToday(eventDateTime)) {
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
