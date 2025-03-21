
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Share } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EventActionsProps {
  event: Event;
  isAdmin: boolean;
  onPurchase: () => void;
  onShare: () => void;
  onEdit: () => void;
  soldOut?: boolean; // Nova propriedade
}

export function EventActions({ 
  event, 
  isAdmin, 
  onPurchase, 
  onShare, 
  onEdit,
  soldOut = false
}: EventActionsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button 
          className="w-full" 
          size="lg"
          onClick={onPurchase}
          disabled={soldOut} // Desabilitar o botão se estiver esgotado
        >
          {soldOut ? "Ingressos Esgotados" : "Comprar Pulseira"}
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onShare}
          >
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          
          {isAdmin && (
            <Button 
              variant="outline" 
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="text-sm text-muted-foreground">
        <p>
          Ao comprar, você está de acordo com os termos e condições do evento.
        </p>
      </div>
    </div>
  );
}
