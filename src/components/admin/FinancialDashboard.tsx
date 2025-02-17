
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MetricsCards } from "./financial/MetricsCards";
import { RevenueChart } from "./financial/RevenueChart";
import { DailySalesChart } from "./financial/DailySalesChart";
import { PaymentMethodsChart } from "./financial/PaymentMethodsChart";

export function FinancialDashboard() {
  // Dados gerais financeiros
  const { data: financialMetrics } = useQuery({
    queryKey: ["financial-metrics"],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from("events")
        .select("id, title, date, gross_revenue, net_revenue, approved_tickets")
        .order("date", { ascending: false })
        .limit(10);

      if (error) throw error;
      console.log("Financial metrics:", events);
      return events;
    },
  });

  // Vendas por forma de pagamento
  const { data: paymentMethodMetrics } = useQuery({
    queryKey: ["payment-method-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_preferences")
        .select("payment_type, status")
        .eq("status", "approved");

      if (error) throw error;

      const metrics = data.reduce((acc: any, curr) => {
        const type = curr.payment_type || "outros";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(metrics).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  // Vendas diárias dos últimos 30 dias
  const { data: dailySales } = useQuery({
    queryKey: ["daily-sales"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("payment_preferences")
        .select("created_at, total_amount")
        .eq("status", "approved")
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (error) throw error;

      const salesByDay = data.reduce((acc: any, curr) => {
        const date = format(new Date(curr.created_at), "dd/MM", { locale: ptBR });
        acc[date] = (acc[date] || 0) + Number(curr.total_amount);
        return acc;
      }, {});

      return Object.entries(salesByDay).map(([date, amount]) => ({
        date,
        amount,
      }));
    },
  });

  const totalRevenue = financialMetrics?.reduce((acc, event) => acc + (event.gross_revenue || 0), 0) || 0;
  const totalTickets = financialMetrics?.reduce((acc, event) => acc + (event.approved_tickets || 0), 0) || 0;
  const averageTicketPrice = totalTickets ? totalRevenue / totalTickets : 0;

  return (
    <div className="space-y-8">
      <MetricsCards
        totalRevenue={totalRevenue}
        totalTickets={totalTickets}
        averageTicketPrice={averageTicketPrice}
      />
      <RevenueChart data={financialMetrics || []} />
      <DailySalesChart data={dailySales || []} />
      <PaymentMethodsChart data={paymentMethodMetrics || []} />
    </div>
  );
}
