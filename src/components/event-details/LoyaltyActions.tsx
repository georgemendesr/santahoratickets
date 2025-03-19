
import { Button } from "@/components/ui/button";
import { Ticket, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LoyaltyActions = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline"
        onClick={() => navigate('/meus-vouchers')}
        className="flex-1 flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
      >
        <Ticket className="h-4 w-4" />
        Meus Vouchers
      </Button>
      <Button
        onClick={() => navigate('/recompensas')}
        className="flex-1 flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
      >
        <Gift className="h-4 w-4" />
        Trocar Pontos
      </Button>
    </div>
  );
};
