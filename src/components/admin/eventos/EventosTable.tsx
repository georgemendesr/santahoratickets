
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Event } from "@/types";
import { EventStatusBadge } from "./EventStatusBadge";
import { EventTicketCount } from "./EventTicketCount";
import { EventActions } from "./EventActions";

interface EventosTableProps {
  events: Event[];
  onViewEvent: (eventId: string) => void;
  onEditEvent: (eventId: string) => void;
  onManageBatches: (eventId: string) => void;
  onViewParticipants: (eventId: string) => void;
  onViewAnalytics: (eventId: string) => void;
  onDuplicateEvent: (eventId: string) => void;
  onToggleEventStatus: (event: Event) => void;
}

export const EventosTable = ({ 
  events, 
  onViewEvent, 
  onEditEvent, 
  onManageBatches, 
  onViewParticipants, 
  onViewAnalytics, 
  onDuplicateEvent,
  onToggleEventStatus
}: EventosTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-28">Status</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Local</TableHead>
          <TableHead className="text-center">Ingressos</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id} className="group">
            <TableCell>
              <EventStatusBadge 
                event={event} 
                onToggleStatus={onToggleEventStatus} 
              />
            </TableCell>
            <TableCell>
              <button
                onClick={() => onEditEvent(event.id)}
                className="font-medium hover:underline text-left w-full"
              >
                {event.title}
              </button>
            </TableCell>
            <TableCell>
              {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
            </TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell className="text-center">
              <EventTicketCount 
                event={event} 
                onManageBatches={onManageBatches} 
              />
            </TableCell>
            <TableCell className="text-right">
              <EventActions 
                eventId={event.id} 
                onViewEvent={onViewEvent}
                onEditEvent={onEditEvent}
                onManageBatches={onManageBatches}
                onViewParticipants={onViewParticipants}
                onViewAnalytics={onViewAnalytics}
                onDuplicateEvent={onDuplicateEvent}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
