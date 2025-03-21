
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Event } from '@/types/event.types';

interface EventInfoCardProps {
  event: Event;
}

export const EventInfoCard: React.FC<EventInfoCardProps> = ({ event }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Informações do Evento</CardTitle>
        <CardDescription>Detalhes básicos do evento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">ID do Evento</p>
            <p className="text-sm text-muted-foreground">{event.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Título</p>
            <p className="text-sm text-muted-foreground">{event.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Data</p>
            <p className="text-sm text-muted-foreground">{event.date} às {event.time}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Local</p>
            <p className="text-sm text-muted-foreground">{event.location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
