
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { DateRange } from "react-day-picker";

interface EventPerformanceProps {
  dateRange: DateRange;
}

type EventData = {
  name: string;
  tickets: number;
  revenue: number;
};

export function EventPerformance({ dateRange }: EventPerformanceProps) {
  const { toast } = useToast();
  
  const { data: performanceData, isLoading } = useQuery({
    queryKey: ["event-performance", dateRange.from, dateRange.to],
    queryFn: async () => {
      try {
        // Verificar se temos datas válidas para consulta
        if (!dateRange.from || !dateRange.to) {
          return [] as EventData[];
        }
        
        // Buscar eventos no período selecionado
        const { data: events, error: eventsError } = await supabase
          .from("events")
          .select("id, title")
          .gte("date", dateRange.from.toISOString())
          .lte("date", dateRange.to.toISOString())
          .order("date", { ascending: false })
          .limit(5);
          
        if (eventsError) throw eventsError;
        
        if (!events || events.length === 0) {
          return [];
        }
        
        // Para cada evento, buscar dados de vendas
        const eventPerformance = await Promise.all(events.map(async (event) => {
          // Buscar pagamentos aprovados para o evento
          const { data: payments, error: paymentsError } = await supabase
            .from("payment_preferences")
            .select("total_amount, ticket_quantity")
            .eq("event_id", event.id)
            .eq("status", "approved");
            
          if (paymentsError) throw paymentsError;
          
          // Calcular total de tickets e receita
          const tickets = payments ? payments.reduce((sum, payment) => sum + (payment.ticket_quantity || 0), 0) : 0;
          const revenue = payments ? payments.reduce((sum, payment) => sum + (payment.total_amount || 0), 0) : 0;
          
          return {
            name: event.title.length > 15 ? event.title.substring(0, 15) + "..." : event.title,
            tickets,
            revenue: parseFloat(revenue.toFixed(2))
          };
        }));
        
        return eventPerformance;
      } catch (error) {
        toast({
          title: "Erro ao carregar performance de eventos",
          description: "Não foi possível obter os dados de performance",
          variant: "destructive",
        });
        console.error("Erro ao carregar performance de eventos:", error);
        return [] as EventData[];
      }
    }
  });
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Carregando dados de performance...</div>;
  }
  
  if (!performanceData || performanceData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-muted-foreground">Nenhum evento encontrado no período selecionado</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={performanceData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="tickets" name="Ingressos" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="revenue" name="Receita (R$)" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
