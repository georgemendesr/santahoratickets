
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, ShoppingCart, CreditCard, TrendingUp } from "lucide-react";

interface ConversionMetricsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

type MetricData = {
  visitors: number;
  checkouts: number;
  purchases: number;
  conversionRate: number;
};

export function ConversionMetrics({ dateRange }: ConversionMetricsProps) {
  const { toast } = useToast();
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["conversion-metrics", dateRange.from, dateRange.to],
    queryFn: async () => {
      try {
        // Em um cenário real, esta lógica seria implementada no backend
        // Esta é uma simulação para fins de demonstração
        
        // Simulação de visitantes (usuários únicos que visualizaram eventos)
        const { data: viewsData, error: viewsError } = await supabase
          .from("events")
          .select("id, title, views")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString());
          
        if (viewsError) throw viewsError;
        
        // Simulação de checkouts iniciados
        const { data: checkoutsData, error: checkoutsError } = await supabase
          .from("payment_preferences")
          .select("id")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString());
          
        if (checkoutsError) throw checkoutsError;
        
        // Contagem de compras finalizadas
        const { data: purchasesData, error: purchasesError } = await supabase
          .from("payment_preferences")
          .select("id")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString())
          .eq("status", "approved");
          
        if (purchasesError) throw purchasesError;
        
        // Cálculo das métricas
        const visitors = viewsData ? viewsData.reduce((sum, event) => sum + (event.views || 0), 0) : 0;
        const checkouts = checkoutsData ? checkoutsData.length : 0;
        const purchases = purchasesData ? purchasesData.length : 0;
        const conversionRate = visitors > 0 ? (purchases / visitors) * 100 : 0;
        
        return {
          visitors,
          checkouts,
          purchases,
          conversionRate: parseFloat(conversionRate.toFixed(2))
        } as MetricData;
      } catch (error) {
        toast({
          title: "Erro ao carregar métricas",
          description: "Não foi possível obter os dados de conversão",
          variant: "destructive",
        });
        console.error("Erro ao carregar métricas de conversão:", error);
        return {
          visitors: 0,
          checkouts: 0,
          purchases: 0,
          conversionRate: 0
        } as MetricData;
      }
    }
  });
  
  const placeholderData = {
    visitors: 0,
    checkouts: 0,
    purchases: 0,
    conversionRate: 0
  };
  
  const data = metrics || placeholderData;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "--" : data.visitors.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Usuários únicos que visualizaram seus eventos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Checkouts Iniciados</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "--" : data.checkouts.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Usuários que iniciaram o processo de compra
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Compras Finalizadas</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "--" : data.purchases.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Pagamentos aprovados no período
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-full md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "--" : `${data.conversionRate}%`}</div>
          <p className="text-xs text-muted-foreground">
            Percentual de visitantes que realizaram compras
          </p>
        </CardContent>
      </Card>
    </>
  );
}
