
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Info } from "lucide-react";
import { LoyaltyPointsHistory } from "@/types";
import { QueryBuilder } from "@/utils/queryBuilder";

interface PointsHistoryProps {
  userId?: string;
}

export function PointsHistory({ userId }: PointsHistoryProps) {
  const [transactions, setTransactions] = useState<LoyaltyPointsHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointsHistory = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const query = new QueryBuilder<LoyaltyPointsHistory>("loyalty_points_history")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
          
        const data = await query.execute();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsHistory();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-10">
          <p className="text-muted-foreground">Carregando histórico de pontos...</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="rounded-full bg-purple-100 p-3 mb-4">
            <Info className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-muted-foreground text-center">
            Você ainda não possui histórico de pontos.
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Compre ingressos ou receba indicações para acumular pontos!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Histórico de Pontos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${transaction.points > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Star className={`h-5 w-5 ${transaction.points > 0 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
                <div>
                  <p className="font-medium">{transaction.reason}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString('pt-BR', { 
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
