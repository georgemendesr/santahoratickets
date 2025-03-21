
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function DashboardHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
        <p className="text-gray-500 mt-1">Gerencie eventos, usuários e operações</p>
      </div>
      <Button 
        onClick={() => navigate("/events/create")}
        className="bg-amber-500 hover:bg-amber-600 flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Criar Evento
      </Button>
    </div>
  );
}
