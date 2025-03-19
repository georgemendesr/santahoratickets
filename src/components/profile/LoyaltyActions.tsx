
import { Button } from "@/components/ui/button";
import { Gift, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LoyaltyActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={() => navigate("/recompensas")}
        className="flex items-center gap-2"
      >
        <Gift className="h-4 w-4" />
        Ver Recompensas
      </Button>
      
      <Button
        variant="outline"
        onClick={() => navigate("/meus-vouchers")}
        className="flex items-center gap-2"
      >
        <Ticket className="h-4 w-4" />
        Meus Vouchers
      </Button>
    </div>
  );
};
