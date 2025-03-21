
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { MetricsCards } from "@/components/admin/dashboard/MetricsCards";
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts";
import { ActionCards } from "@/components/admin/dashboard/ActionCards";

const Admin = () => {
  const { session } = useAuth();
  const { isAdmin } = useRole(session);

  const { data: dashboardData } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);

      return events;
    },
  });

  const totalRevenue = dashboardData?.reduce((acc, event) => acc + (event?.gross_revenue || 0), 0) || 0;
  const totalTickets = dashboardData?.reduce((acc, event) => acc + (event?.approved_tickets || 0), 0) || 0;
  const eventsCount = dashboardData?.length || 0;
  const averageTicket = totalTickets ? totalRevenue / totalTickets : 0;

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

        <DashboardCharts events={dashboardData || []} />

        <ActionCards />
      </div>
    </AdminLayout>
  );
};

export default Admin;
