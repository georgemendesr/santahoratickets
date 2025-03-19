
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BatchForm } from "@/components/batch-management/BatchForm";
import { NoEventSelected } from "@/components/batch-management/NoEventSelected";
import { useBatchOrderNumber } from "@/hooks/useBatchOrderNumber";
import { Button } from "@/components/ui/button";

const AdminBatches = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id");
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const { orderNumber, incrementOrderNumber } = useBatchOrderNumber(eventId);

  // Usando useEffect para evitar o warning de navegação durante a renderização
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!eventId) {
    return (
      <AdminLayout>
        <NoEventSelected onNavigateToEvents={() => navigate("/admin/eventos")} />
      </AdminLayout>
    );
  }

  const handleSuccess = () => {
    incrementOrderNumber();
  };

  return (
    <AdminLayout>
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciamento de Lotes</h1>
          <Button variant="outline" onClick={() => navigate("/admin/eventos")}>
            Voltar para Eventos
          </Button>
        </div>
        
        <BatchForm 
          eventId={eventId} 
          orderNumber={orderNumber}
          onCancel={() => navigate("/admin/eventos")}
          onSuccess={handleSuccess}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminBatches;
