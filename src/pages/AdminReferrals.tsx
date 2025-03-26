
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
import { Users, Gift, Share2 } from "lucide-react";
import { useState } from "react";

const AdminReferrals = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminLayout>
      <div className="container max-w-7xl mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Sistema de Indicações</h1>
            <p className="text-muted-foreground mt-1">Gerencie o programa de indicações e afiliados</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Campanhas de Indicação</CardTitle>
              <CardDescription>Gerencie suas campanhas de indicação ativas</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Gift className="h-16 w-16 text-primary mb-4" />
              <Link to="/admin/referrals/campaigns">
                <Button className="w-full">
                  Gerenciar Campanhas
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Indicadores</CardTitle>
              <CardDescription>Visualize os usuários que mais indicaram</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Users className="h-16 w-16 text-primary mb-4" />
              <Link to="/admin/referrals/users">
                <Button className="w-full">
                  Ver Indicadores
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Visualize estatísticas e métricas do programa</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Share2 className="h-16 w-16 text-primary mb-4" />
              <Link to="/admin/referrals/reports">
                <Button className="w-full">
                  Ver Relatórios
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReferrals;
