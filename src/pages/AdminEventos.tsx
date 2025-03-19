
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  Calendar 
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { type Event } from "@/types";

const AdminEventos = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("todos");
  
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

  const handleGerenciarLotes = (eventId: string) => {
    // Corrigido para usar a rota de administração de lotes
    navigate(`/admin/batches?event_id=${eventId}`);
  };

  const handleEditarEvento = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleVerParticipantes = (eventId: string) => {
    navigate(`/admin/participants/list?event_id=${eventId}`);
  };

  const handleVerEvento = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciamento de Eventos</h1>
          <Button 
            onClick={() => navigate("/events/create")}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Criar Evento
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filtrar Eventos</CardTitle>
            <CardDescription>Selecione uma categoria para visualizar os eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === "todos" ? "default" : "outline"}
                onClick={() => setFilter("todos")}
              >
                Todos
              </Button>
              <Button 
                variant={filter === "ativos" ? "default" : "outline"}
                onClick={() => setFilter("ativos")}
              >
                Ativos
              </Button>
              <Button 
                variant={filter === "passados" ? "default" : "outline"}
                onClick={() => setFilter("passados")}
              >
                Passados
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Eventos</CardTitle>
            <CardDescription>
              {filter === "todos" && "Todos os eventos cadastrados no sistema"}
              {filter === "ativos" && "Eventos ativos com data futura"}
              {filter === "passados" && "Eventos já realizados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando eventos...</div>
            ) : !events || events.length === 0 ? (
              <div className="text-center py-8">
                Nenhum evento encontrado para esta categoria.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Ingressos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.approved_tickets || 0} vendidos</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleVerEvento(event.id)}
                            title="Visualizar evento"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditarEvento(event.id)}
                            title="Editar evento"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleGerenciarLotes(event.id)}
                            title="Gerenciar lotes"
                          >
                            <Ticket className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleVerParticipantes(event.id)}
                            title="Ver participantes"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between">
            <div className="text-sm text-muted-foreground">
              {events ? events.length : 0} eventos encontrados
            </div>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEventos;
