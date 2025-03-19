
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { PointsHistory } from "@/components/loyalty/PointsHistory";

interface PointsHistoryCardProps {
  userId?: string;
}

export const PointsHistoryCard = ({ userId }: PointsHistoryCardProps) => {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Pontos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PointsHistory userId={userId} />
      </CardContent>
    </Card>
  );
};
