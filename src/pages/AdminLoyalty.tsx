
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
import { Star, Settings, Trophy, BadgePercent } from "lucide-react";

const AdminLoyalty = () => {
  return (
    <AdminLayout>
      <div className="container max-w-7xl mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Programa de Fidelidade</h1>
            <p className="text-muted-foreground mt-1">Gerencie recompensas e níveis de fidelidade</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Níveis de Fidelidade</CardTitle>
              <CardDescription>Configure os níveis e benefícios de cada etapa</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Trophy className="h-16 w-16 text-primary mb-4" />
              <Link to="/admin/loyalty/levels">
                <Button className="w-full">
                  Gerenciar Níveis
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recompensas</CardTitle>
              <CardDescription>Gerencie recompensas disponíveis para resgate</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Star className="h-16 w-16 text-primary mb-4" />
              <Link to="/admin/loyalty/rewards">
                <Button className="w-full">
                  Gerenciar Recompensas
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regras de Pontuação</CardTitle>
              <CardDescription>Configure como os clientes ganham pontos</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <BadgePercent className="h-16 w-16 text-primary mb-4" />
              <Link to="/admin/loyalty/rules">
                <Button className="w-full">
                  Configurar Regras
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLoyalty;
