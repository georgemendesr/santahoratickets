
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { MetricsCards } from "@/components/admin/dashboard/MetricsCards";
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts";
import { ActionCards } from "@/components/admin/dashboard/ActionCards";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  
  // Simplificamos a consulta e adicionamos tratamento de erro mais robusto
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard-events"],
    queryFn: async () => {
      console.log("Tentando buscar dados do dashboard...");
      
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: false })
          .limit(5);
          
        if (error) {
          console.error("Erro na consulta ao Supabase:", error);
          throw new Error(error.message);
        }
        
        console.log("Dados recuperados com sucesso:", data);
        return data || [];
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        throw err;
      }
    },
  });

  // Em caso de erro, exibimos uma mensagem amigável
  if (error) {
    console.error("Erro capturado pelo React Query:", error);
    return (
      <AdminLayout>
        <div className="container mx-auto max-w-7xl">
          <DashboardHeader />
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-800 mb-8">
            <h3 className="text-lg font-medium mb-2">Erro ao carregar dados</h3>
            <p>{error instanceof Error ? error.message : "Erro desconhecido"}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-red-800"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Estado de carregamento
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto max-w-7xl">
          <DashboardHeader />
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
            <span className="ml-3">Carregando dados do dashboard...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Garantimos que os dados estarão disponíveis
  const events = data || [];
  
  // Cálculos de métricas com verificações de segurança
  const totalRevenue = events.reduce((acc, event) => acc + (Number(event?.gross_revenue) || 0), 0);
  const totalTickets = events.reduce((acc, event) => acc + (Number(event?.approved_tickets) || 0), 0);
  const eventsCount = events.length;
  const averageTicket = totalTickets > 0 ? totalRevenue / totalTickets : 0;

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl">
        <DashboardHeader />
        
        <MetricsCards 
          totalRevenue={totalRevenue} 
          totalTickets={totalTickets}
          eventsCount={eventsCount}
          averageTicket={averageTicket}
        />

        {events.length > 0 ? (
          <DashboardCharts events={events} />
        ) : (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800 mb-8">
            <p className="text-center">Nenhum evento encontrado. Crie seu primeiro evento para visualizar as estatísticas.</p>
          </div>
        )}

        <ActionCards />
      </div>
    </AdminLayout>
  );
};

export default Admin;
