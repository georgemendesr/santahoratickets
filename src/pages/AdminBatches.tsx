
import { useEffect, useState } from "react";
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
import { BatchList } from "@/components/batch-management/BatchList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminBatches = () => {
  const { goToAdminEvents } = useNavigation();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id");
  const { session } = useAuth();
  const { isAdmin } = useRole(session);
  const [activeTab, setActiveTab] = useState("list");
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  const { orderNumber, incrementOrderNumber, error } = useBatchOrderNumber(eventId);

  // Carrega os detalhes do evento
  const { data: eventDetails } = useQuery({
    queryKey: ['event-details', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from('events')
        .select('title, date')
        .eq('id', eventId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

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

  // Mostrar erros do hook de número de ordem
  useEffect(() => {
    if (error) {
      console.error("Erro na obtenção do número de ordem:", error);
      toast.error("Erro ao carregar o próximo número de lote. Por favor, recarregue a página.");
    }
  }, [error]);

  const handleCreateBatchSuccess = () => {
    incrementOrderNumber();
    toast.success("Lote criado com sucesso!");
    setActiveTab("list");
  };

  const handleEditBatch = (batchId: string) => {
    setEditingBatchId(batchId);
    setActiveTab("form");
  };

  const handleCancelEdit = () => {
    setEditingBatchId(null);
    setActiveTab("list");
  };

  const handleUpdateBatchSuccess = () => {
    toast.success("Lote atualizado com sucesso!");
    setEditingBatchId(null);
    setActiveTab("list");
  };

  if (!eventId) {
    return (
      <AdminLayout>
        <NoEventSelected onNavigateToEvents={goToAdminEvents} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container max-w-5xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Lotes</h1>
            {eventDetails && (
              <p className="text-muted-foreground mt-1">
                Evento: {eventDetails.title} ({eventDetails.date})
              </p>
            )}
          </div>
          <Button variant="outline" onClick={goToAdminEvents}>
            Voltar para Eventos
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="list">Lista de Lotes</TabsTrigger>
              <TabsTrigger value="form">
                {editingBatchId ? 'Editar Lote' : 'Novo Lote'}
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "list" && (
              <Button onClick={() => {
                setEditingBatchId(null);
                setActiveTab("form");
              }}>
                Criar Novo Lote
              </Button>
            )}
          </div>
          
          <TabsContent value="list" className="space-y-4">
            <BatchList 
              eventId={eventId} 
              onEditBatch={handleEditBatch}
            />
          </TabsContent>
          
          <TabsContent value="form">
            <BatchForm 
              eventId={eventId} 
              orderNumber={orderNumber}
              batchId={editingBatchId}
              onCancel={handleCancelEdit}
              onSuccess={editingBatchId ? handleUpdateBatchSuccess : handleCreateBatchSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminBatches;
