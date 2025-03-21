
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  PlusCircle, 
  Edit, 
  Ticket, 
  Users, 
  Eye, 
  Calendar,
  BarChart4,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { type Event } from "@/types";
import { useNavigation } from "@/hooks/useNavigation";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const getEventStatus = (event: Event) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    
    if (event.status === 'draft') return { label: 'Rascunho', variant: 'secondary' as const };
    if (event.status === 'ended') return { label: 'Finalizado', variant: 'secondary' as const };
    
    if (eventDate < today) {
      return { label: 'Passado', variant: 'ended' as const };
    } else if (eventDate.toDateString() === today.toDateString()) {
      return { label: 'Hoje', variant: 'warning' as const };
    } else {
      return { label: 'Ativo', variant: 'active' as const };
    }
  };

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

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
            <p className="text-muted-foreground">Gerencie seus eventos e lotes de ingressos</p>
          </div>
          <Button 
            onClick={() => navigateTo("/eventos/create")}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Criar Evento
          </Button>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <Button 
            variant={filter === "todos" ? "default" : "outline"}
            onClick={() => setFilter("todos")}
            size="sm"
          >
            Todos
          </Button>
          <Button 
            variant={filter === "ativos" ? "default" : "outline"}
            onClick={() => setFilter("ativos")}
            size="sm"
          >
            Ativos
          </Button>
          <Button 
            variant={filter === "passados" ? "default" : "outline"}
            onClick={() => setFilter("passados")}
            size="sm"
          >
            Encerrados
          </Button>
        </div>
        
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
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
              </div>
            ) : !events || events.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === "todos" ? "Você ainda não possui eventos cadastrados." : 
                   `Não há eventos ${filter === "ativos" ? "ativos" : "passados"}.`}
                </p>
                <Button 
                  onClick={() => navigateTo("/eventos/create")}
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Criar Evento
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead className="text-center">Ingressos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const status = getEventStatus(event);
                    
                    return (
                      <TableRow key={event.id} className="group">
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleEditEvent(event.id)}
                            className="font-medium hover:underline text-left w-full"
                          >
                            {event.title}
                          </button>
                        </TableCell>
                        <TableCell>
                          {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="font-medium"
                                  onClick={() => handleManageBatches(event.id)}
                                >
                                  <Ticket className="h-3 w-3 mr-1" />
                                  <span>{event.approved_tickets || 0}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs space-y-1">
                                  <div>Aprovados: {event.approved_tickets || 0}</div>
                                  <div>Pendentes: {event.pending_tickets || 0}</div>
                                  <div>Reembolsados: {event.refunded_tickets || 0}</div>
                                  <div className="pt-1 text-primary">Clique para gerenciar lotes</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewEvent(event.id)}
                              title="Visualizar evento"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditEvent(event.id)}
                              title="Editar evento"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleManageBatches(event.id)}
                              title="Gerenciar lotes"
                            >
                              <Ticket className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewParticipants(event.id)}
                              title="Ver participantes"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewAnalytics(event.id)}
                              title="Estatísticas"
                            >
                              <BarChart4 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="ml-1 lg:hidden group-hover:opacity-100 opacity-0 transition-opacity"
                            >
                              <a href={`/admin/eventos/${event.id}`}>
                                <ChevronRight className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
