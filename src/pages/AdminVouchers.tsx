
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Ticket, PencilRuler, PlusCircle } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

const AdminVouchers = () => {
  const { goToAdminEvents, goToAdminBatches } = useNavigation();

  return (
    <AdminLayout>
      <div className="container max-w-7xl mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Ingressos e Vouchers</h1>
            <p className="text-muted-foreground mt-1">Gerencie tipos de ingressos e layouts de vouchers</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={goToAdminEvents}
            >
              Voltar para Eventos
            </Button>
            <Button onClick={() => goToAdminBatches()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Lote
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Ingressos</CardTitle>
              <CardDescription>Gerencie os lotes e tipos de ingressos disponíveis</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Ticket className="h-16 w-16 text-primary mb-4" />
              <Button className="w-full" onClick={() => goToAdminBatches()}>
                Gerenciar Ingressos
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Layout de Vouchers</CardTitle>
              <CardDescription>Personalize a aparência dos vouchers</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <PencilRuler className="h-16 w-16 text-primary mb-4" />
              <Link to="/admin/vouchers/design">
                <Button className="w-full">
                  Designer de Vouchers
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Manuais</CardTitle>
              <CardDescription>Adicione pedidos criados manualmente</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <PlusCircle className="h-16 w-16 text-primary mb-4" />
              <Link to="/admin/vouchers/manual-order">
                <Button className="w-full">
                  Adicionar Pedido
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVouchers;
