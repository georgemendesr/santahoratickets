
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BatchForm } from "@/components/batch-management/BatchForm";
import { NoEventSelected } from "@/components/batch-management/NoEventSelected";
import { useBatchOrderNumber } from "@/hooks/useBatchOrderNumber";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/useNavigation";
import { toast } from "sonner";

const AdminBatches = () => {
  const { goToAdminEvents } = useNavigation();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id");
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const { orderNumber, incrementOrderNumber } = useBatchOrderNumber(eventId);

  // Usando useEffect para evitar o warning de navegação durante a renderização
  useEffect(() => {
    if (!isAdmin) {
      goToAdminEvents();
    }
  }, [isAdmin, goToAdminEvents]);

  useEffect(() => {
    if (!eventId) {
      console.log("Nenhum evento selecionado");
    } else {
      console.log(`Gerenciando lotes para o evento: ${eventId}, próximo número de ordem: ${orderNumber}`);
    }
  }, [eventId, orderNumber]);

  if (!eventId) {
    return (
      <AdminLayout>
        <NoEventSelected onNavigateToEvents={goToAdminEvents} />
      </AdminLayout>
    );
  }

  const handleSuccess = () => {
    incrementOrderNumber();
    toast.success("Lote criado com sucesso!");
  };

  return (
    <AdminLayout>
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciamento de Lotes</h1>
          <Button variant="outline" onClick={goToAdminEvents}>
            Voltar para Eventos
          </Button>
        </div>
        
        <BatchForm 
          eventId={eventId} 
          orderNumber={orderNumber}
          onCancel={goToAdminEvents}
          onSuccess={handleSuccess}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminBatches;
