
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
  soldOut?: boolean;
  hasSelectedQuantity?: boolean;
  selectedQuantity?: number;
}

export function EventActions({ 
  event, 
  isAdmin, 
  onPurchase, 
  onShare, 
  onEdit,
  soldOut = false,
  hasSelectedQuantity = false,
  selectedQuantity = 0
}: EventActionsProps) {
  // Determine o texto do botão baseado no estado
  const getPurchaseButtonText = () => {
    if (soldOut) return "Ingressos Esgotados";
    if (hasSelectedQuantity) return `Comprar ${selectedQuantity} Pulseira${selectedQuantity > 1 ? 's' : ''}`;
    return "Comprar Pulseira";
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button 
          className="w-full" 
          size="lg"
          onClick={onPurchase}
          disabled={soldOut || !hasSelectedQuantity} // Desabilitar se esgotado ou nenhuma quantidade selecionada
        >
          {getPurchaseButtonText()}
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
