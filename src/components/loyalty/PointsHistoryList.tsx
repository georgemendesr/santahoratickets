
import { LoyaltyPointsHistory } from "@/types";
import { PointsHistoryItem } from "./PointsHistoryItem";

interface PointsHistoryListProps {
  transactions: LoyaltyPointsHistory[];
}

export const PointsHistoryList = ({ transactions }: PointsHistoryListProps) => {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <PointsHistoryItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};
