
import { Star } from "lucide-react";
import { LoyaltyPointsHistory } from "@/types";

interface PointsHistoryItemProps {
  transaction: LoyaltyPointsHistory;
}

export const PointsHistoryItem = ({ transaction }: PointsHistoryItemProps) => {
  return (
    <div 
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 ${transaction.points > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
          <Star className={`h-5 w-5 ${transaction.points > 0 ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <div>
          <p className="font-medium">{transaction.reason}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(transaction.created_at || '').toLocaleDateString('pt-BR', { 
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      <div className={`font-semibold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {transaction.points > 0 ? '+' : ''}{transaction.points} pontos
      </div>
    </div>
  );
};
