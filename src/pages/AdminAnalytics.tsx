
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SalesFunnelChart } from "@/components/analytics/SalesFunnelChart";
import { ConversionMetrics } from "@/components/analytics/ConversionMetrics";
import { EventPerformance } from "@/components/analytics/EventPerformance";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    to: new Date(),
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, navigate, toast]);

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics e Conversão</h1>
            <p className="text-muted-foreground">
              Monitore as métricas de performance e conversão dos seus eventos
            </p>
          </div>
          <DateRangePicker
            dateRange={dateRange}
            onChange={(range) => setDateRange(range)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <ConversionMetrics dateRange={dateRange} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
              <CardDescription>
                Acompanhe a jornada dos usuários do início ao fim da compra
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <SalesFunnelChart dateRange={dateRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance de Eventos</CardTitle>
              <CardDescription>
                Comparação de vendas entre eventos no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <EventPerformance dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
