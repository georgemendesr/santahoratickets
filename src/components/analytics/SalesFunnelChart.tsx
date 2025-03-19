
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface SalesFunnelChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

type FunnelData = {
  name: string;
  value: number;
  fill: string;
};

export function SalesFunnelChart({ dateRange }: SalesFunnelChartProps) {
  const { toast } = useToast();
  
  const { data: funnelData, isLoading } = useQuery({
    queryKey: ["sales-funnel", dateRange.from, dateRange.to],
    queryFn: async () => {
      try {
        // Em um cenário real, estes dados viriam de um endpoint específico
        // Esta é uma simulação para fins de demonstração
        
        // Visitantes (visualizações de página)
        const { data: viewsData, error: viewsError } = await supabase
          .from("events")
          .select("views")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString());
          
        if (viewsError) throw viewsError;
        
        // Checkouts iniciados
        const { data: checkoutsData, error: checkoutsError } = await supabase
          .from("payment_preferences")
          .select("id")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString());
          
        if (checkoutsError) throw checkoutsError;
        
        // Pagamentos pendentes
        const { data: pendingData, error: pendingError } = await supabase
          .from("payment_preferences")
          .select("id")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString())
          .eq("status", "pending");
          
        if (pendingError) throw pendingError;
        
        // Compras finalizadas
        const { data: purchasesData, error: purchasesError } = await supabase
          .from("payment_preferences")
          .select("id")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString())
          .eq("status", "approved");
          
        if (purchasesError) throw purchasesError;
        
        // Cálculo dos números do funil
        const visitors = viewsData ? viewsData.reduce((sum, event) => sum + (event.views || 0), 0) : 0;
        const checkouts = checkoutsData ? checkoutsData.length : 0;
        const pending = pendingData ? pendingData.length : 0;
        const purchases = purchasesData ? purchasesData.length : 0;
        
        return [
          { name: 'Visitantes', value: visitors, fill: '#4f46e5' },
          { name: 'Checkouts', value: checkouts, fill: '#3b82f6' },
          { name: 'Pendentes', value: pending, fill: '#f59e0b' },
          { name: 'Compras', value: purchases, fill: '#10b981' }
        ] as FunnelData[];
      } catch (error) {
        toast({
          title: "Erro ao carregar dados do funil",
          description: "Não foi possível obter os dados do funil de vendas",
          variant: "destructive",
        });
        console.error("Erro ao carregar dados do funil:", error);
        return [] as FunnelData[];
      }
    }
  });
  
  const placeholderData = [
    { name: 'Visitantes', value: 0, fill: '#4f46e5' },
    { name: 'Checkouts', value: 0, fill: '#3b82f6' },
    { name: 'Pendentes', value: 0, fill: '#f59e0b' },
    { name: 'Compras', value: 0, fill: '#10b981' }
  ];
  
  const data = funnelData || placeholderData;

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Carregando dados do funil...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip 
          formatter={(value) => [value, 'Quantidade']}
          labelFormatter={(label) => `Estágio: ${label}`}
        />
        <Bar dataKey="value" fill="#8884d8" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
}
