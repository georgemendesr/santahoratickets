
import { Event } from "@/types";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventInfoProps {
  event: Event;
  getLowStockAlert?: (availableTickets: number) => React.ReactNode;
  soldOut?: boolean;
}

export function EventInfo({ event, getLowStockAlert = () => null, soldOut = false }: EventInfoProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString;
    }
  };

  const formatTime = (timeString: string | undefined) => {
    try {
      if (!timeString) return "";
      
      // Verificar se é um objeto Date ou uma string de data completa
      if (timeString.includes('T') || timeString.includes('-')) {
        const date = new Date(timeString);
        return format(date, "HH:mm", { locale: ptBR });
      }
      
      // Se for apenas uma string de hora (HH:MM:SS)
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return format(date, "HH:mm", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar hora:", error);
      return timeString || "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm">{formatDate(event.date)}</span>
          {event.time && (
            <>
              <span className="mx-1">•</span>
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatTime(event.time)}</span>
            </>
          )}
        </div>
        <div className="flex items-center text-muted-foreground mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{event.location}</span>
        </div>
      </div>
      
      <div>
        {event.description && (
          <p className="text-sm">{event.description}</p>
        )}
      </div>
      
      {soldOut ? (
        <p className="text-sm text-red-600 font-medium">
          Ingressos esgotados
        </p>
      ) : (
        getLowStockAlert(event.available_tickets)
      )}
    </div>
  );
}
