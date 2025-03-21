
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
  Ticket
} from "lucide-react";

export function ActionCards() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <CalendarDays className="h-5 w-5 text-amber-500" />
            Gerenciar Eventos
          </CardTitle>
          <CardDescription>Criar e editar eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/eventos")}
          >
            Acessar
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Ticket className="h-5 w-5 text-amber-500" />
            Ingressos
          </CardTitle>
          <CardDescription>Gerenciar ingressos e vouchers</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/vouchers")}
          >
            Acessar
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <DollarSign className="h-5 w-5 text-amber-500" />
            Financeiro
          </CardTitle>
          <CardDescription>Relatórios e controle financeiro</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/admin/financeiro")}
          >
            Acessar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
