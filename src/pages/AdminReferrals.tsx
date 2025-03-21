
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ArrowUpRight, Settings, Users, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminReferrals = () => {
  const { data: referralStats } = useQuery({
    queryKey: ["referral-stats"],
    queryFn: async () => {
      // Mock data - In a real application, fetch from Supabase
      return {
        totalReferrals: 128,
        conversionRate: 68,
        pointsAwarded: 4350,
        topReferrer: "João Silva",
        referralsByMonth: [
          { month: 'Jan', referrals: 12 },
          { month: 'Feb', referrals: 19 },
          { month: 'Mar', referrals: 8 },
          { month: 'Apr', referrals: 22 },
          { month: 'May', referrals: 16 },
          { month: 'Jun', referrals: 25 },
        ]
      };
    },
  });

  return (
    <AdminLayout>
      <div className="container max-w-7xl mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Sistema de Referral</h1>
            <p className="text-muted-foreground mt-1">Gerencie e acompanhe o programa de indicações</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Indicações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {referralStats?.totalReferrals || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {referralStats?.conversionRate || 0}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pontos Concedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {referralStats?.pointsAwarded || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Maior Indicador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">
                {referralStats?.topReferrer || "-"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Indicações por Mês</CardTitle>
              <CardDescription>
                Evolução de indicações nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referralStats?.referralsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="referrals" name="Indicações" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento</CardTitle>
              <CardDescription>Opções de gerenciamento do programa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Indicadores
                </Button>
                <Button className="w-full" variant="outline">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Ver Códigos de Indicação
                </Button>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Relatório Detalhado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReferrals;
