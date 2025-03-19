
import { Link } from "react-router-dom";
import { Event } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, Calendar, Clock, Ticket } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
  batchInfo: {
    name: string;
    class: string;
  };
  onPurchase: () => void;
  isPending: boolean;
}

export function EventCard({ event, batchInfo, onPurchase, isPending }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link to={`/events/${event.id}`} className="block">
        <div className="relative aspect-[16/9] group">
          <img
            src="/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png"
            alt={event.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{event.title}</span>
          <span className={batchInfo.class}>{batchInfo.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.date), "PPPP", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]" 
          onClick={onPurchase}
          disabled={isPending}
        >
          <Ticket className="mr-2 h-4 w-4" />
          Comprar Pulseira
        </Button>
      </CardFooter>
    </Card>
  );
}
