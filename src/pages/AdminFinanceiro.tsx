
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { MainLayout } from "@/components/layout/MainLayout";
import { FinancialDashboard } from "@/components/admin/FinancialDashboard";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { exportFinancialData } from "@/utils/exportFinancialData";
import { exportSupabaseData } from "@/utils/exportSupabaseData";
import { toast } from "sonner";

const AdminFinanceiro = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isAdmin } = useRole(session);

  const { data: financialData } = useQuery({
    queryKey: ["financial-export-data"],
    queryFn: async () => {
      // Usando o tipo correto da tabela events
      const { data, error } = await supabase
        .from('events')
        .select('title, date, gross_revenue, net_revenue, approved_tickets')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  const handleExportData = () => {
    if (!financialData?.length) {
      toast.error("Não há dados para exportar");
      return;
    }

    try {
      exportFinancialData(financialData);
      toast.success("Relatório exportado com sucesso");
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Erro ao exportar relatório");
    }
  };

  const handleExportSupabaseData = async () => {
    try {
      await exportSupabaseData();
      toast.success("Dados do Supabase exportados com sucesso");
    } catch (error) {
      console.error("Erro ao exportar dados do Supabase:", error);
      toast.error("Erro ao exportar dados do Supabase");
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
          <div className="flex gap-4">
            <Button onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
            <Button variant="outline" onClick={handleExportSupabaseData}>
              <Database className="mr-2 h-4 w-4" />
              Exportar Dados Supabase
            </Button>
          </div>
        </div>
        <FinancialDashboard />
      </div>
    </MainLayout>
  );
};

export default AdminFinanceiro;
