
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoyaltyPointsHistory } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { PointsHistoryList } from "./PointsHistoryList";
import { EmptyPointsHistory } from "./EmptyPointsHistory";
import { PointsHistoryLoading } from "./PointsHistoryLoading";

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
        const { data, error } = await supabase
          .from("loyalty_points_history")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
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
        <PointsHistoryLoading />
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <EmptyPointsHistory />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Histórico de Pontos</CardTitle>
      </CardHeader>
      <CardContent>
        <PointsHistoryList transactions={transactions} />
      </CardContent>
    </Card>
  );
}
