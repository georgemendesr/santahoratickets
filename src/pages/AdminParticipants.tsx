
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, ListChecks, BarChart } from "lucide-react";

const AdminParticipants = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isAdmin } = useRole(session);

  if (!isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <AdminLayout>
      <div className="container max-w-7xl mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Participantes</h1>
            <p className="text-muted-foreground mt-1">Gerencie participantes e visualize estatísticas de vendas</p>
          </div>
          <Link to="/admin/eventos">
            <Button variant="outline">Voltar para Eventos</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Participantes</CardTitle>
              <CardDescription>Visualize e gerencie os participantes dos eventos</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ListChecks className="h-20 w-20 text-primary mb-4" />
              <Link to="/admin/participants/list">
                <Button className="w-full">
                  Ver Participantes
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Vendas</CardTitle>
              <CardDescription>Visualize dados detalhados sobre as vendas de ingressos</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <BarChart className="h-20 w-20 text-primary mb-4" />
              <Link to="/admin/participants/sales">
                <Button className="w-full">
                  Ver Estatísticas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminParticipants;
