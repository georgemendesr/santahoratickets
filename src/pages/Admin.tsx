
import React, { useEffect } from "react";
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
  
  // Use a simpler query without complex error handling that might be causing issues
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-dashboard-events"],
    queryFn: async () => {
      console.log("Fetching admin dashboard data...");
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      console.log("Dashboard data fetched:", data);
      return data || [];
    },
  });

  // Simple calculations for metrics
  const totalRevenue = events.reduce((acc, event) => acc + (event?.gross_revenue || 0), 0);
  const totalTickets = events.reduce((acc, event) => acc + (event?.approved_tickets || 0), 0);
  const eventsCount = events.length;
  const averageTicket = totalTickets ? totalRevenue / totalTickets : 0;

  // Simple loading state display
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <span className="ml-3">Carregando dados...</span>
        </div>
      </AdminLayout>
    );
  }

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
