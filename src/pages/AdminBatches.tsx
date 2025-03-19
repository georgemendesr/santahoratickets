
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { MainLayout } from "@/components/layout/MainLayout";
import { BatchForm } from "@/components/batch-management/BatchForm";
import { NoEventSelected } from "@/components/batch-management/NoEventSelected";
import { useBatchOrderNumber } from "@/hooks/useBatchOrderNumber";

const AdminBatches = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id");
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const { orderNumber, incrementOrderNumber } = useBatchOrderNumber(eventId);

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  if (!eventId) {
    return (
      <MainLayout>
        <NoEventSelected onNavigateToEvents={() => navigate("/")} />
      </MainLayout>
    );
  }

  const handleSuccess = () => {
    incrementOrderNumber();
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tipos de Ingressos (Lotes)</h1>
        </div>
        
        <BatchForm 
          eventId={eventId} 
          orderNumber={orderNumber}
          onCancel={() => navigate(-1)}
          onSuccess={handleSuccess}
        />
      </div>
    </MainLayout>
  );
};

export default AdminBatches;
