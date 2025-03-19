
import { Button } from "@/components/ui/button";
import { Edit, Ticket } from "lucide-react";
import { Event } from "@/types";
import { ShareButtons } from "@/components/home/ShareButtons";

interface EventActionsProps {
  event: Event;
  isAdmin: boolean;
  onPurchase: () => void;
  onShare: () => void;
  onEdit: () => void;
}

export function EventActions({ 
  event, 
  isAdmin, 
  onPurchase, 
  onShare, 
  onEdit 
}: EventActionsProps) {
  return (
    <div className="space-y-4">
      <Button 
        className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold shadow-lg" 
        onClick={onPurchase}
        disabled={event.available_tickets === 0}
      >
        <Ticket className="mr-2 h-4 w-4" />
        Comprar Pulseira
      </Button>
      
      <div className="flex gap-2">
        <ShareButtons 
          url={window.location.href} 
          title={event.title} 
          variant="full" 
        />
        
        {isAdmin && (
          <Button
            variant="outline"
            onClick={onEdit}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </div>
    </div>
  );
}
