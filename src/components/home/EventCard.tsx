
import { Link } from "react-router-dom";
import { Event } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, Calendar, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/integrations/supabase/utils";
import { ShareButtons } from "./ShareButtons";
import { getEventUrl } from "@/utils/navigation";
import { useNavigation } from "@/hooks/useNavigation";

interface EventCardProps {
  event: Event;
  batchInfo: {
    name: string;
    class: string;
  };
  onPurchase?: () => void;
  isPending?: boolean;
  imageSize?: 'default' | 'large';
}

export function EventCard({ 
  event, 
  batchInfo, 
  onPurchase, 
  isPending = false,
  imageSize = 'default'
}: EventCardProps) {
  const { goToEventDetails } = useNavigation();
  
  // Verificar se a imagem existe e formar a URL correta
  const imageUrl = event.image 
    ? (event.image.startsWith("http") 
       ? event.image 
       : (event.image.startsWith("/") 
         ? event.image 
         : getImageUrl(event.image).publicUrl))
    : "/lovable-uploads/c07e81e6-595c-4636-8fef-1f61c7240f65.png";
  
  // Verificar se o evento já aconteceu
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();
  
  // Usando a função padronizada getEventUrl
  const eventUrl = getEventUrl(event.id);
  
  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase();
    } else {
      goToEventDetails(event.id);
    }
  };
  
  const imageHeightClass = imageSize === 'large' 
    ? "aspect-[16/8]" 
    : "aspect-[16/9]";
  
  return (
    <Card className="overflow-hidden border border-muted/20 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <Link to={eventUrl} className="block">
        <div className={`relative ${imageHeightClass} group`}>
          <img
            src={imageUrl}
            alt={event.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${batchInfo.class} bg-white/90`}>
              {batchInfo.name}
            </span>
          </div>
        </div>
      </Link>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#8B5CF6]" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#8B5CF6]" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#8B5CF6]" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button 
          className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]" 
          onClick={handlePurchase}
          disabled={isPending}
        >
          <Ticket className="mr-2 h-4 w-4" />
          {isPastEvent ? "Ver Detalhes" : "Comprar Pulseira"}
        </Button>
        
        <ShareButtons 
          url={`${window.location.origin}${eventUrl}`}
          title={event.title}
          variant="full" 
          event={event}
        />
      </CardFooter>
    </Card>
  );
}
