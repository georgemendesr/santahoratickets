
import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Share, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface EventActionsProps {
  event: Event;
  isAdmin: boolean;
  onPurchase: () => void;
  onShare: () => void;
  onEdit?: () => void;
  soldOut?: boolean;
  hasSelectedQuantity?: boolean;
  selectedQuantity?: number;
  batchId?: string;
  isLoggedIn?: boolean;
}

export function EventActions({ 
  event, 
  isAdmin, 
  onPurchase, 
  onShare, 
  onEdit,
  soldOut = false,
  hasSelectedQuantity = false,
  selectedQuantity = 0,
  batchId,
  isLoggedIn = false
}: EventActionsProps) {
  const navigate = useNavigate();
  
  // Determine o texto do botão baseado no estado
  const getPurchaseButtonText = () => {
    if (soldOut) return "Ingressos Esgotados";
    if (hasSelectedQuantity) return `Comprar ${selectedQuantity} Pulseira${selectedQuantity > 1 ? 's' : ''}`;
    return "Comprar Pulseira";
  };
  
  // Função para iniciar checkout como convidado
  const handleGuestCheckout = () => {
    if (!hasSelectedQuantity || !batchId) return;
    navigate(`/checkout/${event.id}?batch=${batchId}&quantity=${selectedQuantity}&guest=true`);
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
          {isLoggedIn ? getPurchaseButtonText() : "Comprar com Cadastro"}
        </Button>
        
        {!isLoggedIn && (
          <Button
            className="w-full"
            variant="secondary"
            size="lg"
            onClick={handleGuestCheckout}
            disabled={soldOut || !hasSelectedQuantity}
          >
            Comprar sem Cadastro
          </Button>
        )}
        
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
