
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  Users, 
  Settings, 
  DollarSign,
  Star,
  ArrowUpRight
} from "lucide-react";

export function ActionCards() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <CalendarDays className="h-5 w-5 text-amber-500" />
            Eventos
          </CardTitle>
          <CardDescription>Gerenciar eventos e ingressos</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/eventos")}
          >
            Ver Eventos
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Users className="h-5 w-5 text-amber-500" />
            Usuários
          </CardTitle>
          <CardDescription>Gerenciar usuários e permissões</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/users")}
          >
            Ver Usuários
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Settings className="h-5 w-5 text-amber-500" />
            Configurações
          </CardTitle>
          <CardDescription>Personalizar a plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/configuracoes")}
          >
            Configurar
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <DollarSign className="h-5 w-5 text-amber-500" />
            Financeiro
          </CardTitle>
          <CardDescription>Gestão financeira e relatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/financeiro")}
          >
            Ver Relatórios
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Star className="h-5 w-5 text-amber-500" />
            Fidelidade
          </CardTitle>
          <CardDescription>Gerenciar programa de fidelidade</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/loyalty")}
          >
            Ver Programa
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <ArrowUpRight className="h-5 w-5 text-amber-500" />
            Indicações
          </CardTitle>
          <CardDescription>Sistema de indicação de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/referrals")}
          >
            Ver Indicações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
