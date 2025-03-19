
import { Button } from "@/components/ui/button";
import { Gift, Ticket } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

export const LoyaltyActions = () => {
  const { goToRewards, goToMyVouchers } = useNavigation();

  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={goToRewards}
        className="flex items-center gap-2"
      >
        <Gift className="h-4 w-4" />
        Ver Recompensas
      </Button>
      
      <Button
        variant="outline"
        onClick={goToMyVouchers}
        className="flex items-center gap-2"
      >
        <Ticket className="h-4 w-4" />
        Meus Vouchers
      </Button>
    </div>
  );
};
