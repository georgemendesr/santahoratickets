
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/layouts/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { type Event } from "@/types";
import { useNavigation } from "@/hooks/useNavigation";
import { toast } from "sonner";
import { EventosFilter } from "@/components/admin/eventos/EventosFilter";
import { EventosTable } from "@/components/admin/eventos/EventosTable";
import { EmptyEventsList } from "@/components/admin/eventos/EmptyEventsList";
import { EventosLoading } from "@/components/admin/eventos/EventosLoading";

const AdminEventos = () => {
  const [filter, setFilter] = useState("todos");
  const { navigateTo, goToAdminBatches } = useNavigation();
  
  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events", filter],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      
      if (filter === "ativos") {
        query = query.gte("date", new Date().toISOString().split('T')[0]);
      } else if (filter === "passados") {
        query = query.lt("date", new Date().toISOString().split('T')[0]);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Event[];
    },
  });

  const handleViewEvent = (eventId: string) => {
    navigateTo(`/eventos/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    navigateTo(`/eventos/${eventId}/edit`);
  };

  const handleManageBatches = (eventId: string) => {
    goToAdminBatches(eventId);
  };

  const handleViewParticipants = (eventId: string) => {
    navigateTo(`/admin/participantes/lista?event_id=${eventId}`);
  };

  const handleViewAnalytics = (eventId: string) => {
    navigateTo(`/admin/analytics?event_id=${eventId}`);
  };

  const handleDuplicateEvent = (eventId: string) => {
    navigateTo(`/eventos/${eventId}/duplicate`);
  };

  const handleCreateEvent = () => {
    navigateTo("/eventos/create");
  };

  const toggleEventStatus = async (event: Event) => {
    const newStatus = event.status === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', event.id);
        
      if (error) throw error;
      
      toast.success(`Evento ${newStatus === 'published' ? 'publicado' : 'arquivado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao alterar status do evento:', error);
      toast.error('Erro ao alterar status do evento');
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
            <p className="text-muted-foreground">Gerencie seus eventos e lotes de ingressos</p>
          </div>
          <Button 
            onClick={handleCreateEvent}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Criar Evento
          </Button>
        </div>
        
        <EventosFilter 
          currentFilter={filter} 
          onFilterChange={setFilter} 
        />
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Eventos</CardTitle>
            <CardDescription>
              {filter === "todos" && "Todos os eventos cadastrados no sistema"}
              {filter === "ativos" && "Eventos ativos com data futura"}
              {filter === "passados" && "Eventos já realizados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <EventosLoading />
            ) : !events || events.length === 0 ? (
              <EmptyEventsList 
                filter={filter} 
                onCreateEvent={handleCreateEvent} 
              />
            ) : (
              <EventosTable 
                events={events}
                onViewEvent={handleViewEvent}
                onEditEvent={handleEditEvent}
                onManageBatches={handleManageBatches}
                onViewParticipants={handleViewParticipants}
                onViewAnalytics={handleViewAnalytics}
                onDuplicateEvent={handleDuplicateEvent}
                onToggleEventStatus={toggleEventStatus}
              />
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-3 flex justify-between text-sm text-muted-foreground">
            <div>
              {events ? events.length : 0} eventos encontrados
            </div>
            {events && events.length > 0 && (
              <div>
                {format(new Date(), "'Atualizado em' dd/MM/yyyy 'às' HH:mm", { locale: pt })}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEventos;
