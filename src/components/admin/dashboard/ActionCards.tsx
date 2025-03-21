
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
  LayoutTemplate, 
  DollarSign,
  Star,
  ArrowUpRight
} from "lucide-react";

export function ActionCards() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Layout de Vouchers
          </CardTitle>
          <CardDescription>Personalizar design dos ingressos</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/vouchers")}
          >
            Personalizar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5" />
            Referrals
          </CardTitle>
          <CardDescription>Sistema de indicação de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/referrals")}
          >
            Ver Referrals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
